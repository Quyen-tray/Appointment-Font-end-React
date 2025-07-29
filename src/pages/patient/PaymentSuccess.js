import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";

export default function PaymentSuccess() {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const [paymentResult, setPaymentResult] = useState(null);

    useEffect(() => {
        // Parse VNPay return parameters
        const vnp_ResponseCode = searchParams.get('vnp_ResponseCode');
        const vnp_TxnRef = searchParams.get('vnp_TxnRef');
        const vnp_Amount = searchParams.get('vnp_Amount');
        const vnp_BankCode = searchParams.get('vnp_BankCode');
        const vnp_PayDate = searchParams.get('vnp_PayDate');

        setPaymentResult({
            success: vnp_ResponseCode === '00',
            transactionRef: vnp_TxnRef,
            amount: vnp_Amount ? parseInt(vnp_Amount) / 100 : 0, // VNPay amount is in cents
            bankCode: vnp_BankCode,
            payDate: vnp_PayDate,
            responseCode: vnp_ResponseCode
        });
    }, [searchParams]);

    const handleBackToPayments = () => {
        navigate('/patient/payments');
    };

    const handleBackToDashboard = () => {
        navigate('/patient');
    };

    const formatPayDate = (payDate) => {
        if (!payDate || payDate.length !== 14) return "N/A";

        // Format: YYYYMMDDHHmmss
        const year = payDate.substring(0, 4);
        const month = payDate.substring(4, 6);
        const day = payDate.substring(6, 8);
        const hour = payDate.substring(8, 10);
        const minute = payDate.substring(10, 12);
        const second = payDate.substring(12, 14);

        return `${day}/${month}/${year} ${hour}:${minute}:${second}`;
    };

    if (!paymentResult) {
        return (
            <div className="d-flex justify-content-center mt-5">
                <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Đang xử lý...</span>
                </div>
            </div>
        );
    }

    return (
        <div className="container mt-5">
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="row justify-content-center"
            >
                <div className="col-md-8 col-lg-6">
                    <div className={`card shadow-lg ${paymentResult.success ? 'border-success' : 'border-danger'}`}>
                        <div className={`card-header text-center ${paymentResult.success ? 'bg-success' : 'bg-danger'} text-white`}>
                            <div className="py-3">
                                <i className={`fas ${paymentResult.success ? 'fa-check-circle' : 'fa-times-circle'} fa-4x mb-3`}></i>
                                <h3 className="mb-0">
                                    {paymentResult.success ? 'Thanh toán thành công!' : 'Thanh toán thất bại!'}
                                </h3>
                            </div>
                        </div>

                        <div className="card-body p-4">
                            {paymentResult.success ? (
                                <div className="text-center mb-4">
                                    <p className="lead text-success">
                                        Cảm ơn bạn đã thanh toán. Hóa đơn của bạn đã được xử lý thành công.
                                    </p>
                                </div>
                            ) : (
                                <div className="text-center mb-4">
                                    <p className="lead text-danger">
                                        Thanh toán không thành công. Vui lòng thử lại hoặc liên hệ bộ phận hỗ trợ.
                                    </p>
                                </div>
                            )}

                            {/* Payment Details */}
                            <div className="payment-details">
                                <h5 className="mb-3">
                                    <i className="fas fa-info-circle me-2"></i>
                                    Thông tin giao dịch
                                </h5>

                                <div className="row mb-2">
                                    <div className="col-sm-5 fw-bold">Mã giao dịch:</div>
                                    <div className="col-sm-7">{paymentResult.transactionRef || "N/A"}</div>
                                </div>

                                <div className="row mb-2">
                                    <div className="col-sm-5 fw-bold">Số tiền:</div>
                                    <div className="col-sm-7 text-danger fw-bold">
                                        {paymentResult.amount.toLocaleString()} VNĐ
                                    </div>
                                </div>

                                <div className="row mb-2">
                                    <div className="col-sm-5 fw-bold">Ngân hàng:</div>
                                    <div className="col-sm-7">{paymentResult.bankCode || "N/A"}</div>
                                </div>

                                <div className="row mb-2">
                                    <div className="col-sm-5 fw-bold">Thời gian:</div>
                                    <div className="col-sm-7">{formatPayDate(paymentResult.payDate)}</div>
                                </div>

                                <div className="row mb-2">
                                    <div className="col-sm-5 fw-bold">Mã phản hồi:</div>
                                    <div className="col-sm-7">
                                        <span className={`badge ${paymentResult.success ? 'bg-success' : 'bg-danger'}`}>
                                            {paymentResult.responseCode}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="card-footer bg-light text-center">
                            <div className="d-grid gap-2 d-md-flex justify-content-md-center">
                                <button
                                    className="btn btn-outline-primary"
                                    onClick={handleBackToPayments}
                                >
                                    <i className="fas fa-arrow-left me-2"></i>
                                    Quay lại thanh toán
                                </button>
                                <button
                                    className="btn btn-primary"
                                    onClick={handleBackToDashboard}
                                >
                                    <i className="fas fa-home me-2"></i>
                                    Về trang chủ
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </motion.div>
        </div>
    );
} 