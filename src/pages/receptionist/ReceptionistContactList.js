import React, { useEffect, useState } from "react";
import axios from "axios";
import ReplyToContactModal from "./Component/ReplyToContactModal";
import ReplyHistoryModal from "./Component/ReplyHistoryModal";

function ReceptionistContactList() {
    const [contacts, setContacts] = useState([]);
    const [selectedContact, setSelectedContact] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [filter, setFilter] = useState("all");
    const [searchTerm, setSearchTerm] = useState("");
    const [showHistoryModal, setShowHistoryModal] = useState(false);
    const [replyHistory, setReplyHistory] = useState([]);
    const [sortOrder, setSortOrder] = useState("desc");

    // Phân trang
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 8;

    useEffect(() => {
        axios.get("http://localhost:8081/api/patient/contact/all")
            .then((res) => setContacts(res.data))
            .catch((err) => console.error(err));
    }, []);

    useEffect(() => {
        setCurrentPage(1); // Reset về trang 1 khi filter hoặc tìm kiếm thay đổi
    }, [filter, searchTerm]);

    const handleReply = (contact) => {
        setSelectedContact(contact);
        setShowModal(true);
    };

    const handleViewHistory = (contact) => {
        const token = localStorage.getItem("token");
        axios.get(`http://localhost:8081/api/patient/contact/reply-history/${contact.id}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
            .then(res => {
                setReplyHistory(res.data);
                setShowHistoryModal(true);
            })
            .catch(() => alert("Không thể tải lịch sử phản hồi."));
    };

    const handleSendEmail = (contactId, subject, replyMessage) => {
        axios.post("http://localhost:8081/api/patient/contact/reply", {
            contactId,
            subject,
            replyMessage
        })
            .then(() => {
                alert("Phản hồi đã được gửi qua email!");
                setContacts(prev =>
                    prev.map(c =>
                        c.id === contactId ? { ...c, replied: true } : c
                    )
                );
                setShowModal(false);
            })
            .catch(() => alert("Lỗi khi gửi phản hồi"));
    };

    const filteredContacts = contacts
        .filter(c => {
            if (filter === "unreplied") return !c.replied;
            if (filter === "replied") return c.replied;
            return true;
        })
        .filter(c => {
            const keyword = searchTerm.toLowerCase();
            return (
                c.name.toLowerCase().includes(keyword) ||
                c.email.toLowerCase().includes(keyword)
            );
        })
        .sort((a, b) => {
            const dateA = new Date(a.createdAt);
            const dateB = new Date(b.createdAt);
            return sortOrder === "asc" ? dateA - dateB : dateB - dateA;
        });

    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const paginatedContacts = filteredContacts.slice(startIndex, endIndex);
    const totalPages = Math.ceil(filteredContacts.length / itemsPerPage);

    return (
        <div className="container mt-4">
            <h3 className="mb-4 fw-bold text-primary">📨 Danh sách liên hệ từ bệnh nhân</h3>

            <div className="card shadow-sm mb-4 p-3">
                <div className="row g-3 align-items-center">
                    <div className="col-md-auto">
                        <select
                            className="form-select border-primary text-primary fw-bold"
                            onChange={(e) => setFilter(e.target.value)}
                            value={filter}
                        >
                            <option value="all">Tất cả</option>
                            <option value="unreplied">Chưa phản hồi</option>
                            <option value="replied">Đã phản hồi</option>
                        </select>
                    </div>

                    <div className="col">
                        <input
                            type="text"
                            className="form-control"
                            placeholder="🔍 Tìm theo tên hoặc email..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>

                    <div className="col-md-auto">
                        <select
                            className="form-select border-secondary text-secondary fw-bold"
                            value={sortOrder}
                            onChange={(e) => setSortOrder(e.target.value)}
                        >
                            <option value="desc">📅 Mới nhất</option>
                            <option value="asc">📅 Cũ nhất</option>
                        </select>
                    </div>
                </div>
            </div>

            <div className="table-responsive shadow-sm rounded">
                <table className="table table-hover align-middle table-bordered">
                    <thead className="table-primary text-center">
                    <tr>
                        <th>Tên</th>
                        <th>Email</th>
                        <th>Chủ đề</th>
                        <th>Nội dung</th>
                        <th>Ngày liên hệ</th>
                        <th>Trạng thái</th>
                        <th>Hành động</th>
                    </tr>
                    </thead>
                    <tbody>
                    {paginatedContacts.map((c) => (
                        <tr key={c.id}>
                            <td>{c.name}</td>
                            <td>{c.email}</td>
                            <td>{c.subject}</td>
                            <td style={{ maxWidth: 200, whiteSpace: "pre-wrap" }}>{c.message}</td>
                            <td>{new Date(c.createdAt).toLocaleString()}</td>
                            <td className="text-center">
                                {c.replied ? (
                                    <span className="badge bg-success">Đã phản hồi</span>
                                ) : (
                                    <span className="badge bg-secondary">Chưa phản hồi</span>
                                )}
                            </td>
                            <td className="text-center">
                                <button
                                    className={`btn btn-sm me-2 ${c.replied ? "btn-warning" : "btn-primary"}`}
                                    onClick={() => handleReply(c)}
                                >
                                    {c.replied ? "Phản hồi lại" : "Phản hồi"}
                                </button>
                                <button
                                    className="btn btn-sm btn-outline-info"
                                    onClick={() => handleViewHistory(c)}
                                >
                                    Xem lịch sử
                                </button>
                            </td>
                        </tr>
                    ))}
                    {filteredContacts.length === 0 && (
                        <tr>
                            <td colSpan="7" className="text-center text-muted">Không có liên hệ phù hợp.</td>
                        </tr>
                    )}
                    </tbody>
                </table>
            </div>

            {totalPages > 1 && (
                <nav className="d-flex justify-content-center mt-3">
                    <ul className="pagination">
                        <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
                            <button className="page-link" onClick={() => setCurrentPage(currentPage - 1)}>
                                &laquo;
                            </button>
                        </li>

                        {Array.from({ length: totalPages }, (_, i) => (
                            <li key={i} className={`page-item ${currentPage === i + 1 ? "active" : ""}`}>
                                <button className="page-link" onClick={() => setCurrentPage(i + 1)}>
                                    {i + 1}
                                </button>
                            </li>
                        ))}

                        <li className={`page-item ${currentPage === totalPages ? "disabled" : ""}`}>
                            <button className="page-link" onClick={() => setCurrentPage(currentPage + 1)}>
                                &raquo;
                            </button>
                        </li>
                    </ul>
                </nav>
            )}

            {selectedContact && (
                <ReplyToContactModal
                    show={showModal}
                    onClose={() => setShowModal(false)}
                    contact={selectedContact}
                    onSend={handleSendEmail}
                />
            )}

            {showHistoryModal && (
                <ReplyHistoryModal
                    show={showHistoryModal}
                    onClose={() => setShowHistoryModal(false)}
                    replies={replyHistory}
                />
            )}
        </div>
    );
}

export default ReceptionistContactList;
