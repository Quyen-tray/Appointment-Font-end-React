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
    const [editingId, setEditingId] = useState(null);
    const [editComment, setEditComment] = useState("");
    const [editScore, setEditScore] = useState(0);
    const pageSize = 20;

    useEffect(() => {
        fetchFeedbacks();
    }, [page, token]);

    const fetchFeedbacks = async () => {
        setLoading(true);
        try {
            const res = await axios.get(
                `http://localhost:8081/api/feedback?page=${page}&size=${pageSize}`,
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setFeedbacks(res.data);
            setHasNext(res.data.length === pageSize);
            setError("");
        } catch (err) {
            console.error("Lỗi khi lấy feedback:", err);
            setError("Không thể tải dữ liệu phản hồi.");
            setFeedbacks([]);
            setHasNext(false);
        } finally {
            setLoading(false);
        }
    };

    const startEdit = (fb) => {
        setEditingId(fb.id);
        setEditComment(fb.comment || "");
        setEditScore(fb.score || 0);
    };

    const cancelEdit = () => {
        setEditingId(null);
        setEditComment("");
        setEditScore(0);
    };

    const saveEdit = async (id) => {
        try {
            await axios.put(
                `http://localhost:8081/api/feedback/${id}`,
                { comment: editComment, score: editScore },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            cancelEdit();
            fetchFeedbacks();
        } catch (err) {
            if (err.response?.status === 403) {
                alert("Bạn chỉ có thể sửa phản hồi trong ngày đã tạo.");
            } else {
                alert("Cập nhật phản hồi thất bại!");
            }
            console.error("Lỗi khi cập nhật feedback:", err);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Bạn có chắc muốn xóa phản hồi này?")) return;
        try {
            await axios.delete(`http://localhost:8081/api/feedback/${id}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            fetchFeedbacks();
        } catch (err) {
            if (err.response?.status === 403) {
                alert("Bạn chỉ có thể xóa phản hồi trong ngày đã tạo.");
            } else {
                alert("Xóa phản hồi thất bại!");
            }
            console.error("Lỗi khi xóa feedback:", err);
        }
    };

    // Hiển thị sao
    const renderStars = (score, onClick) => {
        return (
            <span style={{ color: "#f5c518", cursor: onClick ? 'pointer' : 'default', fontSize: '1.2rem' }}>
        {Array.from({ length: 5 }, (_, i) => (
            <span
                key={i}
                onClick={onClick ? () => onClick(i + 1) : undefined}
            >
            {i < score ? '★' : '☆'}
          </span>
        ))}
      </span>
        );
    };

    const nextPage = () => setPage((prev) => prev + 1);
    const prevPage = () => setPage((prev) => Math.max(prev - 1, 0));

    // kiểm tra cùng ngày
    const isSameDay = (dateStr) => {
        const c = new Date(dateStr);
        const t = new Date();
        return (
            c.getDate() === t.getDate() &&
            c.getMonth() === t.getMonth() &&
            c.getFullYear() === t.getFullYear()
        );
    };

    return (
        <div className="container py-5">
            <h2 className="text-center mb-4">Phản Hồi Của Bệnh Nhân</h2>

            {loading ? (
                <div className="text-center">Đang tải...</div>
            ) : error ? (
                <div className="text-danger text-center">{error}</div>
            ) : (
                <>
                    {feedbacks.length === 0 ? (
                        <div className="text-center mb-4">
                            {page === 0
                                ? "Không có phản hồi nào."
                                : "Không còn phản hồi để hiển thị."}
                        </div>
                    ) : (
                        <div className="row">
                            {feedbacks.map((fb) => {
                                const editable = isSameDay(fb.created);
                                return (
                                    <div className="col-md-6 mb-4" key={fb.id}>
                                        <div className="card shadow-sm rounded-4 border-0 h-100 position-relative">
                                            <div className="card-body">
                                                <div className="d-flex justify-content-between mb-2">
                                                    <div>
                                                        <h6 className="mb-0">{fb.patientName || "Ẩn danh"}</h6>
                                                        <small className="text-muted">
                                                            Gửi ngày: {new Date(fb.created).toLocaleString("vi-VN")}
                                                        </small>
                                                    </div>
                                                    {editable && editingId !== fb.id && (
                                                        <div>
                                                            <button
                                                                className="btn btn-sm btn-outline-warning me-1"
                                                                onClick={() => startEdit(fb)}
                                                            >
                                                                Sửa
                                                            </button>
                                                            <button
                                                                className="btn btn-sm btn-outline-danger"
                                                                onClick={() => handleDelete(fb.id)}
                                                            >
                                                                Xóa
                                                            </button>
                                                        </div>
                                                    )}
                                                </div>

                                                {editingId === fb.id ? (
                                                    <div>
                                                        {renderStars(editScore, setEditScore)}
                                                        <textarea
                                                            className="form-control mt-2"
                                                            rows={3}
                                                            value={editComment}
                                                            onChange={(e) => setEditComment(e.target.value)}
                                                        />
                                                        <div className="mt-2">
                                                            <button
                                                                className="btn btn-sm btn-primary me-2"
                                                                onClick={() => saveEdit(fb.id)}
                                                            >
                                                                Lưu
                                                            </button>
                                                            <button
                                                                className="btn btn-sm btn-secondary"
                                                                onClick={cancelEdit}
                                                            >
                                                                Hủy
                                                            </button>
                                                        </div>
                                                    </div>
                                                ) : (
                                                    <>
                                                        <p className="mb-1">
                                                            <strong>Bác sĩ:</strong> {fb.doctorName || "Không rõ"}
                                                        </p>
                                                        <p className="mb-1">{renderStars(fb.score)}</p>
                                                        <p className="text-muted fst-italic">"{fb.comment}"</p>
                                                    </>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}

                    <div className="d-flex justify-content-between mt-4">
                        <button
                            className="btn btn-outline-secondary"
                            disabled={page === 0}
                            onClick={prevPage}
                        >
                            ← Trang trước
                        </button>
                        <span>Trang {page + 1}</span>
                        <button
                            className="btn btn-outline-primary"
                            disabled={!hasNext}
                            onClick={nextPage}
                        >
                            Trang sau →
                        </button>
                    </div>
                </>
            )}
        </div>
    );
}

export default PatientFeedback;