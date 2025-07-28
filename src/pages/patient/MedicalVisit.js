import React, { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../../AuthContext";
import bgImage from "../../assets/img/istockphoto-1150170445-612x612.jpg";

function MedicalVisit() {
    const { user, token, load } = useAuth();
    const [visits, setVisits] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [fromDate, setFromDate] = useState("");
    const [toDate, setToDate] = useState("");
    const [page, setPage] = useState(0);
    const [sortNewestFirst, setSortNewestFirst] = useState(true);
    const size = 5;

    const fetchVisits = async () => {
        if (!user?.id || !token) return;

        setLoading(true);
        try {
            const patientRes = await axios.get(
                `http://localhost:8081/api/patient/by-user/${user.id}`,
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            );

            const patientId = patientRes?.data?.id;
            if (!patientId) {
                setError("Không tìm thấy bệnh nhân tương ứng với tài khoản.");
                setVisits([]);
                return;
            }

            const response = await axios.get(
                `http://localhost:8081/api/visits/patient/${patientId}`,
                {
                    headers: { Authorization: `Bearer ${token}` },
                    params: {
                        fromDate: fromDate || undefined,
                        toDate: toDate || undefined,
                        page,
                        size,
                    },
                }
            );

            setVisits(response.data || []);
            setError("");
        } catch (err) {
            console.error("❌ Lỗi khi gọi API:", err);
            setError("Không thể tải dữ liệu khám bệnh.");
            setVisits([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (!load && user && token) {
            fetchVisits();
        }
    }, [user, token, load, page, fromDate, toDate]);

    const handleFilter = () => {
        setPage(0);
    };

    const handleMonthFilter = (e) => {
        const value = e.target.value;
        if (!value) {
            setFromDate("");
            setToDate("");
            return;
        }

        const [year, month] = value.split("-");
        const firstDay = new Date(year, month - 1, 1);
        const lastDay = new Date(year, month, 0);
        setFromDate(firstDay.toISOString().slice(0, 10));
        setToDate(lastDay.toISOString().slice(0, 10));
        setPage(0);
    };

    return (
        <div
            style={{
                backgroundImage: `url(${bgImage})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                backgroundAttachment: "fixed",
                minHeight: "100vh",
                paddingTop: "50px",
                paddingBottom: "50px",
            }}
        >
            <div
                className="container py-5"
                style={{
                    backgroundColor: "rgba(255, 255, 255, 0.95)",
                    borderRadius: "1rem",
                    boxShadow: "0 0 10px rgba(0,0,0,0.2)",
                }}
            >
                <h2 className="text-center mb-3 text-primary">
                    <i className="bi bi-stethoscope me-2"></i>Lịch Sử Khám Bệnh
                </h2>

            {/* Tổng số lần khám */}
            {!loading && visits.length > 0 && (
                <p className="text-center mb-4">
                    🩺 <strong>Tổng số lần khám trong trang này:</strong> {visits.length}
                </p>
            )}

            {/* Bộ lọc nâng cao */}
            <div className="d-flex flex-wrap justify-content-center align-items-center gap-3 mb-4">
                <div>
                    <label className="form-label mb-0 me-2">Từ ngày:</label>
                    <input
                        type="date"
                        value={fromDate}
                        onChange={(e) => setFromDate(e.target.value)}
                    />
                </div>
                <div>
                    <label className="form-label mb-0 me-2">Đến ngày:</label>
                    <input
                        type="date"
                        value={toDate}
                        onChange={(e) => setToDate(e.target.value)}
                    />
                </div>
                <button className="btn btn-primary" onClick={handleFilter}>
                    Lọc
                </button>
                {/* Nút sắp xếp */}
                <button
                    className="btn btn-outline-secondary"
                    onClick={() => setSortNewestFirst((prev) => !prev)}
                >
                    {sortNewestFirst ? "Mới → Cũ" : "Cũ → Mới"}
                </button>
            </div>

            {/* Loading */}
            {loading ? (
                <div className="text-center">Đang tải dữ liệu...</div>
            ) : visits.length > 0 ? (
                <>
                    <div className="row justify-content-center g-4">
                        {[...visits]
                            .sort((a, b) => {
                                const dateA = new Date(a.createdAt);
                                const dateB = new Date(b.createdAt);
                                return sortNewestFirst ? dateB - dateA : dateA - dateB;
                            })
                            .map((visit) => (
                                <div className="col-lg-6 col-xl-5" key={visit.id}>
                                    <div className="shadow rounded-5 p-4 bg-white">
                                        <h5 className="fw-bold text-primary mb-3">
                                            👨‍⚕️ Bác sĩ: {visit.doctorName || "Chưa có"}
                                        </h5>
                                        <ul className="list-unstyled fs-5">
                                            <li>
                                                📅 <strong>Ngày khám:</strong>{" "}
                                                {new Date(visit.createdAt).toLocaleDateString()}
                                            </li>
                                            <li>
                                                📝 <strong>Chẩn đoán:</strong> {visit.diagnosis}
                                            </li>
                                            <li>
                                                🗒️ <strong>Ghi chú:</strong> {visit.note}
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                            ))}
                    </div>

                    {/* Phân trang */}
                    <div className="text-center mt-4">
                        <button
                            className="btn btn-outline-primary me-2"
                            disabled={page === 0}
                            onClick={() => setPage((p) => p - 1)}
                        >
                            ← Trang trước
                        </button>
                        <span>Trang {page + 1}</span>
                        <button
                            className="btn btn-outline-primary ms-2"
                            disabled={visits.length < size}
                            onClick={() => setPage((p) => p + 1)}
                        >
                            Trang sau →
                        </button>
                    </div>
                </>
            ) : error ? (
                <div className="text-danger text-center">{error}</div>
            ) : (
                <div className="text-center">Không có dữ liệu khám bệnh nào.</div>
            )}
            </div>
        </div>
    );
}

export default MedicalVisit;
