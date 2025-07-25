import React, { useEffect, useState } from "react";
import axios from "axios";
import RescheduleModal from "../../components/RescheduleModal";
import AppointmentDetailModal from "./AppointmentDetailModal";


export default function PatientAppointments() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortOrder, setSortOrder] = useState("asc");
  const [showModal, setShowModal] = useState(false);
  const [rescheduleId, setRescheduleId] = useState(null);
  const [currentTime, setCurrentTime] = useState("");
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const pageSize = 7;
  const [sortStatus, setSortStatus] = useState("All");
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);



  const fetchAppointments = async () => {
    try {
      setLoading(true);
      const res = await axios.get("http://localhost:8081/api/patient/my-appointment", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        params: { page: currentPage, size: pageSize },
      });
      setAppointments(res.data.appointments || []);
      setTotalPages(res.data.totalPages);
    } catch (err) {
      console.error("Lỗi tải danh sách lịch hẹn:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, [currentPage]);

  const sortedAppointments = [...appointments]
    .filter((a) => sortStatus === "All" || a.status === sortStatus)
    .sort((a, b) => {
      const timeA = new Date(a.scheduledTime).getTime();
      const timeB = new Date(b.scheduledTime).getTime();
      return sortOrder === "asc" ? timeA - timeB : timeB - timeA;
    });

  const translateStatus = (status) => {
    switch (status) {
      case "PENDING":
        return { label: "Đang chờ", className: "badge bg-warning text-dark" };
      case "CONFIRMED":
        return { label: "Đã xác nhận", className: "badge bg-success" };
      case "CANCELLED":
        return { label: "Đã huỷ", className: "badge bg-danger" };
      case "APPROVED":
        return { label: "Đã duyệt", className: "badge bg-success" };
      default:
        return { label: status, className: "badge bg-secondary" };
    }
  };

  const handleCancel = async (appointmentId) => {
    if (!window.confirm("Bạn có chắc chắn muốn huỷ lịch hẹn này không?")) return;
    try {
      await axios.patch(
        `http://localhost:8081/api/patient/reject-appointment/${appointmentId}`,
        {},
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      alert("Lịch hẹn đã được huỷ.");
      fetchAppointments();
    } catch (err) {
      console.error("Lỗi huỷ lịch:", err);
      alert("Không thể huỷ lịch lúc này.");
    }
  };

  const handleReschedule = (appointmentId, scheduledTime) => {
    try {
      const dateObj = new Date(scheduledTime);
      const localTime = new Date(dateObj.getTime() + 7 * 60 * 60 * 1000);
      const formatted = localTime.toISOString().slice(0, 16);
      setRescheduleId(appointmentId);
      setCurrentTime(formatted);
      setShowModal(true);
    } catch (err) {
      alert("Thời gian lịch hẹn không hợp lệ.");
    }
  };

  const handleSaveReschedule = async (newTime) => {
    try {
      const dateVN = new Date(newTime);
      const formatted =
        `${dateVN.getFullYear()}-${String(dateVN.getMonth() + 1).padStart(2, "0")}-${String(dateVN.getDate()).padStart(2, "0")}T` +
        `${String(dateVN.getHours()).padStart(2, "0")}:${String(dateVN.getMinutes()).padStart(2, "0")}:${String(dateVN.getSeconds()).padStart(2, "0")}`;

      await axios.put(
        `http://localhost:8081/api/patient/updateTime-appointment/${rescheduleId}`,
        { scheduledTime: formatted },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      alert("Đã đổi thời gian thành công.");
      fetchAppointments();
      setShowModal(false);
    } catch (err) {
      alert("Không thể đổi thời gian lịch hẹn.");
    }
  };

  const renderPagination = () => {
    const pages = [];
    for (let i = 0; i < totalPages; i++) {
      pages.push(
        <button
          key={i}
          onClick={() => setCurrentPage(i)}
          className={`btn btn-sm ${currentPage === i ? "btn-primary" : "btn-outline-primary"} mx-1`}
        >
          {i + 1}
        </button>
      );
    }
    return <div className="text-center mt-3">{pages}</div>;
  };

  return (
    <div className="container mt-5">
      <h3 className="mb-4 text-center">Lịch hẹn của bạn</h3>
      {loading ? (
        <div className="text-center">Đang tải danh sách lịch hẹn...</div>
      ) : appointments.length === 0 ? (
        <p className="text-center">Bạn chưa có lịch hẹn nào.</p>
      ) : (
        <>
          <div className="d-flex justify-content-end mb-2">
            <label className="me-2">Trạng Thái:</label>
            <select
              className="form-select form-select-sm w-auto"
              value={sortStatus}
              onChange={(e) => setSortStatus(e.target.value)}
            >
              <option value="All">Tất cả</option>
              <option value="PENDING">Đang chờ</option>
              <option value="APPROVED">Đã xác nhận</option>
              <option value="CANCELLED">Đã huỷ</option>
            </select>
          </div>
          <div className="table-responsive">
            <table className="table table-bordered table-hover shadow-sm">
              <thead className="table-light">
                <tr>
                  <th>STT</th>
                  <th>Bác sĩ</th>
                  <th>
                    <div className="d-flex justify-content-between align-items-center">
                      <span>Thời gian khám</span>
                      <button
                        className="btn btn-sm btn-outline-secondary"
                        onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
                      >
                        {sortOrder === "asc" ? "▲" : "▼"}
                      </button>
                    </div>
                  </th>
                  <th>Phòng</th>
                  <th>Trạng thái</th>
                  <th className="text-center">Thao tác</th>
                  <th className="text-center">Chi tiết</th>
                </tr>
              </thead>
              <tbody>
                {sortedAppointments.map((appt, index) => {
                  const { label, className } = translateStatus(appt.status);
                  return (
                    <tr key={appt.id}>
                      <td>{index + 1 + currentPage * pageSize}</td>
                      <td>{appt.doctorName}</td>
                      <td>{new Date(appt.scheduledTime).toLocaleString("vi-VN")}</td>
                      <td>{appt.roomName}</td>
                      <td><span className={className}>{label}</span></td>
                      <td className="text-center">
                        {appt.status === "PENDING" && (
                          <>
                            <button
                              className="btn btn-sm btn-outline-primary me-2"
                              onClick={() => handleReschedule(appt.id, appt.scheduledTime)}
                            >
                              Đổi giờ
                            </button>
                            <button
                              className="btn btn-sm btn-outline-danger"
                              onClick={() => handleCancel(appt.id)}
                            >
                              Hủy
                            </button>
                          </>
                        )}
                        {appt.status === "CONFIRMED" && (
                          <span className="text-muted fst-italic">Không thể chỉnh sửa</span>
                        )}
                        {appt.status === "CANCELLED" && (
                          <span className="badge bg-danger">Đã huỷ</span>
                        )}
                      </td>
                      <td className="text-center align-middle">
                        <button
                          className="btn btn-sm btn-info text-white"
                          onClick={() => {
                            setSelectedAppointment(appt);
                            setShowDetailModal(true);
                          }}
                        >
                          Xem chi tiết
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          {renderPagination()}
        </>
      )}
      <RescheduleModal
        show={showModal}
        currentTime={currentTime}
        onClose={() => setShowModal(false)}
        onSave={handleSaveReschedule}
      />
      <AppointmentDetailModal
        show={showDetailModal}
        onClose={() => setShowDetailModal(false)}
        data={selectedAppointment}
      />

    </div>
  );

}
