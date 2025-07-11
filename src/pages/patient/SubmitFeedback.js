import React, { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../../AuthContext";

function SubmitFeedback() {
    const { token, user } = useAuth();
    const [doctorId, setDoctorId] = useState("");
    const [doctors, setDoctors] = useState([]); // Thêm state lưu danh sách bác sĩ
    const [score, setScore] = useState("");
    const [comment, setComment] = useState("");
    const [message, setMessage] = useState("");
    const [patientId, setPatientId] = useState("");

    useEffect(() => {
        // Lấy patientId từ backend
        const fetchPatientId = async () => {
            if (!user?.id) return;
            try {
                const res = await axios.get(`http://localhost:8081/api/patient/by-user/${user.id}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                if (res.data && res.data.id) {
                    setPatientId(res.data.id);
                }
            } catch (err) {
                console.error("Không lấy được patientId:", err);
            }
        };
        fetchPatientId();
    }, [user, token]);

    useEffect(() => {
        // Lấy danh sách bác sĩ
        const fetchDoctors = async () => {
            try {
                const res = await axios.get("http://localhost:8081/api/doctor/list-doctor", {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setDoctors(res.data);
            } catch (err) {
                console.error("Không lấy được danh sách bác sĩ:", err);
            }
        };
        fetchDoctors();
    }, [token]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const res = await axios.post("http://localhost:8081/api/feedback", {
                doctorId: doctorId,
                patientId: patientId,
                score: parseInt(score),
                comment: comment
            }, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json"
                }
            });

            if (res.status === 200 || res.status === 201) {
                setMessage("Gửi phản hồi thành công!");
            } else {
                setMessage("Gửi phản hồi thất bại.");
            }
        } catch (err) {
            console.error("❌ Lỗi gửi feedback:", err);
            setMessage("Gửi phản hồi thất bại.");
        }
    };

    return (
        <div className="container py-5">
            <h2>Gửi Phản Hồi</h2>
            {message && <div className="alert alert-info">{message}</div>}
            <form onSubmit={handleSubmit}>
                <div className="mb-3">
                    <label>Chọn bác sĩ</label>
                    <select
                        className="form-control"
                        value={doctorId}
                        onChange={(e) => setDoctorId(e.target.value)}
                        required
                    >
                        <option value="">-- Chọn bác sĩ --</option>
                        {doctors.map((doc) => (
                            <option key={doc.id} value={doc.id}>
                                {doc.fullName}
                            </option>
                        ))}
                    </select>
                </div>
                <div className="mb-3">
                    <label>Điểm đánh giá (1-10)</label>
                    <input type="number" className="form-control" value={score} onChange={(e) => setScore(e.target.value)} />
                </div>
                <div className="mb-3">
                    <label>Nhận xét</label>
                    <textarea className="form-control" value={comment} onChange={(e) => setComment(e.target.value)} />
                </div>
                <button type="submit" className="btn btn-primary" disabled={!patientId}>Gửi phản hồi</button>
            </form>
        </div>
    );
}

export default SubmitFeedback;
