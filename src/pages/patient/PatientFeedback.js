import React, { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../../AuthContext";

function PatientFeedback() {
    const { token } = useAuth();
    const [feedbacks, setFeedbacks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [page, setPage] = useState(0);
    const [hasNext, setHasNext] = useState(true);

    useEffect(() => {
        const fetchFeedbacks = async () => {
            setLoading(true);
            try {
                const res = await axios.get(`http://localhost:8081/api/feedback?page=${page}`, {
                    headers: { Authorization: `Bearer ${token}` },
                });

                if (res.data.length === 0) {
                    setHasNext(false);
                } else {
                    setFeedbacks(res.data);
                    setHasNext(true);
                }
            } catch (err) {
                console.error("Lỗi khi lấy feedback:", err);
                setError("Không thể tải dữ liệu phản hồi.");
            } finally {
                setLoading(false);
            }
        };

        fetchFeedbacks();
    }, [page, token]);

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
                        {feedbacks.map((fb) => (
                            <div className="col-md-6 mb-4" key={fb.id}>
                                <div className="card h-100 shadow-sm">
                                    <div className="card-body">
                                        <p><strong>Bệnh nhân:</strong> {fb.patientName || "Ẩn danh"}</p>
                                        <p><strong>Bác sĩ:</strong> {fb.doctorName || "Không rõ"}</p>
                                        <p><strong>Đánh giá:</strong> {"⭐".repeat(fb.score)}</p>
                                        <p><strong>Nhận xét:</strong> {fb.comment}</p>
                                        <p><strong>Ngày gửi:</strong> {new Date(fb.created).toLocaleString("vi-VN")}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="d-flex justify-content-between mt-4">
                        <button
                            className="btn btn-secondary"
                            disabled={page === 0}
                            onClick={prevPage}
                        >
                            Trang trước
                        </button>
                        <span>Trang {page + 1}</span>
                        <button
                            className="btn btn-primary"
                            disabled={!hasNext}
                            onClick={nextPage}
                        >
                            Trang sau
                        </button>
                    </div>
                </>
            )}
        </div>
    );
}

export default PatientFeedback;
