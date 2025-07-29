import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { PatientPaymentApi } from "../../service/PatientPaymentApi";
import "../../assets/css/patient-payment.css";
import { useAuth } from "../../AuthContext";

export default function UnpaidInvoices() {
    const [invoices, setInvoices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [paying, setPaying] = useState(null); // Track which invoice is being processed
    const [error, setError] = useState("");
    const [selectedInvoice, setSelectedInvoice] = useState(null);
    const [showDetailsModal, setShowDetailsModal] = useState(false);
    const { patientId } = useAuth();
    useEffect(() => {
        fetchUnpaidInvoices();
    }, []);

    const fetchUnpaidInvoices = async () => {
        try {
            setLoading(true);
            const data = await PatientPaymentApi.getUnpaidInvoices(patientId);
            setInvoices(data);
        } catch (err) {
            setError("Không thể tải danh sách hóa đơn. Vui lòng thử lại sau.");
            console.error("Error fetching unpaid invoices:", err);
        } finally {
            setLoading(false);
        }
    };

    const handleViewDetails = async (invoice) => {
        try {
            const details = await PatientPaymentApi.getInvoiceDetails(invoice.id);
            setSelectedInvoice(details);
            setShowDetailsModal(true);
        } catch (err) {
            alert("Không thể tải chi tiết hóa đơn!");
            console.error("Error fetching invoice details:", err);
        }
    };

    const handlePayment = async (invoice) => {
        if (!window.confirm(`Xác nhận thanh toán hóa đơn ${invoice.id} với số tiền ${invoice.amount.toLocaleString()} VNĐ?`)) {
            return;
        }

        try {
            setPaying(invoice.id);
            const paymentData = await PatientPaymentApi.createVNPayPayment(invoice.id);

            // Redirect to VNPay payment URL
            if (paymentData.url) {
                window.location.href = paymentData.url;
            } else {
                alert("Không thể tạo liên kết thanh toán. Vui lòng thử lại!");
            }
        } catch (err) {
            alert("Có lỗi xảy ra khi tạo thanh toán. Vui lòng thử lại!");
            console.error("Error creating payment:", err);
        } finally {
            setPaying(null);
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
                            Hóa đơn chưa thanh toán
                        </h2>
                        <p className="text-muted mb-0">
                            Quản lý và thanh toán các hóa đơn y tế của bạn
                        </p>
                    </div>
                    <button
                        className="btn btn-outline-primary"
                        onClick={fetchUnpaidInvoices}
                        disabled={loading}
                    >
                        <i className="fas fa-sync-alt me-2"></i>
                        Làm mới
                    </button>
                </div>

                {error && (
                    <div className="alert alert-danger" role="alert">
                        <i className="fas fa-exclamation-triangle me-2"></i>
                        {error}
                    </div>
                )}

                {/* Invoices List */}
                {invoices.length === 0 ? (
                    <div className="text-center py-5 empty-state">
                        <i className="fas fa-check-circle fa-3x text-success mb-3"></i>
                        <h5 className="text-muted">Tuyệt vời! Bạn không có hóa đơn nào chưa thanh toán</h5>
                        <p className="text-muted">Tất cả các hóa đơn của bạn đã được thanh toán</p>
                    </div>
                ) : (
                    <div className="row">
                        {invoices.map((invoice) => (
                            <div key={invoice.id} className="col-md-6 col-lg-4 mb-4">
                                <motion.div
                                    className="card h-100 invoice-card"
                                    whileHover={{ scale: 1.02 }}
                                    transition={{ duration: 0.2 }}
                                >
                                    <div className="card-header bg-light d-flex justify-content-between align-items-center">
                                        <div>
                                            <h6 className="mb-0 fw-bold">
                                                <i className="fas fa-file-medical me-2"></i>
                                                {invoice.invoiceNumber}
                                            </h6>
                                            <small className="text-muted">
                                                {formatDate(invoice.issueDate)}
                                            </small>
                                        </div>
                                        {getStatusBadge(invoice.status)}
                                    </div>

                                    <div className="card-body">
                                        <div className="mb-3">
                                            <div className="d-flex justify-content-between mb-2">
                                                <span className="text-muted">Bác sĩ khám:</span>
                                                <span className="fw-bold">{invoice.doctorName}</span>
                                            </div>
                                            <div className="d-flex justify-content-between mb-2">
                                                <span className="text-muted">Ngày khám:</span>
                                                <span>{formatDate(invoice.visitDate)}</span>
                                            </div>
                                            <div className="d-flex justify-content-between mb-2">
                                                <span className="text-muted">Số dịch vụ:</span>
                                                <span className="badge bg-info">{invoice.serviceCount} dịch vụ</span>
                                            </div>
                                        </div>

                                        <div className="total-section p-3 bg-warning bg-opacity-10 rounded mb-3">
                                            <div className="d-flex justify-content-between align-items-center">
                                                <span className="fw-bold">Tổng tiền:</span>
                                                <span className="fs-5 fw-bold text-danger">
                                                    {invoice.amount.toLocaleString()} VNĐ
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="card-footer bg-transparent">
                                        <div className="d-grid gap-2">
                                            <button
                                                className="btn btn-outline-info btn-sm"
                                                onClick={() => handleViewDetails(invoice)}
                                            >
                                                <i className="fas fa-eye me-2"></i>
                                                Xem chi tiết
                                            </button>
                                            <button
                                                className="btn btn-primary vnpay-button payment-button"
                                                onClick={() => handlePayment(invoice)}
                                                disabled={paying === invoice.id || invoice.status !== 'UNPAID'}
                                            >
                                                {paying === invoice.id ? (
                                                    <>
                                                        <div className="spinner-border spinner-border-sm me-2" role="status"></div>
                                                        Đang xử lý...
                                                    </>
                                                ) : (
                                                    <>
                                                        <i className="fas fa-credit-card me-2"></i>
                                                        Thanh toán VNPay
                                                    </>
                                                )}
                                            </button>
                                        </div>
                                    </div>
                                </motion.div>
                            </div>
                        ))}
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
                                        <p><strong>Số hóa đơn:</strong> {selectedInvoice.invoiceNumber}</p>
                                        <p><strong>Ngày tạo:</strong> {formatDate(selectedInvoice.issueDate)}</p>
                                        <p><strong>Trạng thái:</strong> {getStatusBadge(selectedInvoice.status)}</p>
                                    </div>
                                    <div className="col-md-6">
                                        <h6 className="fw-bold mb-3">Thông tin khám bệnh</h6>
                                        <p><strong>Bác sĩ:</strong> {selectedInvoice.doctorName}</p>
                                        <p><strong>Ngày khám:</strong> {formatDate(selectedInvoice.visitDate)}</p>
                                        <p><strong>Ghi chú:</strong> {selectedInvoice.visitNote || "Không có"}</p>
                                    </div>
                                </div>

                                {/* Service Details */}
                                <h6 className="fw-bold mb-3">Chi tiết dịch vụ</h6>
                                <div className="table-responsive">
                                    <table className="table table-sm table-striped invoice-details-table">
                                        <thead>
                                            <tr>
                                                <th>#</th>
                                                <th>Dịch vụ</th>
                                                <th>Ghi chú</th>
                                                <th>Trạng thái</th>
                                                <th className="text-end">Giá tiền</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {selectedInvoice.services?.map((service, index) => (
                                                <tr key={service.id}>
                                                    <td>{index + 1}</td>
                                                    <td className="fw-bold">{service.testType}</td>
                                                    <td>{service.result || <em className="text-muted">--</em>}</td>
                                                    <td>
                                                        <span className="badge bg-info">{service.status}</span>
                                                    </td>
                                                    <td className="text-end fw-bold">
                                                        {service.price.toLocaleString()} VNĐ
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                        <tfoot>
                                            <tr className="table-warning">
                                                <td colSpan="4" className="fw-bold text-end">Tổng cộng:</td>
                                                <td className="text-end fw-bold fs-5 text-danger">
                                                    {selectedInvoice.amount.toLocaleString()} VNĐ
                                                </td>
                                            </tr>
                                        </tfoot>
                                    </table>
                                </div>
                            </div>
                            <div className="modal-footer">
                                <button
                                    type="button"
                                    className="btn btn-secondary"
                                    onClick={() => setShowDetailsModal(false)}
                                >
                                    Đóng
                                </button>
                                {selectedInvoice.status === 'UNPAID' && (
                                    <button
                                        className="btn btn-primary vnpay-button payment-button"
                                        onClick={() => {
                                            setShowDetailsModal(false);
                                            handlePayment(selectedInvoice);
                                        }}
                                        disabled={paying === selectedInvoice.id}
                                    >
                                        <i className="fas fa-credit-card me-2"></i>
                                        Thanh toán ngay
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
} 