import React, { useEffect, useState } from "react";
import axios from "axios";

function DoctorList() {
  const [doctors, setDoctors] = useState([]);
  const [filteredDoctors, setFilteredDoctors] = useState([]);
  const [searchId, setSearchId] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState("");
  const [error, setError] = useState("");

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const doctorsPerPage = 5;

  const departmentOptions = [
    "Khoa nội",
    "Khoa nhi",
    "Khoa tim mạch",
    "Khoa mắt",
    "Khoa tai mũi họng"
  ];

  useEffect(() => {
    axios.get("http://localhost:8081/api/doctor")
      .then(response => {
        setDoctors(response.data);
        setFilteredDoctors(response.data);
      })
      .catch(error => {
        console.error("Lỗi khi lấy danh sách bác sĩ:", error);
        setError("Không thể tải danh sách bác sĩ");
      });
  }, []);

  // Tìm kiếm theo ID
  const handleSearch = () => {
    const result = doctors.filter(doctor =>
      doctor.id.toLowerCase().includes(searchId.toLowerCase())
    );
    setFilteredDoctors(result);
    setCurrentPage(1);
  };

  // Lọc theo Khoa
  const handleFilterDepartment = (department) => {
    setSelectedDepartment(department);
    const result = doctors.filter(doctor =>
  department === "" || doctor.departmentName.toLowerCase() === department.toLowerCase()
);

    setFilteredDoctors(result);
    setCurrentPage(1);
  };

  const handleReset = () => {
    setSearchId("");
    setSelectedDepartment("");
    setFilteredDoctors(doctors);
    setCurrentPage(1);
  };

  // Pagination logic
  const indexOfLastDoctor = currentPage * doctorsPerPage;
  const indexOfFirstDoctor = indexOfLastDoctor - doctorsPerPage;
  const currentDoctors = filteredDoctors.slice(indexOfFirstDoctor, indexOfLastDoctor);
  const totalPages = Math.ceil(filteredDoctors.length / doctorsPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Danh sách bác sĩ</h2>

      {/* Tìm kiếm và lọc */}
      <div className="flex flex-wrap items-center gap-4 mb-4">
        <input
          type="text"
          placeholder="Nhập ID bác sĩ"
          value={searchId}
          onChange={(e) => setSearchId(e.target.value)}
          className="border px-3 py-2 rounded w-64"
        />
        <select
          value={selectedDepartment}
          onChange={(e) => handleFilterDepartment(e.target.value)}
          className="border px-3 py-2 rounded w-64"
        >
          <option value="">Tất cả khoa</option>
          {departmentOptions.map((dep) => (
            <option key={dep} value={dep}>{dep}</option>
          ))}
        </select>
        <button
          onClick={handleSearch}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
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

      {error && <p className="text-red-500">{error}</p>}

      {/* Bảng dữ liệu */}
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-300">
          <thead className="bg-gray-200">
            <tr>
              <th className="py-2 px-4 border">ID</th>
              <th className="py-2 px-4 border">Họ tên</th>
              <th className="py-2 px-4 border">Email</th>
              <th className="py-2 px-4 border">Số điện thoại</th>
              <th className="py-2 px-4 border">Chuyên môn</th>
              <th className="py-2 px-4 border">Khoa</th>
            </tr>
          </thead>
          <tbody>
            {currentDoctors.map((doctor) => (
              <tr key={doctor.id} className="hover:bg-gray-100">
                <td className="py-2 px-4 border">{doctor.id}</td>
                <td className="py-2 px-4 border">{doctor.fullName}</td>
                <td className="py-2 px-4 border">{doctor.email}</td>
                <td className="py-2 px-4 border">{doctor.phone}</td>
                <td className="py-2 px-4 border">{doctor.specialization}</td>
                <td className="py-2 px-4 border">{doctor.departmentName}</td>
              </tr>
            ))}
            {currentDoctors.length === 0 && (
              <tr>
                <td colSpan="6" className="text-center py-4">Không tìm thấy bác sĩ</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Phân trang */}
      <div className="mt-4 flex justify-center items-center space-x-2">
        {Array.from({ length: totalPages }, (_, i) => (
          <button
            key={i + 1}
            onClick={() => handlePageChange(i + 1)}
            className={`px-3 py-1 rounded border ${
              currentPage === i + 1 ? "bg-blue-600 text-white" : "bg-white text-black"
            }`}
          >
            {i + 1}
          </button>
        ))}
      </div>
    </div>
  );
}

export default DoctorList;
