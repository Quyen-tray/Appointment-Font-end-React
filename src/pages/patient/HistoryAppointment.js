import React, { useEffect, useState } from "react";
import axios from "axios";
import RescheduleModal from "../../components/RescheduleModal";


export default function PatientAppointments() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortOrder, setSortOrder] = useState("asc");
  const [showModal, setShowModal] = useState(false);
  const [rescheduleId, setRescheduleId] = useState(null);
  const [currentTime, setCurrentTime] = useState("");

  const sortAppointments = (appointments, order) => {
    return [...appointments].sort((a, b) => {
      const timeA = new Date(a.scheduledTime);
      const timeB = new Date(b.scheduledTime);
      return order === "asc" ? timeA - timeB : timeB - timeA;
    });
  };


  const translateStatus = (status) => {
    switch (status) {
      case "Pending":
        return { label: "Đang chờ", className: "badge bg-warning text-dark" };
      case "Confirmed":
        return { label: "Đã xác nhận", className: "badge bg-success" };
      case "Cancelled":
        return { label: "Đã huỷ", className: "badge bg-danger" };
      default:
        return { label: status, className: "badge bg-secondary" };
    }
  };
  const handleCancel = async (appointmentId) => {
    const confirm = window.confirm("Bạn có chắc chắn muốn huỷ lịch hẹn này không?");
    if (!confirm) return;

    try {
      await axios.patch(
        `http://localhost:8081/api/patient/reject-appointment/${appointmentId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      alert("Lịch hẹn đã được huỷ.");

      setAppointments((prev) =>
        prev.map((appt) =>
          appt.id === appointmentId
            ? { ...appt, status: "Cancelled" }
            : appt
        )
      );
    } catch (err) {
      console.error("Lỗi huỷ lịch:", err);
      alert("Không thể huỷ lịch lúc này.");
    }
  };

  const handleReschedule = (appointmentId, scheduledTime) => {
    try {
      const dateObj = new Date(scheduledTime);
      if (isNaN(dateObj)) throw new Error("Invalid date");
      const localTime = new Date(dateObj.getTime() + 7 * 60 * 60 * 1000);
      const formattedTime = localTime.toISOString().slice(0, 16);
      setRescheduleId(appointmentId);
      setCurrentTime(formattedTime);
      setShowModal(true);
    } catch (err) {
      console.error("Không thể xử lý thời gian lịch hẹn:", scheduledTime);
      alert("Thời gian lịch hẹn không hợp lệ.");
    }
  };
  const handleSaveReschedule = async (newTime) => {
    try {
      // Convert date to UTC by subtracting 7 hours
      const utcDate = new Date(newTime);
      utcDate.setHours(utcDate.getHours());

      // Format to yyyy-MM-ddTHH:mm:ss
      const pad = (n) => String(n).padStart(2, "0");
      const localTimeStr =
        utcDate.getFullYear() +
        "-" +
        pad(utcDate.getMonth() + 1) +
        "-" +
        pad(utcDate.getDate()) +
        "T" +
        pad(utcDate.getHours()) +
        ":" +
        pad(utcDate.getMinutes()) +
        ":" +
        pad(utcDate.getSeconds());

      console.log("Gửi lên (UTC):", localTimeStr);

      await axios.put(
        `http://localhost:8081/api/patient/updateTime-appointment/${rescheduleId}`,
        {
          newScheduledTime: localTimeStr,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      alert("Đã đổi thời gian thành công.");
      setAppointments((prev) =>
        prev.map((appt) =>
          appt.id === rescheduleId ? { ...appt, scheduledTime: localTimeStr } : appt
        )
      );
      setShowModal(false);
    } catch (err) {
      console.error("Lỗi đổi giờ:", err?.response?.data || err.message);
      alert("Không thể đổi thời gian lịch hẹn.");
    }
  };

  useEffect(() => {
    axios
      .get("http://localhost:8081/api/patient/my-appointment", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then((res) => {
        const sorted = sortAppointments(res.data, sortOrder);
        setAppointments(sorted);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Lỗi tải danh sách lịch hẹn:", err);
        setLoading(false);
      });
  }, [sortOrder]);

  if (loading) {
    return (
      <div className="container mt-5 text-center">
        <p>Đang tải danh sách lịch hẹn...</p>
      </div>
    );
  }

  return (
    <div className="container mt-5">
      <h3 className="mb-4 text-center">Lịch hẹn của bạn</h3>
      {appointments.length === 0 ? (
        <p className="text-center">Bạn chưa có lịch hẹn nào.</p>
      ) : (
        <div className="table-responsive">
          <table className="table table-bordered table-hover shadow-sm">
            <thead className="table-light">
              <tr>
                <th>STT</th>
                <th>Bác sĩ</th>
                <th>
                  <div className="d-flex align-items-center justify-content-between">
                    <span className="fw-bold">Thời gian khám</span>
                    <button
                      className="btn btn-sm btn-outline-secondary ms-2"
                      onClick={() => {
                        const newOrder = sortOrder === "asc" ? "desc" : "asc";
                        setSortOrder(newOrder);
                        setAppointments(sortAppointments(appointments, newOrder));
                      }}
                      title={`Sắp xếp ${sortOrder === "asc" ? "Khám sớm → Khám muộn" : "Khám muộn → Khám sớm"}`}
                    >
                      {sortOrder === "asc" ? "▲" : "▼"}
                    </button>
                  </div>
                </th>
                <th>Trạng thái</th>
                <th className="text-center"></th>
              </tr>
            </thead>
            <tbody>
              {appointments.map((appt, index) => {
                const { label, className } = translateStatus(appt.status);
                return (
                  <tr key={appt.id}>
                    <td>{index + 1}</td>
                    <td>{appt.doctorName}</td>
                    <td>{new Date(appt.scheduledTime).toLocaleString("vi-VN")}</td>
                    <td><span className={className}>{label}</span></td>
                    <td className="text-center">
                      {appt.status === "Pending" && (
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

                      {appt.status === "Confirmed" && (
                        <span className="text-muted fst-italic">Không thể chỉnh sửa</span>
                      )}

                      {appt.status === "Cancelled" && (
                        <span className="badge bg-danger" >Đã huỷ</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
      <RescheduleModal
        show={showModal}
        currentTime={currentTime}
        onClose={() => setShowModal(false)}
        onSave={handleSaveReschedule}
      />
    </div>
  );
}
