import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { PatientPaymentApi } from "../../service/PatientPaymentApi";
import "../../assets/css/patient-payment.css";

export default function UnpaidInvoices() {
    const [invoices, setInvoices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [sendingEmail, setSendingEmail] = useState(false);
    const [error, setError] = useState("");
    const [selectedInvoices, setSelectedInvoices] = useState([]);
    const [selectedInvoice, setSelectedInvoice] = useState(null);
    const [showDetailsModal, setShowDetailsModal] = useState(false);
    const [filters, setFilters] = useState({
        searchTerm: "",
        status: "all",
        dateRange: ""
    });

    useEffect(() => {
        fetchAllUnpaidInvoices();
    }, []);

    const fetchAllUnpaidInvoices = async () => {
        try {
            setLoading(true);
            const data = await PatientPaymentApi.getAllUnpaidInvoices();
            setInvoices(data);
        } catch (err) {
            setError("Không thể tải danh sách hóa đơn. Vui lòng thử lại sau.");
            console.error("Error fetching unpaid invoices:", err);
        } finally {
            setLoading(false);
        }
    };

    const handleViewDetails = (invoice) => {
        setSelectedInvoice(invoice);
        setShowDetailsModal(true);
    };

    const handleSelectInvoice = (invoiceId) => {
        setSelectedInvoices(prev => {
            if (prev.includes(invoiceId)) {
                return prev.filter(id => id !== invoiceId);
            } else {
                return [...prev, invoiceId];
            }
        });
    };

    const handleSelectAll = () => {
        if (selectedInvoices.length === filteredInvoices.length) {
            setSelectedInvoices([]);
        } else {
            setSelectedInvoices(filteredInvoices.map(invoice => invoice.id));
        }
    };

    const handleSendReminderEmail = async () => {
        if (selectedInvoices.length === 0) {
            alert("Vui lòng chọn ít nhất một hóa đơn để gửi email nhắc nhở!");
            return;
        }

        if (!window.confirm(`Xác nhận gửi email nhắc nhở cho ${selectedInvoices.length} hóa đơn chưa thanh toán?`)) {
            return;
        }

        try {
            setSendingEmail(true);
            await PatientPaymentApi.sendReminderEmails(selectedInvoices);
            alert(`Đã gửi email nhắc nhở thành công cho ${selectedInvoices.length} hóa đơn!`);
            setSelectedInvoices([]);
            fetchAllUnpaidInvoices(); // Refresh list
        } catch (err) {
            alert("Có lỗi xảy ra khi gửi email nhắc nhở. Vui lòng thử lại!");
            console.error("Error sending reminder emails:", err);
        } finally {
            setSendingEmail(false);
        }
    };

    const formatDate = (dateString) => {
        if (!dateString) return "N/A";
        const date = new Date(dateString);
        return date.toLocaleDateString("vi-VN");
    };

    const getStatusBadge = (status) => {
        const statusConfig = {
            UNPAID: { class: "bg-warning text-dark status-badge", text: "Chưa thanh toán", icon: "fas fa-clock" },
            PAID: { class: "bg-success status-badge", text: "Đã thanh toán", icon: "fas fa-check-circle" },
            OVERDUE: { class: "bg-danger status-badge", text: "Quá hạn", icon: "fas fa-exclamation-triangle" },
            CANCELLED: { class: "bg-secondary status-badge", text: "Đã hủy", icon: "fas fa-times-circle" }
        };

        const config = statusConfig[status] || { class: "bg-secondary status-badge", text: status, icon: "fas fa-question" };
        return (
            <span className={`badge ${config.class}`}>
                <i className={`${config.icon} me-1`}></i>
                {config.text}
            </span>
        );
    };

    const filteredInvoices = invoices.filter(invoice => {
        if (filters.searchTerm) {
            const searchLower = filters.searchTerm.toLowerCase();
            const patientName = invoice.patientName?.toLowerCase() || "";
            const patientPhone = invoice.patientPhone?.toLowerCase() || "";
            const invoiceNumber = invoice.invoiceNumber?.toLowerCase() || "";
            const doctorName = invoice.doctorName?.toLowerCase() || "";

            return patientName.includes(searchLower) ||
                patientPhone.includes(searchLower) ||
                invoiceNumber.includes(searchLower) ||
                doctorName.includes(searchLower);
        }
        return true;
    });

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
                            <i className="fas fa-file-invoice-dollar me-2"></i>
                            Quản Lý Hóa Đơn Chưa Thanh Toán
                        </h2>
                        <p className="text-muted mb-0">
                            Quản lý và gửi email nhắc nhở cho tất cả bệnh nhân chưa thanh toán
                        </p>
                    </div>
                    <div className="d-flex gap-2">
                        <button
                            className="btn btn-outline-primary"
                            onClick={fetchAllUnpaidInvoices}
                            disabled={loading}
                        >
                            <i className="fas fa-sync-alt me-2"></i>
                            Làm mới
                        </button>
                        <button
                            className="btn btn-warning"
                            onClick={handleSendReminderEmail}
                            disabled={sendingEmail || selectedInvoices.length === 0}
                        >
                            {sendingEmail ? (
                                <>
                                    <div className="spinner-border spinner-border-sm me-2" role="status"></div>
                                    Đang gửi...
                                </>
                            ) : (
                                <>
                                    <i className="fas fa-envelope me-2"></i>
                                    Gửi nhắc nhở ({selectedInvoices.length})
                                </>
                            )}
                        </button>
                    </div>
                </div>

                {error && (
                    <div className="alert alert-danger" role="alert">
                        <i className="fas fa-exclamation-triangle me-2"></i>
                        {error}
                    </div>
                )}

                {/* Filters */}
                <div className="row mb-4">
                    <div className="col-md-6">
                        <input
                            type="text"
                            className="form-control"
                            placeholder="Tìm theo tên bệnh nhân, SĐT, số hóa đơn hoặc bác sĩ..."
                            value={filters.searchTerm}
                            onChange={(e) => setFilters({ ...filters, searchTerm: e.target.value })}
                        />
                    </div>

                    <div className="col-md-3">
                        <div className="text-muted">
                            Tổng: {filteredInvoices.length} hóa đơn
                        </div>
                    </div>
                </div>

                {/* Invoices List */}
                {filteredInvoices.length === 0 ? (
                    <div className="text-center py-5 empty-state">
                        <i className="fas fa-check-circle fa-3x text-success mb-3"></i>
                        <h5 className="text-muted">Tuyệt vời! Không có hóa đơn nào chưa thanh toán</h5>
                        <p className="text-muted">Tất cả bệnh nhân đã thanh toán đầy đủ</p>
                    </div>
                ) : (
                    <div className="card">
                        <div className="card-header bg-light">
                            <div className="d-flex justify-content-between align-items-center">
                                <h6 className="mb-0 fw-bold">
                                    <i className="fas fa-list me-2"></i>
                                    Danh sách hóa đơn chưa thanh toán
                                </h6>
                                <div className="d-flex align-items-center gap-3">
                                    <div className="form-check">
                                        <input
                                            className="form-check-input"
                                            type="checkbox"
                                            checked={selectedInvoices.length === filteredInvoices.length && filteredInvoices.length > 0}
                                            onChange={handleSelectAll}
                                        />
                                        <label className="form-check-label">
                                            Chọn tất cả
                                        </label>
                                    </div>
                                    <span className="text-muted">
                                        Đã chọn: {selectedInvoices.length}
                                    </span>
                                </div>
                            </div>
                        </div>
                        <div className="card-body p-0">
                            <div className="table-responsive">
                                <table className="table table-hover mb-0">
                                    <thead className="table-light">
                                        <tr>
                                            <th width="50">
                                                <i className="fas fa-check-square"></i>
                                            </th>
                                            <th>Bệnh nhân</th>
                                            <th>Số hóa đơn</th>
                                            <th>Ngày khám</th>
                                            <th>Số tiền</th>
                                            <th>Trạng thái</th>
                                            <th>Thao tác</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {filteredInvoices.map((invoice) => (
                                            <tr key={invoice.id}>
                                                <td>
                                                    <div className="form-check">
                                                        <input
                                                            className="form-check-input"
                                                            type="checkbox"
                                                            checked={selectedInvoices.includes(invoice.id)}
                                                            onChange={() => handleSelectInvoice(invoice.id)}
                                                        />
                                                    </div>
                                                </td>
                                                <td>
                                                    <div>
                                                        <div className="fw-bold">
                                                            {invoice.patientName || "N/A"}
                                                        </div>
                                                        <small className="text-muted">
                                                            <i className="fas fa-phone me-1"></i>
                                                            {invoice.patientPhone || "N/A"}
                                                        </small>
                                                    </div>
                                                </td>
                                                <td>
                                                    <span className="fw-bold text-primary">
                                                        {invoice.id}
                                                    </span>
                                                </td>
                                                <td>{formatDate(invoice.issuedDate)}</td>
                                                <td>
                                                    <span className="fw-bold text-danger">
                                                        {invoice.amount?.toLocaleString()} VNĐ
                                                    </span>
                                                </td>
                                                <td>{getStatusBadge(invoice.status)}</td>
                                                <td>
                                                    <button
                                                        className="btn btn-sm btn-outline-info"
                                                        onClick={() => handleViewDetails(invoice)}
                                                        title="Xem chi tiết"
                                                    >
                                                        <i className="fas fa-eye"></i>
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                )}
            </motion.div>

            {/* Invoice Details Modal */}
            {showDetailsModal && selectedInvoice && (
                <div className="modal show d-block" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
                    <div className="modal-dialog modal-lg">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">
                                    <i className="fas fa-file-invoice me-2"></i>
                                    Chi tiết hóa đơn: {selectedInvoice.invoiceNumber}
                                </h5>
                                <button
                                    type="button"
                                    className="btn-close"
                                    onClick={() => setShowDetailsModal(false)}
                                ></button>
                            </div>
                            <div className="modal-body">
                                {/* Invoice Info */}
                                <div className="row mb-4">
                                    <div className="col-md-6">
                                        <h6 className="fw-bold mb-3">Thông tin hóa đơn</h6>
                                        <p><strong>Ngày tạo:</strong> {formatDate(selectedInvoice.issuedDate || selectedInvoice.createdAt)}</p>
                                        <p><strong>Trạng thái:</strong> {getStatusBadge(selectedInvoice.status)}</p>
                                    </div>
                                    <div className="col-md-6">
                                        <h6 className="fw-bold mb-3">Thông tin bệnh nhân</h6>
                                        <p><strong>Tên:</strong> {selectedInvoice.patientName}</p>
                                        <p><strong>SĐT:</strong> {selectedInvoice.phone}</p>
                                        <p><strong>Email:</strong> {selectedInvoice.email || "N/A"}</p>
                                    </div>
                                </div>

                               

                                {/* Additional Info */}
                                {selectedInvoice.note && (
                                    <div className="mt-3">
                                        <h6 className="fw-bold mb-2">Ghi chú khám bệnh</h6>
                                        <div className="p-3 bg-light rounded">
                                            <p className="mb-0">{selectedInvoice.note}</p>
                                        </div>
                                    </div>
                                )}
                            </div>
                            <div className="modal-footer">
                                <button
                                    type="button"
                                    className="btn btn-secondary"
                                    onClick={() => setShowDetailsModal(false)}
                                >
                                    Đóng
                                </button>
                                <button
                                    className="btn btn-warning"
                                    onClick={() => {
                                        setShowDetailsModal(false);
                                        handleSelectInvoice(selectedInvoice.id);
                                    }}
                                    disabled={selectedInvoices.includes(selectedInvoice.id)}
                                >
                                    <i className="fas fa-envelope me-2"></i>
                                    Thêm vào danh sách gửi email
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
} 