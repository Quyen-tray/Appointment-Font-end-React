import React, { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../../AuthContext";
import feedbackBg from "../../assets/img/empty-wooden-table-blurred-veterinary-260nw-2630198185.webp";

function SubmitFeedback() {
    const { token, user } = useAuth();
    const [doctorId, setDoctorId] = useState("");
    const [doctors, setDoctors] = useState([]);
    const [score, setScore] = useState(0);
    const [comment, setComment] = useState("");
    const [message, setMessage] = useState("");
    const [patientId, setPatientId] = useState("");

    useEffect(() => {
        if (!user?.id) return;
        const fetchPatientId = async () => {
            try {
                const res = await axios.get(
                    `http://localhost:8081/api/patient/by-user/${user.id}`,
                    { headers: { Authorization: `Bearer ${token}` } }
                );
                setPatientId(res.data?.id || "");
            } catch (err) {
                console.error("Không lấy được patientId:", err);
            }
        };
        fetchPatientId();
    }, [user, token]);

    useEffect(() => {
        const fetchDoctors = async () => {
            try {
                const res = await axios.get(
                    "http://localhost:8081/api/doctor/list-doctor",
                    { headers: { Authorization: `Bearer ${token}` } }
                );
                setDoctors(res.data);
            } catch (err) {
                console.error("Không lấy được danh sách bác sĩ:", err);
            }
        };
        fetchDoctors();
    }, [token]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (score <= 0) {
            setMessage("Vui lòng chọn số sao đánh giá trước khi gửi!");
            return;
        }

        try {
            const res = await axios.post(
                "http://localhost:8081/api/feedback",
                { doctorId, patientId, score, comment },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                }
            );

            if (res.status === 200 || res.status === 201) {
                window.alert("Cảm ơn, chúng tôi đã nhận được phản hồi từ bạn!");
                setDoctorId("");
                setScore(0);
                setComment("");
                setMessage("");
            } else {
                setMessage("Gửi phản hồi thất bại.");
            }
        } catch (err) {
            console.error("❌ Lỗi gửi feedback:", err);
            setMessage("Gửi phản hồi thất bại.");
        }
    };

    return (
        <div
            style={{
                backgroundImage: `url(${feedbackBg})`,
                backgroundSize: "cover",
                backgroundRepeat: "no-repeat",
                backgroundPosition: "center",
                backgroundAttachment: "fixed",
                minHeight: "100vh",
                width: "100vw",
            }}
        >
            <div
                className="container d-flex justify-content-center align-items-center py-5"
                style={{ minHeight: "100vh" }}
            >
                <div
                    className="card shadow rounded-4 p-4 w-100 bg-light bg-opacity-75"
                    style={{ maxWidth: 600 }}
                >
                    <h3 className="mb-4 text-center">Gửi Phản Hồi</h3>

                    {message && (
                        <div className="alert alert-info text-center">{message}</div>
                    )}

                    <form onSubmit={handleSubmit}>
                        <div className="mb-3">
                            <label className="form-label">Chọn bác sĩ</label>
                            <select
                                className="form-select"
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
                            <label className="form-label">Đánh giá</label>
                            <div className="d-flex gap-1">
                                {[1, 2, 3, 4, 5].map((value) => (
                                    <span
                                        key={value}
                                        onClick={() => setScore(value)}
                                        style={{
                                            fontSize: "1.8rem",
                                            color: value <= score ? "gold" : "#ccc",
                                            cursor: "pointer",
                                        }}
                                    >
                                        ★
                                    </span>
                                ))}
                            </div>
                        </div>

                        <div className="mb-3">
                            <label className="form-label">Nhận xét</label>
                            <textarea
                                className="form-control"
                                rows={4}
                                placeholder="Viết nhận xét của bạn tại đây..."
                                value={comment}
                                onChange={(e) => setComment(e.target.value)}
                            />
                        </div>

                        <div className="text-end">
                            <button
                                className="btn btn-primary px-4"
                                type="submit"
                                disabled={!patientId}
                            >
                                Gửi phản hồi
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default SubmitFeedback;
