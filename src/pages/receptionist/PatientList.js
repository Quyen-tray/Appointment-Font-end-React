import React, { useEffect, useState } from "react";
import axios from "axios";

function PatientList() {
  const [patients, setPatients] = useState([]);
  const [searchId, setSearchId] = useState("");
  const [error, setError] = useState("");
  const [page, setPage] = useState(0);
  const [size] = useState(3);
  const [totalPages, setTotalPages] = useState(0);

  const [selectedPatientHistory, setSelectedPatientHistory] = useState([]);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    if (!searchId.trim()) {
      fetchPatientsByPage(page);
    }
  }, [page]);

  const fetchPatientsByPage = (pageNumber) => {
    axios
      .get(`http://localhost:8081/api/patients/paged?page=${pageNumber}&size=${size}`)
      .then((response) => {
        setPatients(response.data.content);
        setTotalPages(response.data.totalPages);
        setError("");
      })
      .catch((error) => {
        console.error("Lỗi khi tải danh sách phân trang:", error);
        setError("Không thể tải danh sách bệnh nhân.");
      });
  };

  const handleSearch = () => {
    if (!searchId.trim()) {
      setPage(0);
      fetchPatientsByPage(0);
      return;
    }

    axios
      .get(`http://localhost:8081/api/patients/${searchId}`)
      .then((response) => {
        setPatients([response.data]);
        setTotalPages(1);
        setPage(0);
        setError("");
      })
      .catch((error) => {
        console.error("Lỗi khi tìm kiếm bệnh nhân:", error);
        setPatients([]);
        setTotalPages(0);
        setError("Không tìm thấy bệnh nhân với ID đã nhập.");
      });
  };

  const handleViewHistory = (patientId) => {
    axios
      .get(`http://localhost:8081/api/patients/${patientId}/history`)
      .then((res) => {
        setSelectedPatientHistory(res.data.history);
        setShowModal(true);
      })
      .catch((err) => {
        console.error("Lỗi khi lấy lịch sử khám:", err);
        alert("Không thể tải lịch sử khám.");
      });
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Danh sách bệnh nhân</h2>

      {/* Thanh tìm kiếm */}
      <div className="flex items-center gap-2 mb-4">
        <input
          type="text"
          placeholder="Nhập ID bệnh nhân"
          value={searchId}
          onChange={(e) => setSearchId(e.target.value)}
          className="border border-gray-300 p-2 rounded w-full max-w-md"
        />
        <button
          onClick={handleSearch}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
        >
          Tìm kiếm
        </button>
      </div>

      {/* Hiển thị lỗi nếu có */}
      {error && <p className="text-red-500 mb-4">{error}</p>}

      {/* Bảng danh sách bệnh nhân */}
      <table className="table-auto w-full border border-gray-300">
        <thead className="bg-gray-100">
          <tr>
            <th className="px-4 py-2 border">ID</th>
            <th className="px-4 py-2 border">Tên</th>
            <th className="px-4 py-2 border">Email</th>
            <th className="px-4 py-2 border">SĐT</th>
            <th className="px-4 py-2 border">Ngày sinh</th>
            <th className="px-4 py-2 border">Giới tính</th>
            <th className="px-4 py-2 border">Địa chỉ</th>
            <th className="px-4 py-2 border">Lịch sử khám</th>
          </tr>
        </thead>
        <tbody>
          {patients.map((patient) => (
            <tr key={patient.id} className="hover:bg-gray-50 align-top">
              <td className="px-4 py-2 border text-center">{patient.id}</td>
              <td className="px-4 py-2 border">{patient.fullName}</td>
              <td className="px-4 py-2 border">{patient.email}</td>
              <td className="px-4 py-2 border">{patient.phone}</td>
              <td className="px-4 py-2 border">{patient.dob}</td>
              <td className="px-4 py-2 border">{patient.gender}</td>
              <td className="px-4 py-2 border">{patient.address}</td>
              <td className="px-4 py-2 border text-center">
                <button
                  onClick={() => handleViewHistory(patient.id)}
                  className="text-blue-600 underline"
                >
                  Xem lịch sử
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Pagination */}
      {!searchId && totalPages > 1 && (
        <div className="flex justify-center mt-4 gap-2">
          <button
            onClick={() => setPage((prev) => Math.max(prev - 1, 0))}
            disabled={page === 0}
            className="px-3 py-1 bg-gray-300 rounded disabled:opacity-50"
          >
            Trước
          </button>

          {[...Array(totalPages)].map((_, index) => (
            <button
              key={index}
              onClick={() => setPage(index)}
              className={`px-3 py-1 rounded ${
                index === page ? "bg-blue-600 text-white" : "bg-gray-200"
              }`}
            >
              {index + 1}
            </button>
          ))}

          <button
            onClick={() => setPage((prev) => Math.min(prev + 1, totalPages - 1))}
            disabled={page === totalPages - 1}
            className="px-3 py-1 bg-gray-300 rounded disabled:opacity-50"
          >
            Sau
          </button>
        </div>
      )}

      {/* Modal hiển thị lịch sử khám */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-4xl max-h-[80vh] overflow-y-auto">
            <h3 className="text-xl font-semibold mb-4">Lịch sử khám</h3>
            {selectedPatientHistory.length > 0 ? (
              <table className="table-auto w-full border border-gray-300 text-sm">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="px-2 py-1 border">Ngày hẹn</th>
                    <th className="px-2 py-1 border">Lý do</th>
                    <th className="px-2 py-1 border">Trạng thái</th>
                    <th className="px-2 py-1 border">Chẩn đoán</th>
                    <th className="px-2 py-1 border">Ghi chú</th>
                    <th className="px-2 py-1 border">Ngày tạo</th>
                  </tr>
                </thead>
                <tbody>
                  {selectedPatientHistory.map((h, index) => (
                    <tr key={index}>
                      <td className="px-2 py-1 border">{h.appointmentDate || "—"}</td>
                      <td className="px-2 py-1 border">{h.reason || "—"}</td>
                      <td className="px-2 py-1 border">{h.status || "—"}</td>
                      <td className="px-2 py-1 border">{h.diagnosis || "—"}</td>
                      <td className="px-2 py-1 border">{h.note || "—"}</td>
                      <td className="px-2 py-1 border">{h.createdAt || "—"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p>Không có lịch sử khám.</p>
            )}

            <div className="mt-4 text-right">
              <button
                onClick={() => setShowModal(false)}
                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default PatientList;
