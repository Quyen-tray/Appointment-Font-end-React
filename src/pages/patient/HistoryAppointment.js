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
  const [searchDoctor, setSearchDoctor] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [examinerList, setExaminerList] = useState([]);
  const [selectedExaminer, setSelectedExaminer] = useState("Tất cả");
  const [appliedSearchDoctor, setAppliedSearchDoctor] = useState("");
  const [appliedStartDate, setAppliedStartDate] = useState("");
  const [appliedEndDate, setAppliedEndDate] = useState("");
  const [appliedExaminer, setAppliedExaminer] = useState("Tất cả");



  const fetchAppointments = async (page = 0) => {
    try {
      setLoading(true);
      const res = await axios.get("http://localhost:8081/api/patient/my-appointment", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        params: {
          page,
          size: pageSize,
          doctorName: appliedSearchDoctor.trim() !== "" ? appliedSearchDoctor : undefined,
          startDate: appliedStartDate || undefined,
          endDate: appliedEndDate || undefined,
          status: sortStatus !== "All" ? sortStatus : undefined,
          examiner: appliedExaminer !== "Tất cả" ? appliedExaminer : undefined,
        },
      });
      setAppointments(res.data.appointments || []);
      setTotalPages(res.data.totalPages);
      setCurrentPage(res.data.currentPage);

      const uniqueExaminers = new Set();
      res.data.appointments.forEach((appt) => {
        if (appt.relative) {
          uniqueExaminers.add(`${appt.relative.fullName} (${appt.relative.relation})`);
        } else {
          uniqueExaminers.add("Bản thân");
        }
      });
      setExaminerList(Array.from(uniqueExaminers));
    } catch (err) {
      console.error("Lỗi tải danh sách lịch hẹn:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointments(currentPage);
  }, [currentPage, appliedSearchDoctor, appliedStartDate, appliedEndDate, appliedExaminer, sortStatus]);


  const sortedAppointments = [...appointments]
    .filter((a) => sortStatus === "All" || a.status === sortStatus)
    .filter((a) => {
      if (selectedExaminer === "Tất cả") return true;
      const name = a.relative
        ? `${a.relative.fullName} (${a.relative.relation})`
        : "Bản thân";
      return name === selectedExaminer;
    })
    .sort((a, b) => {
      const timeA = new Date(a.scheduledTime).getTime();
      const timeB = new Date(b.scheduledTime).getTime();
      return sortOrder === "asc" ? timeA - timeB : timeB - timeA;
    });

  const translateStatus = (status) => {
    switch (status) {
      case "PENDING":
        return { label: "Đang chờ", className: "badge bg-warning text-dark" };
      case "DONE":
        return { label: "Đã khám xong", className: "badge bg-success" };
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

  const handleResetFilters = () => {
    setSearchDoctor("");
    setStartDate("");
    setEndDate("");
    setSelectedExaminer("Tất cả");
    setCurrentPage(0);
    setSortStatus("All");
    setAppliedSearchDoctor("");
    setAppliedStartDate("");
    setAppliedEndDate("");
    setAppliedExaminer("Tất cả");

    fetchAppointments(0);
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
      <div className="d-flex flex-wrap align-items-end gap-3 mb-3">
        <div className="d-flex align-items-center">
          <label className="me-1">Bác sĩ:</label>
          <input
            type="text"
            className="form-control form-control-sm"
            style={{ width: "180px" }}
            value={searchDoctor}
            onChange={(e) => setSearchDoctor(e.target.value)}
          />
        </div>

        <div className="d-flex align-items-center">
          <label className="me-1">Từ ngày:</label>
          <input
            type="date"
            className="form-control form-control-sm"
            style={{ width: "160px" }}
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />
        </div>

        <div className="d-flex align-items-center">
          <label className="me-1">Đến ngày:</label>
          <input
            type="date"
            className="form-control form-control-sm"
            style={{ width: "160px" }}
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
          />
        </div>

        <div className="d-flex align-items-center">
          <label className="me-1">Trạng thái:</label>
          <select
            className="form-select form-select-sm"
            value={sortStatus}
            onChange={(e) => setSortStatus(e.target.value)}
          >
            <option value="All">Tất cả</option>
            <option value="PENDING">Đang chờ</option>
            <option value="APPROVED">Đã duyệt</option>
            <option value="CANCELLED">Đã huỷ</option>
            <option value="DONE">Đã khám</option>
          </select>
        </div>

        <div className="d-flex align-items-center">
          <label className="me-1">Người khám:</label>
          <select
            className="form-select form-select-sm"
            value={selectedExaminer}
            onChange={(e) => setSelectedExaminer(e.target.value)}
          >
            <option value="Tất cả">Tất cả</option>
            {examinerList.map((name, idx) => (
              <option key={idx} value={name}>{name}</option>
            ))}
          </select>
        </div>

        <div className="d-flex align-items-center">
          <button
            className="btn btn-sm btn-primary me-2"
            onClick={() => {
              setAppliedSearchDoctor(searchDoctor);
              setAppliedStartDate(startDate);
              setAppliedEndDate(endDate);
              setAppliedExaminer(selectedExaminer);
              setCurrentPage(0);
            }}
          >
            Tìm
          </button>
          <button className="btn btn-sm btn-primary" onClick={handleResetFilters}>
            Làm mới
          </button>
        </div>
      </div>
      {loading ? (
        <div className="text-center">Đang tải danh sách lịch hẹn...</div>
      ) : appointments.length === 0 ? (
        <p className="text-center">Bạn chưa có lịch hẹn nào.</p>
      ) : (
        <>
          <div className="table-responsive">
            <table className="table table-bordered table-hover shadow-sm">
              <thead className="table-primary">
                <tr>
                  <th>STT</th>
                  <th>Bác sĩ</th>
                  <th>Người khám</th>
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
                      <td>
                        {appt.relative
                          ? `${appt.relative.fullName} (${appt.relative.relation})`
                          : "Bản thân"}
                      </td>
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
