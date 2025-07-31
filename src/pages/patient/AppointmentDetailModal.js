import "../../assets/css/AppointmentDetailModal.css";

export default function AppointmentDetailModal({ show, onClose, data }) {
  if (!show || !data) return null;

  const statusLabel = {
    PENDING: "Đang chờ",
    APPROVED: "Đã duyệt",
    CANCELLED: "Đã huỷ",
    CONFIRMED: "Đã xác nhận",
  }[data.status] || data.status;

  return (
    <div className="custom-modal-overlay">
      <div className="custom-modal">
        <div className="custom-modal-header">
          <h5>Chi tiết lịch hẹn</h5>
          <button className="close-button" onClick={onClose}>×</button>
        </div>
        <div className="custom-modal-body">
          <p><strong>Bác sĩ:</strong> {data.doctorName}</p>
          <p><strong>Thời gian:</strong> {new Date(data.scheduledTime).toLocaleString("vi-VN")}</p>
          <p><strong>Phòng:</strong> {data.roomName || "Chưa xác định"}</p>
          <p><strong>Trạng thái:</strong> {statusLabel}</p>
        </div>
        <div className="custom-modal-footer">
          <button className="btn btn-secondary" onClick={onClose}>Đóng</button>
        </div>
      </div>
    </div>
  );
}
