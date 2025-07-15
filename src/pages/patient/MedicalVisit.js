// ✅ Đã nâng cấp kích thước + giao diện thẻ khám bệnh
// 📁 File: MedicalVisit.js

import React, { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../../AuthContext";

function MedicalVisit() {
    const { user, token, load } = useAuth();
    const [visits, setVisits] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchVisits = async () => {
            if (!user?.id) {
                setError("Không tìm thấy thông tin người dùng.");
                setLoading(false);
                return;
            }

            try {
                const patientRes = await axios.get(`http://localhost:8081/api/patient/by-user/${user.id}`, {
                    headers: { Authorization: `Bearer ${token}` },
                });

                if (!patientRes.data?.id) {
                    setError("Không tìm thấy bệnh nhân tương ứng với tài khoản.");
                    setLoading(false);
                    return;
                }

                const patientId = patientRes.data.id;

                const visitsRes = await axios.get(`http://localhost:8081/api/visits/patient/${patientId}`, {
                    headers: { Authorization: `Bearer ${token}` },
                });

                setVisits(visitsRes.data);
                setError("");
            } catch (err) {
                console.error("❌ Lỗi khi gọi API:", err);
                setError("Không thể tải dữ liệu khám bệnh.");
            } finally {
                setLoading(false);
            }
        };

        if (!load) {
            fetchVisits();
        }
    }, [user, token, load]);

    return (
        <div className="container py-5">
            <h2 className="text-center mb-5 text-primary">
                <i className="bi bi-stethoscope me-2"></i>Lịch Sử Khám Bệnh
            </h2>

            {loading ? (
                <div className="text-center">Đang tải dữ liệu...</div>
            ) : visits.length > 0 ? (
                <div className="row justify-content-center g-4">
                    {visits.map((visit) => (
                        <div className="col-lg-6 col-xl-5" key={visit.id}>
                            <div className="shadow rounded-5 p-4 bg-white">
                                <h5 className="fw-bold text-primary mb-3">
                                    👨‍⚕️ Bác sĩ: {visit.doctorName || "Chưa có"}
                                </h5>
                                <ul className="list-unstyled fs-5">
                                    <li>📅 <strong>Ngày khám:</strong> {new Date(visit.createdAt).toLocaleDateString()}</li>
                                    <li>📝 <strong>Chẩn đoán:</strong> {visit.diagnosis}</li>
                                    <li>🗒️ <strong>Ghi chú:</strong> {visit.note}</li>
                                </ul>
                            </div>
                        </div>
                    ))}
                </div>
            ) : error ? (
                <div className="text-danger text-center">{error}</div>
            ) : (
                <div className="text-center">Không có dữ liệu khám bệnh nào.</div>
            )}
        </div>
    );
}

export default MedicalVisit;
