import React, { useEffect, useState } from "react";
import axios from "axios";

function RoomList() {
  const [rooms, setRooms] = useState([]);
  const [searchId, setSearchId] = useState("");
  const [selectedType, setSelectedType] = useState("");
  const [error, setError] = useState("");

  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const pageSize = 3; //size 

  useEffect(() => {
    if (!searchId && !selectedType) {
      fetchRoomsPaginated(page);
    }
  }, [page]);

  const fetchRoomsPaginated = (pageNumber) => {
    axios
      .get(`http://localhost:8081/api/rooms/paginated?page=${pageNumber}&size=${pageSize}`)
      .then((response) => {
        setRooms(response.data.content);
        setTotalPages(response.data.totalPages);
        setError("");
      })
      .catch((error) => {
        console.error("Lỗi khi lấy danh sách phòng:", error);
        setError("Không thể tải danh sách phòng.");
      });
  };

  const fetchAllRooms = () => {
    axios
      .get("http://localhost:8081/api/rooms")
      .then((response) => {
        setRooms(response.data);
        setError("");
        setTotalPages(0); // ẩn phân trang khi không dùng
      })
      .catch((error) => {
        console.error("Lỗi khi lấy danh sách phòng:", error);
        setError("Không thể tải danh sách phòng.");
      });
  };

  const handleSearch = () => {
    if (!searchId.trim()) {
      setPage(0);
      fetchRoomsPaginated(0);
      return;
    }

    axios
      .get(`http://localhost:8081/api/rooms/${searchId}`)
      .then((response) => {
        setRooms([response.data]);
        setError("");
        setTotalPages(0);
      })
      .catch((error) => {
        console.error("Không tìm thấy phòng:", error);
        setRooms([]);
        setError("Không tìm thấy phòng với ID đã nhập.");
        setTotalPages(0);
      });
  };

  const handleFilterByType = (type) => {
    setSelectedType(type);
    setSearchId(""); // reset tìm kiếm khi lọc

    if (!type) {
      setPage(0);
      fetchRoomsPaginated(0);
      return;
    }

    axios
      .get(`http://localhost:8081/api/rooms/filter?type=${encodeURIComponent(type)}`)
      .then((response) => {
        setRooms(response.data);
        setError("");
        setTotalPages(0); // ẩn phân trang khi lọc
      })
      .catch((error) => {
        console.error("Lỗi khi lọc theo loại phòng:", error);
        setRooms([]);
        setError("Không tìm thấy phòng với loại đã chọn.");
        setTotalPages(0);
      });
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Danh sách phòng</h2>

      {/* Tìm kiếm theo ID */}
      <div className="flex gap-2 mb-4">
        <input
          type="text"
          placeholder="Nhập ID phòng"
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

      {/* Dropdown lọc loại phòng */}
      <div className="flex gap-2 mb-4 items-center">
        <label className="font-semibold">Lọc theo loại phòng:</label>
        <select
          value={selectedType}
          onChange={(e) => handleFilterByType(e.target.value)}
          className="border border-gray-300 p-2 rounded"
        >
          <option value="">Tất cả</option>
          <option value="Phòng khám">Phòng khám</option>
          <option value="Phòng cấp cứu">Phòng cấp cứu</option>
          <option value="Phòng mổ">Phòng mổ</option>
        </select>
      </div>

      {/* Thông báo lỗi */}
      {error && <p className="text-red-500 mb-4">{error}</p>}

      {/* Bảng danh sách phòng */}
      <table className="table-auto w-full border border-gray-300">
        <thead className="bg-gray-100">
          <tr>
            <th className="px-4 py-2 border">ID</th>
            <th className="px-4 py-2 border">Tên phòng</th>
            <th className="px-4 py-2 border">Số phòng</th>
            <th className="px-4 py-2 border">Loại</th>
            <th className="px-4 py-2 border">Tầng</th>
            <th className="px-4 py-2 border">Trạng thái</th>
            <th className="px-4 py-2 border">Mô tả</th>
          </tr>
        </thead>
        <tbody>
          {rooms.map((room) => (
            <tr key={room.id} className="hover:bg-gray-50">
              <td className="px-4 py-2 border">{room.id}</td>
              <td className="px-4 py-2 border">{room.roomName || "—"}</td>
              <td className="px-4 py-2 border">{room.roomNumber || "—"}</td>
              <td className="px-4 py-2 border">{room.roomType || "—"}</td>
              <td className="px-4 py-2 border">{room.floor || "—"}</td>
              <td className="px-4 py-2 border">{room.status || "—"}</td>
              <td className="px-4 py-2 border">{room.description || "—"}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Phân trang */}
      {totalPages > 1 && (
        <div className="flex justify-center mt-4 gap-2">
          <button
            onClick={() => setPage((prev) => Math.max(prev - 1, 0))}
            disabled={page === 0}
            className="px-3 py-1 bg-gray-300 rounded disabled:opacity-50"
          >
            Trước
          </button>

          {[...Array(totalPages).keys()].map((p) => (
            <button
              key={p}
              onClick={() => setPage(p)}
              className={`px-3 py-1 rounded ${
                p === page ? "bg-blue-500 text-white" : "bg-gray-200"
              }`}
            >
              {p + 1}
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
    </div>
  );
}

export default RoomList;
