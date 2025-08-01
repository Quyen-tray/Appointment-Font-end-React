import React, { useEffect, useState } from "react";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    ArcElement,
    Title,
    Tooltip,
    Legend,
} from "chart.js";

import { Bar, Pie, Line } from "react-chartjs-2";
import {
    fetchLoginStats,
    fetchRecentLogins,
    fetchTopEndpoints,
    fetchCallStatsPerDay,
    fetchAvgDurations,
    fetchMethodStats,
} from "./service/MonitoringApi";

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    ArcElement,
    Title,
    Tooltip,
    Legend
);

export default function AdminHome() {
    const [loginStats, setLoginStats] = useState({});
    const [recentLogins, setRecentLogins] = useState([]);
    const [topEndpoints, setTopEndpoints] = useState([]);
    const [callStats, setCallStats] = useState([]);
    const [avgDurations, setAvgDurations] = useState([]);
    const [methodStats, setMethodStats] = useState([]);

    useEffect(() => {
        fetchLoginStats().then(setLoginStats);
        fetchRecentLogins().then(setRecentLogins);
        fetchTopEndpoints().then(setTopEndpoints);
        fetchCallStatsPerDay().then(setCallStats);
        fetchAvgDurations().then(setAvgDurations);
        fetchMethodStats().then(setMethodStats);
    }, []);
    console.log(recentLogins);

    return (
        <div className="p-6 max-w-6xl mx-auto space-y-8">
            <h2 className="text-2xl font-bold">Thống kê hệ thống</h2>

            {/* Số liệu tổng quan */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-center">
                <div className="bg-blue-100 p-4 rounded shadow">Đăng nhập hôm nay: <b>{loginStats.today}</b></div>
                <div className="bg-green-100 p-4 rounded shadow">Tuần này: <b>{loginStats.week}</b></div>
                <div className="bg-yellow-100 p-4 rounded shadow">Tháng này: <b>{loginStats.month}</b></div>
                <div className="bg-red-100 p-4 rounded shadow">Thất bại: <b>{loginStats.failed}</b></div>
                <div className="bg-purple-100 p-4 rounded shadow">Đăng nhập lần đầu: <b>{loginStats.firstLogins}</b>
                </div>
            </div>


            {/* Biểu đồ thống kê */}
            <div className="grid md:grid-cols-2 gap-8">
                <div>
                    <h4 className="font-semibold mb-2">Thống kê gọi API theo ngày</h4>
                    <Line
                        data={{
                            labels: callStats.map(item => item.date),
                            datasets: [
                                {
                                    label: "Số request",
                                    data: callStats.map(item => item.count),
                                    borderColor: "blue",
                                    fill: false,
                                },
                            ],
                        }}
                    />
                </div>
                <div>
                    <h4 className="font-semibold mb-2">Top 5 Endpoint</h4>
                    <Bar
                        data={{
                            labels: topEndpoints.map(item => item.endpoint),
                            datasets: [
                                {
                                    label: "Số lần gọi",
                                    data: topEndpoints.map(item => item.count),
                                    backgroundColor: "teal",
                                },
                            ],
                        }}
                    />
                </div>
                <div>
                    <h4 className="font-semibold mb-2">Thống kê theo phương thức</h4>
                    <Pie
                        data={{
                            labels: methodStats.map(item => item.method),
                            datasets: [
                                {
                                    data: methodStats.map(item => item.count),
                                    backgroundColor: ["#3b82f6", "#10b981", "#f59e0b", "#ef4444"],
                                },
                            ],
                        }}
                    />
                </div>
                <div>
                    <h4 className="font-semibold mb-2">Thời gian xử lý trung bình</h4>
                    <Bar
                        data={{
                            labels: avgDurations.map(item => item.endpoint),
                            datasets: [
                                {
                                    label: "Thời gian (ms)",
                                    data: avgDurations.map(item => item.averageDuration),
                                    backgroundColor: "#8b5cf6",
                                },
                            ],
                        }}
                    />
                </div>
            </div>

            {/* Đăng nhập gần đây */}
            <div>
                <h4 className="font-semibold mb-2">Đăng nhập gần đây</h4>
                <ul className="list-disc pl-6">
                    {recentLogins.map((log, idx) => (
                        <li key={idx}>{log.username} - {log.timestamp}</li>
                    ))}
                </ul>
            </div>
        </div>
    );
}
