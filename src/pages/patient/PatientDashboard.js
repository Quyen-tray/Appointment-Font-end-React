import React, { useEffect, useState } from 'react';
import axios from 'axios';
import styles from "../../assets/css/PatientLayout.module.css";
import { useNavigate } from 'react-router-dom';


export default function PatientDashboard() {
    const [patientInfo, setPatientInfo] = useState(null);
    const [appointment, setAppointment] = useState(null);
    const [latestVisit, setLatestVisit] = useState(null);
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();


    const translateStatus = (status) => {
        switch (status) {
            case "PENDING":
                return { label: "Đang chờ", className: "badge bg-warning text-dark" };
            case "CONFIRMED":
                return { label: "Đã xác nhận", className: "badge bg-success" };
            case "CANCELLED":
                return { label: "Đã huỷ", className: "badge bg-danger" };
            case "APPROVED":
                return { label: "Đã duyệt", className: "badge bg-success" };
            default:
                return { label: status, className: "badge bg-secondary" };
        }
    };
    useEffect(() => {
        const fetchData = async () => {
            try {
                const token = localStorage.getItem("token");
                const headers = {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json'
                };

                const profileRes = await axios.get('http://localhost:8081/api/patient/profile', { headers });
                const patient = profileRes.data;
                setPatientInfo(patient);

                if (patient && patient.id) {
                    const visitsRes = await axios.get(`http://localhost:8081/api/patient/visits/${patient.id}`, { headers });
                    if (Array.isArray(visitsRes.data) && visitsRes.data.length > 0) {
                        const sortedVisits = visitsRes.data.sort(
                            (a, b) => new Date(b.dateOfVisit) - new Date(a.dateOfVisit)
                        );
                        setLatestVisit(sortedVisits[0]);
                    }
                }
                const appointmentRes = await axios.get(
                    'http://localhost:8081/api/patient/my-appointment?page=0&size=1',
                    { headers }
                );
                const list = appointmentRes.data.appointments || [];
                setAppointment(list[0] || null);
                setNotifications([]);

                setLoading(false);
            } catch (err) {
                console.error("Lỗi khi tải dữ liệu bệnh nhân:", err);
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    if (loading) {
        return <div className={styles.loading}>Đang tải dữ liệu...</div>;
    }

    return (
        <div className={styles.patientContainer}>
            <div className={styles.contentWrapper}>
                <div className={styles.patientInfo}>
                    <h2>Thông Tin Cá Nhân</h2>
                    {patientInfo ? (
                        <>
                            <p><strong>Tên:</strong> {patientInfo.name}</p>
                            <p><strong>Ngày sinh:</strong> {patientInfo.dob}</p>
                            <p><strong>Số điện thoại:</strong> {patientInfo.phone}</p>
                            <p><strong>Email:</strong> {patientInfo.email}</p>
                            <button className={styles.viewAllBtn} onClick={() => navigate('profile')}>Chỉnh sửa</button>
                        </>
                    ) : (
                        <p>Không tìm thấy thông tin bệnh nhân.</p>
                    )}
                </div>

                <div className={styles.upcomingAppointments}>
                    <h2>Lịch Hẹn Gần Nhất</h2>
                    {appointment ? (
                        <>
                            <p><strong>Thời gian:</strong> {new Date(appointment.scheduledTime).toLocaleString('vi-VN')}</p>
                            <p><strong>Bác sĩ:</strong> {appointment.doctorName}</p>
                            <p><strong>Phòng:</strong> {appointment.roomName || 'Không rõ'}</p>
                            <p><strong>Trạng thái:</strong> {""}
                                <span className={translateStatus(appointment.status).className}>
                                    {translateStatus(appointment.status).label}
                                </span></p>
                        </>
                    ) : <p>Không có lịch hẹn</p>}
                    <button className={styles.viewAllBtn} onClick={() => navigate('appointments/history')}>Xem tất cả</button>

                </div>

                <div className={styles.notifications}>
                    <h2>Thông Báo</h2>
                    <ul>
                        {notifications.length > 0 ? (
                            notifications.map((notif) => (
                                <li key={notif.id} className={styles.notificationItem}>
                                    {notif.message}
                                </li>
                            ))
                        ) : (
                            <>
                                <li className={styles.notificationItem}>
                                    Hệ thống sẽ bảo trì vào lúc 22:00 ngày 30/07/2025.
                                </li>
                                <li className={styles.notificationItem}>
                                    Vui lòng cập nhật hồ sơ cá nhân để đảm bảo thông tin chính xác.
                                </li>
                            </>
                        )}
                    </ul>
                </div>

                <div className={styles.medicalHistory}>
                    <h2>Lịch Sử Khám Gần Nhất</h2>
                    {latestVisit ? (
                        <ul>
                            <li className={styles.historyItem}>
                                {latestVisit.dateOfVisit}: {latestVisit.diagnosis}
                            </li>
                        </ul>
                    ) : <p>Không có dữ liệu</p>}
                   <button className={styles.viewAllBtn} onClick={() => navigate('medicalvisit')}>Xem Lịch Sử Khám</button>
                </div>
            </div>

            <div style={{ maxWidth: '1150px', margin: '20px auto' }}>
                <button className={styles.viewAllBtn} onClick={() => navigate('booking')}>Đặt Lịch Ngay</button>
            </div>
        </div>
    );
}
