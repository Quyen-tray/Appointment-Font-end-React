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

  const fetchPatients = () => {
    const token = localStorage.getItem("token");
    axios
      .get(`http://localhost:8081/api/patients/paged?page=${page}&size=3`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        setPatients(response.data.content);
        setTotalPages(response.data.totalPages);
        setError("");
      })
      .catch(() => {
        setError("Không thể tải danh sách bệnh nhân.");
        setPatients([]);
      });
  };

  const fetchPatientById = () => {
    if (!searchId.trim()) {
      fetchPatients();
      return;
    }

    const token = localStorage.getItem("token");

    axios
      .get(`http://localhost:8081/api/patients/${searchId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        setPatients([response.data]);
        setTotalPages(1);
        setPage(0);
        setError("");
      })
      .catch(() => {
        setPatients([]);
        setTotalPages(0);
        setError("Không tìm thấy bệnh nhân.");
      });
  };

  const fetchPatientsByGender = (gender) => {
    if (!gender) {
      fetchPatients();
      return;
    }

    const token = localStorage.getItem("token");

    axios
      .get(`http://localhost:8081/api/patients/filter?gender=${gender}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        setPatients(response.data);
        setTotalPages(1);
        setPage(0);
        setError("");
      })
      .catch(() => {
        setPatients([]);
        setTotalPages(0);
        setError("Không tìm thấy bệnh nhân theo giới tính.");
      });
  };

  const fetchPatientsByStatus = (status) => {
    if (!status) {
      fetchPatients();
      return;
    }

    const token = localStorage.getItem("token");

    axios
      .get(`http://localhost:8081/api/patients/status?status=${status}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        setPatients(response.data);
        setTotalPages(1);
        setPage(0);
        setError("");
      })
      .catch(() => {
        setPatients([]);
        setTotalPages(0);
        setError("Không tìm thấy bệnh nhân theo trạng thái khám.");
      });
  };

  useEffect(() => {
    fetchPatients();
  }, [page]);

  const handleSearch = () => {
    fetchPatientById();
  };

  const handleGenderChange = (event) => {
    const gender = event.target.value;
    setGenderFilter(gender);
    fetchPatientsByGender(gender);
  };

  const handleStatusChange = (event) => {
    const status = event.target.value;
    setStatusFilter(status);
    fetchPatientsByStatus(status);
  };

  const handleReset = () => {
    setSearchId("");
    setGenderFilter("");
    setStatusFilter("");
    setPage(0);
    fetchPatients();
  };

  const handleViewHistory = (id) => {
    window.location.href = `/receptionist/patient-history/${id}`;
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

  return (
    <div className="container mx-auto p-6">
      <h2 className="text-2xl font-bold mb-4">Danh sách bệnh nhân</h2>
      <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
        <div className="flex gap-2">
          <input
            type="text"
            value={searchId}
            onChange={(e) => setSearchId(e.target.value)}
            placeholder="Nhập ID bệnh nhân"
            className="border rounded px-4 py-2 w-64"
          />
          <button
            onClick={handleSearch}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Tìm kiếm
          </button>
          <button
            onClick={handleReset}
            className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500"
          >
            Đặt lại
          </button>
        </div>
        <div className="flex gap-4">
          <select
            value={genderFilter}
            onChange={handleGenderChange}
            className="border rounded px-4 py-2"
          >
            <option value="">Lọc theo giới tính</option>
            <option value="Nam">Nam</option>
            <option value="Nữ">Nữ</option>
          </select>
          <select
            value={statusFilter}
            onChange={handleStatusChange}
            className="border rounded px-4 py-2"
          >
            <option value="">Lọc theo trạng thái khám</option>
            <option value="Scheduled">Chờ khám</option>
            <option value="Under examination">Đang khám</option>
            <option value="Completed">Đã khám</option>
            <option value="Cancelled">Đã hủy</option>
          </select>
        </div>
      </div>

      {error && <div className="text-red-500 text-center mb-4">{error}</div>}

      <div className="overflow-x-auto">
        <table className="min-w-full border">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-2 border">ID</th>
              <th className="px-4 py-2 border">Tên</th>
              <th className="px-4 py-2 border">Email</th>
              <th className="px-4 py-2 border">SĐT</th>
              <th className="px-4 py-2 border">Ngày sinh</th>
              <th className="px-4 py-2 border">Giới tính</th>
              <th className="px-4 py-2 border">Địa chỉ</th>
              <th className="px-4 py-2 border">Trạng thái gần nhất</th>
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
                  {translateStatus(patient.latestStatus)}
                </td>
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
      </div>

      {totalPages > 1 && (
        <div className="flex justify-center mt-6 space-x-2">
          {[...Array(totalPages).keys()].map((i) => (
            <button
              key={i}
              onClick={() => setPage(i)}
              className={`px-4 py-2 border rounded ${
                i === page ? "bg-blue-500 text-white" : "bg-white"
              }`}
            >
              {i + 1}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default PatientList;
