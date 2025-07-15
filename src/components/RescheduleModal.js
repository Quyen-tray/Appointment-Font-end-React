import React, { useEffect, useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

export default function RescheduleModal({ show, onClose, onSave, currentTime }) {
  const [newTime, setNewTime] = useState(null);

  const getMinTime = () => {
    const date = newTime ? new Date(newTime) : new Date();
    date.setHours(6, 0, 0, 0);
    return date;
  };

  const getMaxTime = () => {
    const date = newTime ? new Date(newTime) : new Date();
    date.setHours(16, 30, 0, 0);
    return date;
  };

  useEffect(() => {
    if (currentTime) {
      const parsed = new Date(currentTime);
      if (!isNaN(parsed)) {
        setNewTime(parsed);
      }
    }
  }, [currentTime]);

  if (!show) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h5 className="mb-3">Đổi thời gian lịch hẹn</h5>

        <DatePicker
          selected={newTime}
          onChange={(date) => setNewTime(date)}
          showTimeSelect
          timeFormat="HH:mm"
          timeIntervals={15}
          dateFormat="dd/MM/yyyy HH:mm"
          minDate={new Date()}
          minTime={getMinTime()}
          maxTime={getMaxTime()}
          className="form-control"
          placeholderText="Chọn ngày giờ"
        />

        <div className="d-flex justify-content-end gap-2 mt-3">
          <button className="btn btn-secondary" onClick={onClose}>
            Huỷ
          </button>
          <button
            className="btn btn-primary"
            onClick={() => {
              if (newTime) {
                onSave(newTime.toISOString());
              } else {
                alert("Vui lòng chọn thời gian hợp lệ.");
              }
            }}
          >
            Lưu
          </button>
        </div>
      </div>
    </div>
  );
}
