import React, { useEffect, useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import axios from "axios";

function PatientHistory() {
  const location = useLocation();
  const { id } = useParams();
  const [patientDetail, setPatientDetail] = useState(location.state?.patientDetail || null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!patientDetail) {
      setLoading(true);
      axios
        .get(`http://localhost:8081/api/patients/${id}/history`)
        .then((res) => setPatientDetail(res.data))
        .catch(() => setError("Không thể tải dữ liệu lịch sử khám bệnh"))
        .finally(() => setLoading(false));
    }
  }, [id, patientDetail]);

  if (loading) {
    return <div className="text-center">Đang tải dữ liệu...</div>;
  }

  if (error) {
    return <div className="text-center text-red-500">{error}</div>;
  }

  if (!patientDetail) {
    return <div className="text-center text-red-500">Không có dữ liệu bệnh nhân.</div>;
  }

  return (
    <div className="container mx-auto p-6">
      <h2 className="text-2xl font-bold mb-4">Lịch sử khám bệnh của: {patientDetail.fullName}</h2>

      <div className="mb-4">
        <p><strong>Email:</strong> {patientDetail.email}</p>
        <p><strong>SĐT:</strong> {patientDetail.phone}</p>
        <p><strong>Ngày sinh:</strong> {patientDetail.dob}</p>
        <p><strong>Giới tính:</strong> {patientDetail.gender}</p>
        <p><strong>Địa chỉ:</strong> {patientDetail.address}</p>
      </div>

      <h3 className="text-xl font-semibold mt-6 mb-2">Lịch sử khám:</h3>
      {patientDetail.history && patientDetail.history.length > 0 ? (
        <table className="min-w-full border">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-2 border">Ngày khám</th>
              <th className="px-4 py-2 border">Lý do</th>
              <th className="px-4 py-2 border">Chẩn đoán</th>
              <th className="px-4 py-2 border">Trạng thái</th>
              <th className="px-4 py-2 border">Ghi chú</th>
            </tr>
          </thead>
          <tbody>
            {patientDetail.history.map((entry, index) => (
              <tr key={index} className="hover:bg-gray-50">
                <td className="px-4 py-2 border">{entry.appointmentDate}</td>
                <td className="px-4 py-2 border">{entry.reason}</td>
                <td className="px-4 py-2 border">{entry.diagnosis}</td>
                <td className="px-4 py-2 border">{entry.status}</td>
                <td className="px-4 py-2 border">{entry.notes}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p className="text-gray-600">Chưa có lịch sử khám bệnh.</p>
      )}
    </div>
  );
}

export default PatientHistory;
