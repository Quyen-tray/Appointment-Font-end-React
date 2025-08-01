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
  const [relatives, setRelatives] = useState([]);
  const [selectedRelativeId, setSelectedRelativeId] = useState("");
  const [reason, setReason] = useState("");
  const [departmentsList, setDepartmentsList] = useState([]);
  const [selectedDepartmentId, setSelectedDepartmentId] = useState("");



  const navigate = useNavigate();

  useEffect(() => {
  fetch("http://localhost:8081/api/department/getall-departments")
    .then((res) => res.json())
    .then((data) => {
      if (Array.isArray(data)) {
        setDepartmentsList(data); 
        if (data.length > 0) {
          setSelectedDepartmentId(data[0].id);
        }
      } else {
        setDepartmentsList([]); 
      }
    });

  axios
    .get("http://localhost:8081/api/patient/relatives/list_relative", {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}` },
    })
    .then((res) => {
      setRelatives(res.data);
      if (res.data.length > 0) {
        setSelectedRelativeId(res.data[0].id);
      }
    });
}, []);


  useEffect(() => {
    if (!selectedDepartmentId) return;
    axios
      .get(`http://localhost:8081/api/doctor/by-department?departmentId=${selectedDepartmentId}`)
      .then((res) => {
        setDoctorsList(res.data);
        if (res.data.length > 0) {
          setSelectedDoctorId(res.data[0].id);
          setSelectedDoctorName(res.data[0].fullName);
        } else {
          setSelectedDoctorId("");
          setSelectedDoctorName("");
        }
      });
  }, [selectedDepartmentId]);

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

    if (!selectedDoctorId || !selectedDate || !selectedTime) return;

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
      scheduledTime: isoTime,
      relativeId: selectedRelativeId || null,
      reason: reason.trim(),
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

      const bookingId = res.data.appointmentId;
      navigate("/patient/booking-success", {
        state: { bookingId },
      });
    } catch (error) {
      alert(error.response?.data || "Đặt lịch thất bại");
    }
  };

  return (
    <div className="container my-4">
      <h2 className="text-center mb-4">Đặt lịch khám</h2>
      <div className="card shadow">
        <div className="card-body">
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="form-label fw-bold">Khoa:</label>
              <select
                className="form-select"
                value={selectedDepartmentId}
                onChange={(e) => setSelectedDepartmentId(e.target.value)}
              >
                {departmentsList.map((dept) => (
                  <option key={dept.id} value={dept.id}>
                    {dept.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="mb-3">
              <label className="form-label fw-bold">Bác sĩ:</label>
              <select
                className="form-select"
                value={selectedDoctorId}
                onChange={(e) => {
                  setSelectedDoctorId(e.target.value);
                  const bs = doctorsList.find((x) => x.id === parseInt(e.target.value));
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

            <div className="mb-3">
              <label className="form-label fw-bold">Người khám:</label>
              <select
                className="form-select"
                value={selectedRelativeId}
                onChange={(e) => setSelectedRelativeId(e.target.value)}
              >
                <option value="">Bản thân</option>
                {relatives.map((r) => (
                  <option key={r.id} value={r.id}>
                    {r.fullName} {r.relation ? `(${r.relation})` : ""}
                  </option>
                ))}
              </select>
            </div>

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

            <div className="mb-3">
              <label className="form-label fw-bold">Buổi sáng:</label>
              <div className="d-flex flex-wrap gap-2">
                {morningSlots.map((time) => (
                  <button
                    type="button"
                    key={time}
                    className={`btn ${selectedTime === time ? "btn-success" : "btn-outline-secondary"}`}
                    onClick={() => setSelectedTime(time)}
                    disabled={!selectedDate}
                  >
                    {time}
                  </button>
                ))}
              </div>
            </div>

            <div className="mb-3">
              <label className="form-label fw-bold">Buổi chiều:</label>
              <div className="d-flex flex-wrap gap-2">
                {afternoonSlots.map((time) => (
                  <button
                    type="button"
                    key={time}
                    className={`btn ${selectedTime === time ? "btn-success" : "btn-outline-secondary"}`}
                    onClick={() => setSelectedTime(time)}
                    disabled={!selectedDate}
                  >
                    {time}
                  </button>
                ))}
              </div>
            </div>

            <div className="mb-3">
              <label className="form-label fw-bold">Lý do khám:</label>
              <textarea
                className="form-control"
                rows="3"
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="Nhập lý do khám bệnh (ví dụ: đau đầu, khám định kỳ...)"
                required
              />
            </div>

            <button type="submit" className="btn btn-primary w-100">
              Tiếp tục
            </button>
          </form>

          <button
            type="button"
            className="btn btn-secondary w-100 mt-2"
            onClick={() => navigate("/patient")}
          >
            Quay lại trang chủ
          </button>
        </div>
      </div>
    </div>
  );
}