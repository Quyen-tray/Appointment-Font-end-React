import React, { useEffect, useState } from "react";
import axios from "axios";

function RoomList() {
    const [rooms, setRooms] = useState([]);
    const [searchId, setSearchId] = useState("");
    const [selectedType, setSelectedType] = useState("");
    const [roomTypes, setRoomTypes] = useState([]);
    const [error, setError] = useState("");

    const [page, setPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const pageSize = 3;

    useEffect(() => {
        fetchRoomTypes();
        if (!searchId && !selectedType) {
            fetchRoomsPaginated(page);
        }
    }, [page]);

    const fetchRoomTypes = () => {
        const token = localStorage.getItem("token");
        axios
            .get("http://localhost:8081/api/rooms/types", {
                headers: { Authorization: `Bearer ${token}` },
            })
            .then((res) => setRoomTypes(res.data))
            .catch((err) => console.error("Lỗi khi lấy loại phòng:", err));
    };

    const fetchRoomsPaginated = (pageNumber) => {
        const token = localStorage.getItem("token");
        axios
            .get(`http://localhost:8081/api/rooms/paginated?page=${pageNumber}&size=${pageSize}`, {
                headers: { Authorization: `Bearer ${token}` },
            })
            .then((response) => {
                setRooms(response.data.content);
                setTotalPages(response.data.totalPages);
                setError("");
            })
            .catch((error) => {
                console.error("Lỗi khi tải phòng:", error);
                setError("Không thể tải danh sách phòng.");
            });
    };

    const handleSearch = () => {
        if (!searchId.trim()) {
            setPage(0);
            fetchRoomsPaginated(0);
            return;
        }

        const token = localStorage.getItem("token");
        axios
            .get(`http://localhost:8081/api/rooms/${searchId}`, {
                headers: { Authorization: `Bearer ${token}` },
            })
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
        setSearchId("");

        if (!type) {
            setPage(0);
            fetchRoomsPaginated(0);
            return;
        }

        const token = localStorage.getItem("token");
        axios
            .get(`http://localhost:8081/api/rooms/filter?type=${encodeURIComponent(type)}`, {
                headers: { Authorization: `Bearer ${token}` },
            })
            .then((response) => {
                setRooms(response.data);
                setError("");
                setTotalPages(0);
            })
            .catch((error) => {
                console.error("Lỗi khi lọc loại phòng:", error);
                setRooms([]);
                setError("Không tìm thấy phòng với loại đã chọn.");
                setTotalPages(0);
            });
    };

    const handleReset = () => {
        setSearchId("");
        setSelectedType("");
        setPage(0);
        fetchRoomsPaginated(0);
    };

    return (
        <div className="p-6 max-w-7xl mx-auto">
            <h2 style={{ color: '#2563eb' }} className="mb-6 font-bold text-center text-2xl">
                📋 Danh sách phòng
            </h2>

            {/* Bộ lọc */}
            <div className="bg-white rounded-xl shadow p-6 mb-6">
                <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
                    <div className="flex flex-col gap-2">
                        <label className="text-sm font-medium text-gray-700">Tìm theo ID:</label>
                        <input
                            type="text"
                            value={searchId}
                            onChange={(e) => setSearchId(e.target.value)}
                            placeholder="Nhập ID phòng"
                            className="border border-gray-300 p-2 rounded w-full md:w-64"
                        />
                    </div>

                    <div className="flex flex-col gap-2">
                        <label className="text-sm font-medium text-gray-700">Lọc theo loại:</label>
                        <select
                            value={selectedType}
                            onChange={(e) => handleFilterByType(e.target.value)}
                            className="border border-gray-300 p-2 rounded w-full md:w-64"
                        >
                            <option value="">Tất cả</option>
                            {roomTypes.map((type, i) => (
                                <option key={i} value={type}>{type}</option>
                            ))}
                        </select>
                    </div>

                    <div className="flex gap-2">
                        <button
                            onClick={handleSearch}
                            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
                        >
                            Tìm kiếm
                        </button>
                        <button
                            onClick={handleReset}
                            className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded"
                        >
                            Đặt lại
                        </button>
                    </div>
                </div>
            </div>

            {/* Thông báo lỗi */}
            {error && <div className="text-red-600 mb-4 font-semibold">{error}</div>}

            {/* Danh sách phòng */}
            <div className="overflow-x-auto bg-white rounded-xl shadow">
                <table className="min-w-full table-auto">
                    <thead className="bg-gray-100 text-gray-700">
                    <tr>
                        <th className="px-4 py-3 text-left">ID</th>
                        <th className="px-4 py-3 text-left">Tên phòng</th>
                        <th className="px-4 py-3 text-left">Số phòng</th>
                        <th className="px-4 py-3 text-left">Loại</th>
                        <th className="px-4 py-3 text-left">Tầng</th>
                        <th className="px-4 py-3 text-left">Trạng thái</th>
                        <th className="px-4 py-3 text-left">Mô tả</th>
                    </tr>
                    </thead>
                    <tbody>
                    {rooms.map((room) => (
                        <tr key={room.id} className="border-b hover:bg-gray-50">
                            <td className="px-4 py-3">{room.id}</td>
                            <td className="px-4 py-3">{room.roomName || "—"}</td>
                            <td className="px-4 py-3">{room.roomNumber || "—"}</td>
                            <td className="px-4 py-3">{room.roomType || "—"}</td>
                            <td className="px-4 py-3">{room.floor || "—"}</td>
                            <td className="px-4 py-3">{room.status || "—"}</td>
                            <td className="px-4 py-3">{room.description || "—"}</td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>

            {/* Phân trang */}
            {totalPages > 1 && (
                <div className="flex justify-center mt-6 gap-2 flex-wrap">
                    <button
                        onClick={() => setPage((prev) => Math.max(prev - 1, 0))}
                        disabled={page === 0}
                        className="px-3 py-1 bg-gray-300 hover:bg-gray-400 rounded disabled:opacity-50"
                    >
                        ◀ Trước
                    </button>

                    {[...Array(totalPages).keys()].map((p) => (
                        <button
                            key={p}
                            onClick={() => setPage(p)}
                            className={`px-3 py-1 rounded ${
                                p === page ? "bg-blue-600 text-white" : "bg-gray-200"
                            }`}
                        >
                            {p + 1}
                        </button>
                    ))}

                    <button
                        onClick={() => setPage((prev) => Math.min(prev + 1, totalPages - 1))}
                        disabled={page === totalPages - 1}
                        className="px-3 py-1 bg-gray-300 hover:bg-gray-400 rounded disabled:opacity-50"
                    >
                        Sau ▶
                    </button>
                </div>
            )}
        </div>
    );
}

export default RoomList;
