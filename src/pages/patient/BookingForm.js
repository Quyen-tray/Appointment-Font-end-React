import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

export default function BookingForm() {
  const [doctorsList, setDoctorsList] = useState([]);
  const [selectedDoctorId, setSelectedDoctorId] = useState("");
  const [selectedDoctorName, setSelectedDoctorName] = useState("");
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    fetch("http://localhost:8081/api/doctor/list-doctor")
      .then((res) => res.json())
      .then((data) => {
        setDoctorsList(data);
        if (data.length > 0) {
          setSelectedDoctorId(data[0].id);
          setSelectedDoctorName(data[0].fullName);
        }
      })
      .catch((err) => console.error("Error loading doctors:", err));
  }, []);

  const generateTimes = (start, end) => {
    const times = [];
    for (let h = start; h <= end; h++) {
      for (let m = 0; m < 60; m += 15) {
        if (h === end && m > 15) break;
        const hour = String(h).padStart(2, "0");
        const min = String(m).padStart(2, "0");
        times.push(`${hour}:${min}`);
      }
    }
    return times;
  };
  const morningSlots = generateTimes(6, 11);
  const afternoonSlots = generateTimes(13, 16);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedDoctorId) {
      alert("Vui lòng chọn bác sĩ!");
      return;
    }
    if (!selectedDate) {
      alert("Vui lòng chọn ngày!");
      return;
    }
    if (!selectedTime) {
      alert("Vui lòng chọn giờ!");
      return;
    }

    const [hour, minute] = selectedTime.split(":");
    const scheduledTime = new Date(
      selectedDate.getFullYear(),
      selectedDate.getMonth(),
      selectedDate.getDate(),
      parseInt(hour),
      parseInt(minute)
    );

    scheduledTime.setHours(scheduledTime.getHours() + 7);
    const isoTime = scheduledTime.toISOString();

    const requestData = {
      doctorId: selectedDoctorId,
      scheduledTime: isoTime
    };

    try {
      const res = await axios.post(
        "http://localhost:8081/api/patient/book-appointments",
        requestData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      console.log("Kết quả đặt lịch:", res.data);
      const bookingId = res.data.appointmentId;
      navigate("/booking-success", {
        state: { bookingId }
      });
    } catch (error) {
      console.error(error);
      alert(error.response?.data || "Đặt lịch thất bại");
    }
  };

  return (
    <div className="container my-4">
      <h2 className="text-center mb-4">Đặt lịch khám</h2>
      <div className="card shadow">
        <div className="card-body">
          <form onSubmit={handleSubmit}>
            {/* bác sĩ */}
            <div className="mb-3">
              <label className="form-label fw-bold">Bác sĩ:</label>
              <select
                className="form-select"
                value={selectedDoctorId}
                onChange={(e) => {
                  setSelectedDoctorId(e.target.value);
                  const bs = doctorsList.find(x => x.id === parseInt(e.target.value));
                  if (bs) setSelectedDoctorName(bs.fullName);
                }}
              >
                {doctorsList.map((bs) => (
                  <option key={bs.id} value={bs.id}>
                    {bs.fullName}
                  </option>
                ))}
              </select>
            </div>

            {/* ngày */}
            <div className="mb-3">
              <label className="form-label fw-bold">Ngày khám:</label>
              <DatePicker
                className="form-control"
                selected={selectedDate}
                onChange={(date) => {
                  setSelectedDate(date);
                  setSelectedTime("");
                }}
                dateFormat="dd/MM/yyyy"
                minDate={new Date()}
                placeholderText="Chọn ngày"
              />
            </div>

            {/* buổi sáng */}
            <div className="mb-3">
              <label className="form-label fw-bold">Buổi sáng:</label>
              <div className="d-flex flex-wrap gap-2">
                {morningSlots.map((time) => (
                  <button
                    type="button"
                    key={time}
                    className={`btn ${selectedTime === time
                        ? "btn-success"
                        : "btn-outline-secondary"
                      }`}
                    onClick={() => setSelectedTime(time)}
                    disabled={!selectedDate}
                  >
                    {time}
                  </button>
                ))}
              </div>
            </div>

            {/* buổi chiều */}
            <div className="mb-3">
              <label className="form-label fw-bold">Buổi chiều:</label>
              <div className="d-flex flex-wrap gap-2">
                {afternoonSlots.map((time) => (
                  <button
                    type="button"
                    key={time}
                    className={`btn ${selectedTime === time
                        ? "btn-success"
                        : "btn-outline-secondary"
                      }`}
                    onClick={() => setSelectedTime(time)}
                    disabled={!selectedDate}
                  >
                    {time}
                  </button>
                ))}
              </div>
            </div>

            {/* submit */}
            <button type="submit" className="btn btn-primary w-100">
              Tiếp tục
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
