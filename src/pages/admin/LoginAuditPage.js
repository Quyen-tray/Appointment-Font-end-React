import React, { useEffect, useState } from "react";
import {
    fetchLoginAudits,
    fetchLoginStats,
    fetchRecentLogins,
    exportLoginAuditExcel,
} from "./service/LoginAuditApi";
import { saveAs } from "file-saver";
import { format } from "date-fns";
import { Pie } from "react-chartjs-2";

export default function LoginAuditPage() {
    const [data, setData] = useState([]);
    const [page, setPage] = useState(0);
    const [size] = useState(10);
    const [totalPages, setTotalPages] = useState(0);
    const [keyword, setKeyword] = useState("");
    const [event, setEvent] = useState("");
    const [stats, setStats] = useState({});
    const [recent, setRecent] = useState([]);

    const loadData = async () => {
        const res = await fetchLoginAudits({
            page,
            size,
            sort: "timestamp,desc",
            username: keyword,
            event,
        });
        setData(res.data.content);
        setTotalPages(res.data.totalPages);
    };

    useEffect(() => {
        loadData();
        fetchLoginStats().then((res) => setStats(res.data));
        fetchRecentLogins().then((res) => setRecent(res.data));
    }, [page, keyword, event]);

    const handleExport = async () => {
        const res = await exportLoginAuditExcel();
        const blob = new Blob([res.data], { type: "application/vnd.ms-excel" });
        saveAs(blob, "login_audit.xlsx");
    };

    return (
        <div className="p-6 max-w-7xl mx-auto space-y-6">
            <h2 className="text-xl font-bold">Lịch sử đăng nhập</h2>

            <div className="flex gap-2 flex-wrap mb-4">
                <input
                    placeholder="Tìm theo username"
                    className="border px-3 py-1 rounded"
                    value={keyword}
                    onChange={(e) => {
                        setPage(0);
                        setKeyword(e.target.value);
                    }}
                />
                <select
                    className="border px-3 py-1 rounded"
                    value={event}
                    onChange={(e) => {
                        setPage(0);
                        setEvent(e.target.value);
                    }}
                >
                    <option value="">Tất cả sự kiện</option>
                    <option value="LOGIN_SUCCESS">Thành công</option>
                    <option value="LOGIN_FAILED">Thất bại</option>
                    <option value="LOGOUT">Đăng xuất</option>
                    <option value="FIRST_LOGIN">Lần đầu</option>
                </select>
                <button
                    onClick={handleExport}
                    className="bg-green-500 text-white px-4 py-1 rounded"
                >
                    Xuất Excel
                </button>
            </div>

            <table className="w-full border text-sm">
                <thead className="bg-gray-100">
                <tr>
                    <th className="border px-2 py-1">Username</th>
                    <th className="border px-2 py-1">Sự kiện</th>
                    <th className="border px-2 py-1">IP</th>
                    <th className="border px-2 py-1">Thời gian</th>
                </tr>
                </thead>
                <tbody>
                {data.map((log) => (
                    <tr key={log.id}>
                        <td className="border px-2 py-1">{log.username}</td>
                        <td className="border px-2 py-1">{log.event}</td>
                        <td className="border px-2 py-1">{log.ipAddress}</td>
                        <td className="border px-2 py-1">
                            {format(new Date(log.timestamp), "dd/MM/yyyy HH:mm:ss")}
                        </td>
                    </tr>
                ))}
                {data.length === 0 && (
                    <tr>
                        <td colSpan="4" className="text-center text-gray-500 py-2">
                            Không có kết quả
                        </td>
                    </tr>
                )}
                </tbody>
            </table>

            {/* Phân trang */}
            <div className="flex justify-center gap-2 mt-4">
                {Array.from({length: totalPages}).map((_, i) => (
                    <button
                        key={i}
                        onClick={() => setPage(i)}
                        className={`px-3 py-1 rounded ${
                            i === page ? "bg-blue-500 text-white" : "bg-gray-200"
                        }`}
                    >
                        {i + 1}
                    </button>
                ))}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Bảng đăng nhập gần đây - cột trái */}
                <div className="md:col-span-2">
                        <h4 className="font-semibold mb-2">Đăng nhập gần đây</h4>
                        <table className="w-full border shadow-sm text-left text-sm">
                            <thead className="bg-gray-200">
                            <tr>
                                <th className="px-3 py-2 border">Người dùng</th>
                                <th className="px-3 py-2 border">Thời gian</th>
                            </tr>
                            </thead>
                            <tbody>
                            {recent.map((log, idx) => (
                                <tr key={idx} className="hover:bg-gray-50">
                                    <td className="px-3 py-2 border">{log.username}</td>
                                    <td className="px-3 py-2 border">
                                        {format(new Date(log.timestamp), "dd/MM/yyyy HH:mm:ss")}
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                </div>
                <div className="md:col-span-1">
                    {/* Biểu đồ Pie - cột phải */}
                        <h4 className="font-semibold mb-2">Thống kê trạng thái đăng nhập</h4>
                        <Pie
                            data={{
                                labels: ["Thành công", "Thất bại", "Lần đầu"],
                                datasets: [
                                    {
                                        data: [
                                            stats.success || 0,
                                            stats.failed || 0,
                                            stats.first || 0,
                                        ],
                                        backgroundColor: ["#10b981", "#ef4444", "#f59e0b"],
                                    },
                                ],
                            }}
                        />
                </div>
            </div>

        </div>
    );
}
