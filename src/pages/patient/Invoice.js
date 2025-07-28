import React, { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../../AuthContext";

function Invoice() {
    const { token, user } = useAuth();
    const [invoices, setInvoices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [fromDate, setFromDate] = useState("");
    const [toDate, setToDate] = useState("");
    // State mới để toggle sort
    const [sortNewestFirst, setSortNewestFirst] = useState(true);

    const fetchInvoices = async () => {
        if (!user || !user.id) return;
        setLoading(true);
        try {
            const patientRes = await axios.get(
                `http://localhost:8081/api/patient/by-user/${user.id}`,
                { headers: { Authorization: `Bearer ${token}` } }
            );
            const patientId = patientRes.data.id;
            const res = await axios.get(
                `http://localhost:8081/api/patient/invoices/${patientId}`,
                { headers: { Authorization: `Bearer ${token}` } }
            );

            let data = res.data;
            if (fromDate)
                data = data.filter(
                    (inv) => new Date(inv.issuedDate) >= new Date(fromDate)
                );
            if (toDate)
                data = data.filter(
                    (inv) => new Date(inv.issuedDate) <= new Date(toDate)
                );
            // ban đầu sort theo mới nhất
            data.sort((a, b) => new Date(b.issuedDate) - new Date(a.issuedDate));
            setInvoices(data);
        } catch (err) {
            console.error("❌ Lỗi khi lấy dữ liệu:", err);
            setError("Không thể tải hóa đơn.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchInvoices();
    }, [fromDate, toDate]);

    const formatCurrency = (amount) =>
        amount.toLocaleString("vi-VN", { style: "currency", currency: "VND" });

    const handlePayment = async (invoiceId) => {
        if (!window.confirm("Bạn có chắc muốn thanh toán hóa đơn này?")) return;
        try {
            await axios.put(
                `http://localhost:8081/api/patient/pay/${invoiceId}`,
                null,
                { headers: { Authorization: `Bearer ${token}` } }
            );
            fetchInvoices();
        } catch (err) {
            alert("Thanh toán thất bại. Vui lòng thử lại!");
        }
    };

    const totalPaid = invoices
        .filter((inv) => inv.status?.toUpperCase() !== "PENDING")
        .reduce((sum, inv) => sum + inv.amount, 0);

    return (
        <div className="container py-5">
            <h2 className="text-center mb-4 fw-bold text-primary">
                🧾 Danh Sách Hóa Đơn
            </h2>

            <div className="row mb-4">
                <div className="col-md-3">
                    <label className="form-label">Từ ngày:</label>
                    <input
                        type="date"
                        className="form-control"
                        value={fromDate}
                        onChange={(e) => setFromDate(e.target.value)}
                    />
                </div>
                <div className="col-md-3">
                    <label className="form-label">Đến ngày:</label>
                    <input
                        type="date"
                        className="form-control"
                        value={toDate}
                        onChange={(e) => setToDate(e.target.value)}
                    />
                </div>
                <div className="col-md-3 d-flex align-items-end">
                    <button
                        className="btn btn-outline-primary w-100"
                        onClick={fetchInvoices}
                        disabled={loading}
                    >
                        {loading ? "Đang lọc..." : "Lọc hóa đơn"}
                    </button>
                </div>
                <div className="col-md-3 d-flex align-items-end">
                    {/* Nút toggle sort */}
                    <button
                        className="btn btn-outline-secondary w-100"
                        onClick={() => setSortNewestFirst((p) => !p)}
                    >
                        {sortNewestFirst ? "Mới → Cũ" : "Cũ → Mới"}
                    </button>
                </div>
            </div>

            {loading ? (
                <div className="text-center text-muted">Đang tải...</div>
            ) : error ? (
                <div className="text-danger text-center">{error}</div>
            ) : invoices.length === 0 ? (
                <div className="text-center">Không có hóa đơn nào.</div>
            ) : (
                <>
                    <div className="table-responsive shadow rounded-4 overflow-hidden">
                        <table className="table table-bordered table-hover mb-0">
                            <thead className="table-light text-center">
                            <tr className="align-middle">
                                <th>Ngày</th>
                                <th>Bác sĩ</th>
                                <th>Dịch vụ</th>
                                <th>Chi phí</th>
                                <th>Trạng thái</th>
                            </tr>
                            </thead>
                            <tbody>
                            {[
                                // apply sort client-side theo toggle
                                ...invoices
                            ]
                                .sort((a, b) => {
                                    const da = new Date(a.issuedDate);
                                    const db = new Date(b.issuedDate);
                                    return sortNewestFirst ? db - da : da - db;
                                })
                                .map((inv) => (
                                    <tr key={inv.id} className="align-middle">
                                        <td>
                                            {new Date(inv.issuedDate).toLocaleString("vi-VN")}
                                        </td>
                                        <td>{inv.doctorName || "--"}</td>
                                        <td>{inv.serviceName || "--"}</td>
                                        <td className="text-end text-primary fw-semibold">
                                            {formatCurrency(inv.amount)}
                                        </td>
                                        <td className="text-center">
                                            {inv.status?.toUpperCase() === "PENDING" ? (
                                                <>
                            <span className="badge bg-warning text-dark me-2">
                              Chưa thanh toán
                            </span>
                                                    <button
                                                        className="btn btn-sm btn-outline-success"
                                                        onClick={() => handlePayment(inv.id)}
                                                    >
                                                        Thanh toán
                                                    </button>
                                                </>
                                            ) : (
                                                <span className="badge bg-success">
                            Đã thanh toán
                          </span>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    <div className="text-end fw-bold mt-3 text-success">
                        Tổng tiền đã thanh toán: {formatCurrency(totalPaid)}
                    </div>
                </>
            )}
        </div>
    );
}

export default Invoice;
