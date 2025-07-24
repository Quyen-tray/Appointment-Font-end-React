import React, { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../../AuthContext";

function MedicalVisit() {
    const { user, token, load } = useAuth();
    const [visits, setVisits] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [fromDate, setFromDate] = useState("");
    const [toDate, setToDate] = useState("");
    const [page, setPage] = useState(0);
    const size = 5;

    const fetchVisits = async () => {
        if (!user?.id || !token) return;

        setLoading(true);
        try {
            // Lấy patientId từ userId
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

    // Gọi API mỗi khi thay đổi page, từ ngày, đến ngày, load xong, user/token có
    useEffect(() => {
        if (!load && user && token) {
            fetchVisits();
        }
    }, [user, token, load, page, fromDate, toDate]);

    // Chỉ reset về trang đầu
    const handleFilter = () => {
        setPage(0);
    };

    return (
        <div className="container py-5">
            <h2 className="text-center mb-4 text-primary">
                <i className="bi bi-stethoscope me-2"></i>Lịch Sử Khám Bệnh
            </h2>

            {/* Bộ lọc ngày */}
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
            </div>

            {/* Loading */}
            {loading ? (
                <div className="text-center">Đang tải dữ liệu...</div>
            ) : visits.length > 0 ? (
                <>
                    {/* Danh sách visit */}
                    <div className="row justify-content-center g-4">
                        {visits.map((visit) => (
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
    );
}

export default MedicalVisit;
