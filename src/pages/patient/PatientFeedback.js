import React, { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../../AuthContext";

function PatientFeedback() {
    const { token, user } = useAuth();
    const [feedbacks, setFeedbacks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [page, setPage] = useState(0);
    const [hasNext, setHasNext] = useState(true);
    const pageSize = 20;

    useEffect(() => {
        fetchFeedbacks();
    }, [page, token]);

    const fetchFeedbacks = async () => {
        setLoading(true);
        try {
            const res = await axios.get(
                `http://localhost:8081/api/feedback?page=${page}&size=${pageSize}`,
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            );

            if (res.data.length < pageSize) {
                setHasNext(false);
            } else {
                setHasNext(true);
            }

            setFeedbacks(res.data);
        } catch (err) {
            console.error("Lỗi khi lấy feedback:", err);
            setError("Không thể tải dữ liệu phản hồi.");
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Bạn có chắc muốn xóa phản hồi này?")) return;

        try {
            await axios.delete(`http://localhost:8081/api/feedback/${id}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            fetchFeedbacks(); // Reload lại sau khi xóa
        } catch (err) {
            alert("Xóa phản hồi thất bại!");
            console.error(err);
        }
    };

    const renderStars = (score) => {
        const validScore = Math.max(0, Math.min(score, 5));
        return (
            <span style={{ color: "#f5c518", fontSize: "1.1rem" }}>
                {"★".repeat(validScore)}{"☆".repeat(5 - validScore)}
            </span>
        );
    };

    const nextPage = () => setPage((prev) => prev + 1);
    const prevPage = () => setPage((prev) => (prev > 0 ? prev - 1 : 0));

    return (
        <div className="container py-5">
            <h2 className="text-center mb-4">Phản Hồi Của Bệnh Nhân</h2>

            {loading ? (
                <div className="text-center">Đang tải...</div>
            ) : error ? (
                <div className="text-danger text-center">{error}</div>
            ) : feedbacks.length === 0 ? (
                <div className="text-center">Không có phản hồi nào.</div>
            ) : (
                <>
                    <div className="row">
                        {feedbacks.map((fb) => {
                            const isOwner = String(user?.patientId) === String(fb.patientId);
                            return (
                                <div className="col-md-6 mb-4" key={fb.id}>
                                    <div className="card shadow-sm rounded-4 border-0 h-100 position-relative">
                                        <div className="card-body">
                                            <div className="d-flex align-items-center mb-2">
                                                <div className="me-3">
                                                    <i className="fa fa-user-circle fa-2x text-primary"></i>
                                                </div>
                                                <div>
                                                    <h6 className="mb-0">{fb.patientName || "Ẩn danh"}</h6>
                                                    <small className="text-muted">
                                                        Gửi ngày: {new Date(fb.created).toLocaleString("vi-VN")}
                                                    </small>
                                                </div>
                                                {isOwner && (
                                                    <button
                                                        className="btn btn-sm btn-outline-danger position-absolute top-0 end-0 mt-2 me-2"
                                                        onClick={() => handleDelete(fb.id)}
                                                    >
                                                        Xóa
                                                    </button>
                                                )}
                                            </div>
                                            <p className="mb-1"><strong>Bác sĩ:</strong> {fb.doctorName || "Không rõ"}</p>
                                            <p className="mb-1">{renderStars(fb.score)}</p>
                                            <p className="text-muted fst-italic">"{fb.comment}"</p>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    <div className="d-flex justify-content-between mt-4">
                        <button className="btn btn-outline-secondary" disabled={page === 0} onClick={prevPage}>
                            ← Trang trước
                        </button>
                        <span>Trang {page + 1}</span>
                        <button className="btn btn-outline-primary" disabled={!hasNext} onClick={nextPage}>
                            Trang sau →
                        </button>
                    </div>
                </>
            )}
        </div>
    );
}

export default PatientFeedback;
