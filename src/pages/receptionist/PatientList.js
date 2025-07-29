import React, { useEffect, useState } from "react";
import axios from "axios";

function PatientList() {
  const [patients, setPatients] = useState([]);
  const [searchId, setSearchId] = useState("");
  const [genderFilter, setGenderFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [error, setError] = useState("");
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const token = localStorage.getItem("token");

  const fetchPatients = () => {
    axios
        .get(`http://localhost:8081/api/patients/paged?page=${page}&size=8`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((res) => {
          setPatients(res.data.content);
          setTotalPages(res.data.totalPages);
          setError("");
        })
        .catch(() => {
          setPatients([]);
          setError("Không thể tải danh sách bệnh nhân.");
        });
  };

  const fetchPatientById = () => {
    if (!searchId.trim()) return fetchPatients();
    axios
        .get(`http://localhost:8081/api/patients/${searchId}`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((res) => {
          setPatients([res.data]);
          setPage(0);
          setTotalPages(1);
          setError("");
        })
        .catch(() => {
          setPatients([]);
          setError("Không tìm thấy bệnh nhân.");
          setTotalPages(0);
        });
  };

  const fetchPatientsByGender = (gender) => {
    if (!gender) return fetchPatients();
    axios
        .get(`http://localhost:8081/api/patients/filter?gender=${gender}`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((res) => {
          setPatients(res.data);
          setTotalPages(1);
          setPage(0);
          setError("");
        })
        .catch(() => {
          setPatients([]);
          setError("Không tìm thấy bệnh nhân theo giới tính.");
          setTotalPages(0);
        });
  };

  const fetchPatientsByStatus = (status) => {
    if (!status) return fetchPatients();
    axios
        .get(`http://localhost:8081/api/patients/status?status=${status}`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((res) => {
          setPatients(res.data);
          setTotalPages(1);
          setPage(0);
          setError("");
        })
        .catch(() => {
          setPatients([]);
          setError("Không tìm thấy bệnh nhân theo trạng thái.");
          setTotalPages(0);
        });
  };

  useEffect(() => {
    fetchPatients();
  }, [page]);

  const handleReset = () => {
    setSearchId("");
    setGenderFilter("");
    setStatusFilter("");
    setPage(0);
    fetchPatients();
  };

  const translateStatus = (status) => {
    switch (status) {
      case "Scheduled":
        return "Chờ khám";
      case "Under examination":
        return "Đang khám";
      case "Completed":
        return "Đã khám";
      case "Cancelled":
        return "Đã hủy";
      default:
        return status || "—";
    }
  };

  const handleViewHistory = (id) => {
    window.location.href = `/receptionist/patient-history/${id}`;
  };

  return (
      <div className="max-w-screen-xl mx-auto p-6">
        <h2 style={{ color: '#2563eb' }} className="mb-6 font-bold text-center text-2xl">
          🧑‍⚕️ Danh sách bệnh nhân
        </h2>
        <p className="text-center text-gray-600 mb-4">
          Tìm thấy <strong>{patients.length}</strong> Bệnh nhân
        </p>

        {/* Tìm kiếm và lọc */}
        <div className="bg-white p-4 rounded-lg shadow-md mb-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex gap-2 flex-wrap">
              <input
                  type="text"
                  value={searchId}
                  onChange={(e) => setSearchId(e.target.value)}
                  placeholder="🔍 Nhập ID bệnh nhân"
                  className="border border-gray-300 rounded px-4 py-2 w-64 shadow-sm focus:ring-2 focus:ring-blue-300"
              />
              <button
                  onClick={fetchPatientById}
                  className="bg-blue-600 text-white px-4 py-2 rounded shadow hover:bg-blue-700 transition"
              >
                Tìm kiếm
              </button>
              <button
                  onClick={handleReset}
                  className="bg-gray-400 text-white px-4 py-2 rounded shadow hover:bg-gray-500 transition"
              >
                Đặt lại
              </button>
            </div>

            <div className="flex gap-4 flex-wrap">
              <select
                  value={genderFilter}
                  onChange={(e) => {
                    setGenderFilter(e.target.value);
                    fetchPatientsByGender(e.target.value);
                  }}
                  className="border rounded px-4 py-2 shadow-sm focus:ring-2 focus:ring-blue-300"
              >
                <option value="">🚻 Giới tính</option>
                <option value="Nam">Nam</option>
                <option value="Nữ">Nữ</option>
              </select>

              <select
                  value={statusFilter}
                  onChange={(e) => {
                    setStatusFilter(e.target.value);
                    fetchPatientsByStatus(e.target.value);
                  }}
                  className="border rounded px-4 py-2 shadow-sm focus:ring-2 focus:ring-blue-300"
              >
                <option value="">📌 Trạng thái</option>
                <option value="Scheduled">Chờ khám</option>
                <option value="Under examination">Đang khám</option>
                <option value="Completed">Đã khám</option>
                <option value="Cancelled">Đã hủy</option>
              </select>
            </div>
          </div>
        </div>

        {/* Lỗi */}
        {error && (
            <div className="text-red-500 text-center mb-4 font-semibold">
              {error}
            </div>
        )}

        {/* Bảng */}
        <div className="overflow-x-auto shadow-md rounded-lg">
          <table className="min-w-full bg-white text-sm text-center">
            <thead className="bg-blue-100 text-gray-700 font-semibold">
            <tr>
              <th className="px-4 py-3">ID</th>
              <th className="px-4 py-3">Tên</th>
              <th className="px-4 py-3">Email</th>
              <th className="px-4 py-3">SĐT</th>
              <th className="px-4 py-3">Ngày sinh</th>
              <th className="px-4 py-3">Giới tính</th>
              <th className="px-4 py-3">Địa chỉ</th>
              <th className="px-4 py-3">Trạng thái</th>
              <th className="px-4 py-3">Lịch sử</th>
            </tr>
            </thead>
            <tbody>
            {patients.map((p) => (
                <tr key={p.id} className="hover:bg-gray-50 transition">
                  <td className="px-4 py-2">{p.id}</td>
                  <td className="px-4 py-2">{p.fullName}</td>
                  <td className="px-4 py-2">{p.email}</td>
                  <td className="px-4 py-2">{p.phone}</td>
                  <td className="px-4 py-2">{p.dob}</td>
                  <td className="px-4 py-2">{p.gender}</td>
                  <td className="px-4 py-2">{p.address}</td>
                  <td className="px-4 py-2">{translateStatus(p.latestStatus)}</td>
                  <td className="px-4 py-2">
                    <button
                        onClick={() => handleViewHistory(p.id)}
                        className="text-blue-600 underline hover:text-blue-800 transition"
                    >
                      Xem
                    </button>
                  </td>
                </tr>
            ))}
            </tbody>
          </table>
        </div>

        {/* Phân trang */}
        {totalPages > 1 && (
            <div className="flex justify-center mt-6">
              <nav className="flex flex-wrap gap-2">
                {Array.from({ length: totalPages }, (_, i) => (
                    <button
                        key={i}
                        onClick={() => setPage(i)}
                        className={`min-w-[36px] px-4 py-2 rounded-full border border-blue-500 text-sm font-medium
                ${
                            i === page
                                ? "bg-blue-600 text-white"
                                : "bg-white text-blue-600 hover:bg-blue-100"
                        } transition duration-200`}
                    >
                      {i + 1}
                    </button>
                ))}
              </nav>
            </div>
        )}
      </div>
  );
}

export default PatientList;
