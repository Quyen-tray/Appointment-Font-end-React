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
                console.log("❌ Không có user hoặc user.id.");
                setError("Không tìm thấy thông tin người dùng.");
                setLoading(false);
                return;
            }

            try {
                // 👣 Bỏ hardcode patientId, lấy lại từ API
                const patientRes = await axios.get(`http://localhost:8081/api/patient/by-user/${user.id}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                console.log("Patient API response:", patientRes.data);
                if (!patientRes.data || !patientRes.data.id) {
                    console.error("❌ Không tìm thấy patient tương ứng userId:", user.id);
                    setError("Không tìm thấy bệnh nhân tương ứng với tài khoản.");
                    setLoading(false);
                    return;
                }

                const patientId = patientRes.data.id;
                console.log("Patient ID:", patientId);

                // 👣 Bước 2: Lấy danh sách visit theo patientId
                const visitsRes = await axios.get(`http://localhost:8081/api/visits/patient/${patientId}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                console.log("Visits:", visitsRes.data);

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
            <h2 className="text-center mb-4">Lịch Sử Khám Bệnh</h2>

            {loading ? (
                <div className="text-center">Đang tải dữ liệu...</div>
            ) : visits.length > 0 ? (
                <div className="row">
                    {visits.map((visit) => (
                        <div className="col-md-6 mb-4" key={visit.id}>
                            <div className="card h-100 shadow-sm">
                                <div className="card-body">
                                    <h5 className="card-title">Bác sĩ: {visit.doctorName || "Chưa có"}</h5>
                                    <p><strong>Ngày khám:</strong> {new Date(visit.createdAt).toLocaleDateString()}</p>
                                    <p><strong>Chẩn đoán:</strong> {visit.diagnosis}</p>
                                    <p><strong>Ghi chú:</strong> {visit.note}</p>
                                </div>
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
