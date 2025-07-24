import React, { useEffect, useState } from "react";
import axios from "axios";

const DoctorList = () => {
  const [doctors, setDoctors] = useState([]);
  const [filteredDoctors, setFilteredDoctors] = useState([]);
  const [idFilter, setIdFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [departmentFilter, setDepartmentFilter] = useState("");
  const [specialtyFilter, setSpecialtyFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const doctorsPerPage = 5;

  useEffect(() => {
    const token = localStorage.getItem("token");
    axios
      .get("http://localhost:8081/api/doctors", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        setDoctors(res.data);
        setFilteredDoctors(res.data);
      })
      .catch((err) => console.error("Lỗi khi tải danh sách bác sĩ:", err));
  }, []);

  // Lọc dữ liệu khi filter thay đổi
  useEffect(() => {
    let filtered = doctors;

    if (idFilter.trim() !== "") {
      filtered = filtered.filter((doctor) =>
        doctor.id.toLowerCase().includes(idFilter.trim().toLowerCase())
      );
    }

    if (statusFilter !== "") {
      filtered = filtered.filter((doctor) => doctor.status === statusFilter);
    }

    if (departmentFilter !== "") {
      filtered = filtered.filter((doctor) => doctor.departmentName === departmentFilter);
    }

    if (specialtyFilter !== "") {
      filtered = filtered.filter((doctor) => doctor.specialty === specialtyFilter);
    }

    setFilteredDoctors(filtered);
    setCurrentPage(1);
  }, [idFilter, statusFilter, departmentFilter, specialtyFilter, doctors]);

  const handleReset = () => {
    setIdFilter("");
    setStatusFilter("");
    setDepartmentFilter("");
    setSpecialtyFilter("");
  };

  const indexOfLast = currentPage * doctorsPerPage;
  const indexOfFirst = indexOfLast - doctorsPerPage;
  const currentDoctors = filteredDoctors.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(filteredDoctors.length / doctorsPerPage);

  // Lấy danh sách Khoa và Chuyên môn duy nhất để làm tùy chọn lọc
  const departmentOptions = [...new Set(doctors.map((d) => d.departmentName))];
  const specialtyOptions = [...new Set(doctors.map((d) => d.specialty))];

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Danh sách Bác sĩ</h2>

      <div className="flex flex-wrap gap-2 mb-4 items-center">
        <input
          type="text"
          value={idFilter}
          onChange={(e) => setIdFilter(e.target.value)}
          placeholder="Nhập ID bác sĩ"
          className="border border-gray-300 p-2 rounded-l w-full max-w-md"
        />
        <button
          onClick={() => setIdFilter(idFilter.trim())}
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-r whitespace-nowrap"
        >
          Tìm kiếm
        </button>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="border border-gray-300 p-2 rounded w-full max-w-xs"
        >
          <option value="">-- Chọn trạng thái --</option>
          <option value="Hoạt động">Hoạt động</option>
          <option value="Đang khám">Đang khám</option>
          <option value="Tạm nghỉ">Tạm nghỉ</option>
        </select>

        <select
          value={departmentFilter}
          onChange={(e) => setDepartmentFilter(e.target.value)}
          className="border border-gray-300 p-2 rounded w-full max-w-xs"
        >
          <option value="">-- Chọn khoa --</option>
          {departmentOptions.map((dept, idx) => (
            <option key={idx} value={dept}>{dept}</option>
          ))}
        </select>

        <select
          value={specialtyFilter}
          onChange={(e) => setSpecialtyFilter(e.target.value)}
          className="border border-gray-300 p-2 rounded w-full max-w-xs"
        >
          <option value="">-- Chọn chuyên môn --</option>
          {specialtyOptions.map((spec, idx) => (
            <option key={idx} value={spec}>{spec}</option>
          ))}
        </select>

        <button
          onClick={handleReset}
          className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded"
        >
          Đặt lại
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full border border-gray-300">
          <thead className="bg-gray-200">
            <tr>
              <th className="border p-2">ID</th>
              <th className="border p-2">Họ tên</th>
              <th className="border p-2">Email</th>
              <th className="border p-2">Số điện thoại</th>
              <th className="border p-2">Chuyên môn</th>
              <th className="border p-2">Khoa</th>
              <th className="border p-2">Trạng thái</th>
            </tr>
          </thead>
          <tbody>
            {currentDoctors.map((doctor) => (
              <tr key={doctor.id}>
                <td className="border p-2">{doctor.id}</td>
                <td className="border p-2">{doctor.fullName}</td>
                <td className="border p-2">{doctor.email}</td>
                <td className="border p-2">{doctor.phone}</td>
                <td className="border p-2">{doctor.specialty}</td>
                <td className="border p-2">{doctor.departmentName}</td>
                <td className="border p-2">{doctor.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-4 flex justify-center gap-2">
        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
          <button
            key={page}
            onClick={() => setCurrentPage(page)}
            className={`px-3 py-1 rounded ${
              page === currentPage
                ? "bg-blue-600 text-white"
                : "bg-gray-200 hover:bg-gray-300"
            }`}
          >
            {page}
          </button>
        ))}
      </div>
    </div>
  );
};

export default DoctorList;
