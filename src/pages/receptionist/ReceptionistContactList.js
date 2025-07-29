import React, { useEffect, useState } from "react";
import axios from "axios";
import ReplyToContactModal from "./Component/ReplyToContactModal";
import ReplyHistoryModal from "./Component/ReplyHistoryModal";

function ReceptionistContactList() {
    const [contacts, setContacts] = useState([]);
    const [selectedContact, setSelectedContact] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [filter, setFilter] = useState("all");
    const [showHistoryModal, setShowHistoryModal] = useState(false);
    const [replyHistory, setReplyHistory] = useState([]);

    useEffect(() => {
        axios.get("http://localhost:8081/api/patient/contact/all")
            .then((res) => setContacts(res.data))
            .catch((err) => console.error(err));
    }, []);

    const handleReply = (contact) => {
        setSelectedContact(contact);
        setShowModal(true);
    };

    const handleViewHistory = (contact) => {
        console.log("Xem lịch sử cho contact:", contact);
        if (!contact || !contact.id) {
            alert("Lỗi: ID liên hệ không hợp lệ");
            return;
        }

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
            .catch(err => {
                console.error(err);
                alert("Không thể tải lịch sử phản hồi.");
            });
    };

    const handleSendEmail = (contactId, subject, replyMessage) => {
        axios.post("http://localhost:8081/api/patient/contact/reply", {
            contactId,
            subject,
            replyMessage
        })
            .then(() => {
                alert("Phản hồi đã được gửi qua email!");

                setContacts(prevContacts =>
                    prevContacts.map(c =>
                        c.id === contactId ? { ...c, replied: true } : c
                    )
                );

                setShowModal(false);
            })
            .catch((err) => {
                console.error(err);
                alert("Lỗi khi gửi phản hồi");
            });
    };

    const filteredContacts = contacts.filter(c => {
        if (filter === "unreplied") return !c.replied;
        if (filter === "replied") return c.replied;
        return true;
    });

    return (
        <div className="container mt-4">
            <h3>Danh sách liên hệ từ bệnh nhân</h3>
            <select
                className="form-select w-auto border-primary text-primary fw-bold"
                onChange={(e) => setFilter(e.target.value)}
                value={filter}
            >
                <option value="all">Tất cả</option>
                <option value="unreplied">Chưa phản hồi</option>
                <option value="replied">Đã phản hồi</option>
            </select>
            <table className="table table-bordered mt-3">
                <thead>
                <tr>
                    <th>Tên</th>
                    <th>Email</th>
                    <th>Chủ đề</th>
                    <th>Nội dung</th>
                    <th>Trạng thái</th>
                    <th>Hành động</th>
                </tr>
                </thead>
                <tbody>
                {filteredContacts.map((c) => (
                    <tr key={c.id}>
                        <td>{c.name}</td>
                        <td>{c.email}</td>
                        <td>{c.subject}</td>
                        <td>{c.message}</td>
                        <td>
                            {c.replied ? (
                                <span className="badge bg-success">Đã phản hồi</span>
                            ) : (
                                <span className="badge bg-secondary">Chưa phản hồi</span>
                            )}
                        </td>
                        <td>
                            <button
                                className={`btn btn-sm me-2 ${c.replied ? "btn-warning" : "btn-primary"}`}
                                onClick={() => handleReply(c)}
                            >
                                {c.replied ? "Phản hồi lại" : "Phản hồi"}
                            </button>
                            <button
                                className="btn btn-sm btn-info"
                                onClick={() => handleViewHistory(c)}
                            >
                                Xem lịch sử
                            </button>
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>

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
                    history={replyHistory}
                />
            )}
        </div>
    );
}

export default ReceptionistContactList;
