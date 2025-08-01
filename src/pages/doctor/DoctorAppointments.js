import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { DoctorAppointmentApi } from "../../service/DoctorAppointmentApi";

export default function DoctorAppointments() {
    const navigate = useNavigate();
    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [filters, setFilters] = useState({
        status: "all",
        date: "",
        searchTerm: ""
    });
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);

    useEffect(() => {
        fetchAppointments();
    }, [filters.status, filters.date]);

    const fetchAppointments = async () => {
        try {
            setLoading(true);
            const params = {};
            if (filters.status !== "all") params.status = filters.status;
            if (filters.date) params.date = filters.date;

            const data = await DoctorAppointmentApi.getMyAppointments(params);
            setAppointments(data);
        } catch (err) {
            setError("Không thể tải danh sách cuộc hẹn. Vui lòng thử lại sau.");
            console.error("Error fetching appointments:", err);
        } finally {
            setLoading(false);
        }
    };

    const handleAddNote = (appointment) => {
        navigate(`/doctor/appointments/${appointment.id}/note`);
    };

    const handleEditNote = (appointment) => {
        navigate(`/doctor/appointments/${appointment.id}/note`);
    };

    const handleDeleteNote = async (appointmentId) => {
        if (window.confirm("Bạn có chắc chắn muốn xóa ghi chú này?")) {
            try {
                await DoctorAppointmentApi.deleteAppointmentNote(appointmentId);
                fetchAppointments(); // Refresh list
                alert("Xóa ghi chú thành công!");
            } catch (err) {
                alert("Có lỗi xảy ra khi xóa ghi chú!");
                console.error("Error deleting note:", err);
            }
        }
    };



    function formatDate(dateString) {
        if (!dateString) return "null";

        let d = new Date(
            /(\+|\-)\d{2}:\d{2}|Z$/.test(dateString)
                ? dateString
                : dateString.replace(' ', 'T')
        );

        if (isNaN(d.getTime())) return dateString;

        // Hiển thị theo múi giờ máy người dùng (local time)
        const day = String(d.getDate()).padStart(2, '0');
        const month = String(d.getMonth() + 1).padStart(2, '0');
        const year = d.getFullYear();
        const hour = String(d.getHours()).padStart(2, '0');
        const minute = String(d.getMinutes()).padStart(2, '0');

        return `${day}/${month}/${year} ${hour}:${minute}`;
    }

    const filteredAppointments = appointments.filter(appointment => {
        if (filters.searchTerm) {
            const searchLower = filters.searchTerm.toLowerCase();
            const patientName = appointment.patient?.fullName?.toLowerCase() || "";
            const patientPhone = appointment.patient?.phone?.toLowerCase() || "";
            const note = appointment.note?.toLowerCase() || "";

            return patientName.includes(searchLower) ||
                patientPhone.includes(searchLower) ||
                note.includes(searchLower);
        }
        return true;
    });

    // Pagination calculations
    const totalPages = Math.ceil(filteredAppointments.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const currentAppointments = filteredAppointments.slice(startIndex, endIndex);

    // Reset to page 1 when filters change
    useEffect(() => {
        setCurrentPage(1);
    }, [filters.status, filters.date, filters.searchTerm]);

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    const handleItemsPerPageChange = (newItemsPerPage) => {
        setItemsPerPage(newItemsPerPage);
        setCurrentPage(1); // Reset to first page
    };

    const formatTime = (timeString) => {
        return new Date(`2000-01-01T${timeString}`).toLocaleTimeString("vi-VN", {
            hour: "2-digit",
            minute: "2-digit"
        });
    };

    const getStatusBadge = (status) => {
        const statusConfig = {
            PENDING: { class: "bg-warning", text: "Chờ xác nhận" },
            CONFIRMED: { class: "bg-info", text: "Đã xác nhận" },
            COMPLETED: { class: "bg-success", text: "Hoàn thành" },
            CANCELLED: { class: "bg-danger", text: "Đã hủy" },
            IN_PROGRESS: { class: "bg-primary", text: "Đang khám" }
        };

        const config = statusConfig[status] || { class: "bg-secondary", text: status };
        return <span className={`badge ${config.class}`}>{config.text}</span>;
    };

    if (loading) {
        return (
            <div className="d-flex justify-content-center mt-5">
                <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Đang tải...</span>
                </div>
            </div>
        );
    }

    return (
        <div className="container-fluid">
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
            >
                {/* Header */}
                <div className="d-flex justify-content-between align-items-center mb-4">
                    <div>
                        <h2 className="fw-bold text-primary mb-1">
                            <i className="fas fa-calendar-check me-2"></i>
                            Quản Lý Cuộc Hẹn
                        </h2>
                        <p className="text-muted mb-0">
                            Danh sách lịch hẹn của bạn
                        </p>
                    </div>
                    <button
                        className="btn btn-outline-primary"
                        onClick={fetchAppointments}
                        disabled={loading}
                    >
                        <i className="fas fa-sync-alt me-2"></i>
                        Làm mới
                    </button>
                </div>

                {error && (
                    <div className="alert alert-danger" role="alert">
                        {error}
                    </div>
                )}

                {/* Filters */}
                <div className="row mb-4">

                    <div className="col-md-4">
                        <input
                            type="text"
                            className="form-control"
                            placeholder="Tìm theo tên bệnh nhân, SĐT hoặc thông tin khám..."
                            value={filters.searchTerm}
                            onChange={(e) => setFilters({ ...filters, searchTerm: e.target.value })}
                        />
                    </div>
                    <div className="col-md-2">
                        <div className="text-muted">
                            Tổng: {filteredAppointments.length} cuộc hẹn
                        </div>
                    </div>
                    <div className="col-md-3">
                        <div className="d-flex align-items-center">
                            <label className="form-label me-2 mb-0 text-nowrap">Hiển thị:</label>
                            <select
                                className="form-select form-select-sm"
                                value={itemsPerPage}
                                onChange={(e) => handleItemsPerPageChange(Number(e.target.value))}
                            >
                                <option value={5}>5</option>
                                <option value={10}>10</option>
                                <option value={20}>20</option>
                                <option value={50}>50</option>
                            </select>
                            <span className="ms-2 text-muted text-nowrap">/ trang</span>
                        </div>
                    </div>
                </div>

                {/* Appointments Table */}
                <div className="card">
                    <div className="card-body">
                        {currentAppointments.length === 0 ? (
                            <div className="text-center py-5">
                                <i className="fas fa-calendar-times fa-3x text-muted mb-3"></i>
                                <h5 className="text-muted">
                                    {filteredAppointments.length === 0 ? "Không có cuộc hẹn nào" : "Không có kết quả tìm kiếm"}
                                </h5>
                            </div>
                        ) : (
                            <div className="table-responsive">
                                <table className="table table-hover">
                                    <thead className="table-light">
                                        <tr>
                                            <th>Bệnh nhân</th>
                                            <th>Ngày & Giờ</th>
                                            <th>Trạng thái</th>
                                            <th>Thông tin khám</th>
                                            <th>Thao tác</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {currentAppointments.map((appointment) => (
                                            <tr key={appointment.id}>
                                                <td>
                                                    <div>
                                                        <div className="fw-bold">
                                                            {appointment.patient?.fullName || "N/A"}
                                                        </div>
                                                        <small className="text-muted">
                                                            <i className="fas fa-phone me-1"></i>
                                                            {appointment.patient?.phone || "N/A"}
                                                        </small>
                                                    </div>
                                                </td>
                                                <td>
                                                    <div>
                                                        <div className="fw-bold">
                                                            {formatDate(appointment.scheduledTime)}
                                                        </div>
                                                    </div>
                                                </td>
                                                <td>
                                                    <div className="d-flex flex-column gap-1">
                                                        {getStatusBadge(appointment.status)}
                                                    </div>
                                                </td>
                                                <td>
                                                    <div style={{ maxWidth: "200px" }}>
                                                        {appointment.note ? (
                                                            <div
                                                                className="text-truncate"
                                                                title={appointment.note}
                                                            >
                                                                {appointment.note}
                                                            </div>
                                                        ) : (
                                                            <em className="text-muted">Chưa khám</em>
                                                        )}
                                                    </div>
                                                </td>
                                                <td>
                                                    <div className="btn-group" role="group">
                                                        {/* Note Actions */}
                                                        {appointment.note ? (
                                                            <>
                                                                <button
                                                                    className="btn btn-sm btn-outline-primary"
                                                                    onClick={() => handleEditNote(appointment)}
                                                                    title="Cập nhật thông tin khám"
                                                                >
                                                                    <i className="fas fa-edit"></i>
                                                                </button>
                                                                <button
                                                                    className="btn btn-sm btn-outline-danger"
                                                                    onClick={() => handleDeleteNote(appointment.id)}
                                                                    title="Xóa thông tin khám"
                                                                >
                                                                    <i className="fas fa-trash"></i>
                                                                </button>
                                                            </>
                                                        ) : (
                                                            <button
                                                                className="btn btn-sm btn-outline-success"
                                                                onClick={() => handleAddNote(appointment)}
                                                                title="Thêm thông tin khám"
                                                            >
                                                                <i className="fas fa-plus"></i>
                                                            </button>
                                                        )}


                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                </div>

                {/* Pagination */}
                {filteredAppointments.length > 0 && totalPages > 1 && (
                    <div className="d-flex justify-content-between align-items-center mt-4">
                        <div className="text-muted">
                            Hiển thị {startIndex + 1} - {Math.min(endIndex, filteredAppointments.length)} của {filteredAppointments.length} cuộc hẹn
                        </div>

                        <nav>
                            <ul className="pagination pagination-sm mb-0">
                                {/* Previous Button */}
                                <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                                    <button
                                        className="page-link"
                                        onClick={() => handlePageChange(currentPage - 1)}
                                        disabled={currentPage === 1}
                                    >
                                        <i className="fas fa-chevron-left"></i>
                                    </button>
                                </li>

                                {/* Page Numbers */}
                                {(() => {
                                    const pages = [];
                                    const maxVisiblePages = 5;
                                    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
                                    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

                                    // Adjust startPage if we're near the end
                                    if (endPage - startPage + 1 < maxVisiblePages) {
                                        startPage = Math.max(1, endPage - maxVisiblePages + 1);
                                    }

                                    // First page + ellipsis
                                    if (startPage > 1) {
                                        pages.push(
                                            <li key={1} className="page-item">
                                                <button className="page-link" onClick={() => handlePageChange(1)}>
                                                    1
                                                </button>
                                            </li>
                                        );
                                        if (startPage > 2) {
                                            pages.push(
                                                <li key="ellipsis1" className="page-item disabled">
                                                    <span className="page-link">...</span>
                                                </li>
                                            );
                                        }
                                    }

                                    // Visible page range
                                    for (let i = startPage; i <= endPage; i++) {
                                        pages.push(
                                            <li key={i} className={`page-item ${currentPage === i ? 'active' : ''}`}>
                                                <button className="page-link" onClick={() => handlePageChange(i)}>
                                                    {i}
                                                </button>
                                            </li>
                                        );
                                    }

                                    // Last page + ellipsis
                                    if (endPage < totalPages) {
                                        if (endPage < totalPages - 1) {
                                            pages.push(
                                                <li key="ellipsis2" className="page-item disabled">
                                                    <span className="page-link">...</span>
                                                </li>
                                            );
                                        }
                                        pages.push(
                                            <li key={totalPages} className="page-item">
                                                <button className="page-link" onClick={() => handlePageChange(totalPages)}>
                                                    {totalPages}
                                                </button>
                                            </li>
                                        );
                                    }

                                    return pages;
                                })()}

                                {/* Next Button */}
                                <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                                    <button
                                        className="page-link"
                                        onClick={() => handlePageChange(currentPage + 1)}
                                        disabled={currentPage === totalPages}
                                    >
                                        <i className="fas fa-chevron-right"></i>
                                    </button>
                                </li>
                            </ul>
                        </nav>
                    </div>
                )}
            </motion.div>

        </div>
    );
} 