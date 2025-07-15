import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";

export default function BookingSuccess() {
  const location = useLocation();
  const navigate = useNavigate();

  const [bookingInfo, setBookingInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const bookingId = location.state?.bookingId || localStorage.getItem("bookingId");

  const translateStatus = (status) => {
    switch (status) {
      case "Pending":
        return "Đang chờ xác nhận";
      case "Confirmed":
        return "Đã xác nhận";
      case "Cancelled":
        return "Đã hủy";
      default:
        return status;
    }
  };

  useEffect(() => {
    if (!bookingId) return;

    axios
      .get(`http://localhost:8081/api/patient/appointment-detail/${bookingId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then((res) => {
        console.log("Chi tiết lịch hẹn:", res.data);
        setBookingInfo(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Lỗi lấy lịch hẹn:", err);
        setLoading(false);
      });
  }, [bookingId]);

  if (!bookingId) {
    return (
      <div className="container mt-5 text-center">
        <h4>Không tìm thấy mã lịch hẹn.</h4>
        <button className="btn btn-primary mt-3" onClick={() => navigate("/")}>
          Quay lại trang chủ
        </button>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="container mt-5 text-center">
        <p>Đang tải thông tin lịch hẹn...</p>
      </div>
    );
  }

  if (!bookingInfo) {
    return (
      <div className="container mt-5 text-center">
        <h5>Không thể hiển thị thông tin lịch hẹn.</h5>
      </div>
    );
  }
  const handleCancel = async () => {
    if (!window.confirm("Bạn có chắc muốn huỷ lịch hẹn này không?")) return;

    try {
      await axios.patch(
        `http://localhost:8081/api/patient/reject-appointment/${bookingId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      alert("Lịch hẹn đã được huỷ.");

      const res = await axios.get(
        `http://localhost:8081/api/patient/appointment-detail/${bookingId}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      setBookingInfo(res.data);
    } catch (err) {
      console.error("Lỗi huỷ lịch:", err);
      alert("Không thể huỷ lịch lúc này.");
    }
  };


  return (
    <div className="container mt-5">
      <div className="card shadow p-4">
        <h3 className="text-center text-success mb-4">Đặt lịch thành công</h3>
        <p><strong>Bệnh nhân:</strong> {bookingInfo.patientName}</p>
        <p><strong>Bác sĩ:</strong> {bookingInfo.doctorName}</p>
        <p><strong>Thời gian:</strong> {new Date(bookingInfo.scheduledTime).toLocaleString("vi-VN")}</p>
        <p><strong>Trạng thái:</strong> {translateStatus(bookingInfo.status)}</p>
        <div className="text-center mt-4">
          <button
            className="btn btn-outline-primary me-2"
            onClick={() => navigate("/patient")}
          >
            Quay lại trang chủ
          </button>

          {bookingInfo.status !== "Cancelled" && (
            <button
              className="btn btn-outline-danger"
              onClick={handleCancel}
            >
              Hủy lịch hẹn
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
