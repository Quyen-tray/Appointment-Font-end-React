import React from "react";
import { Modal, Button } from "react-bootstrap";
import { FaEnvelopeOpenText, FaClock } from "react-icons/fa";

function ReplyHistoryModal({ show, onClose, replies  }) {
    const safeReplies = replies  || [];

    return (
        <Modal show={show} onHide={onClose} size="lg" centered>
            <Modal.Header closeButton>
                <Modal.Title className="fw-bold text-primary">
                    📬 Lịch sử phản hồi
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {safeReplies.length === 0 ? (
                    <div className="text-muted text-center">Chưa có phản hồi nào.</div>
                ) : (
                    <div className="timeline">
                        {safeReplies.map((r, idx) => (
                            <div key={idx} className="mb-4 p-3 rounded shadow-sm border border-light bg-light">
                                <h6 className="text-primary mb-2"><FaEnvelopeOpenText className="me-2" />{r.subject}</h6>
                                <p className="mb-2">{r.message}</p>
                                <small className="text-muted"><FaClock className="me-1" />{new Date(r.sentAt).toLocaleString()}</small>
                            </div>
                        ))}
                    </div>
                )}
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={onClose}>Đóng</Button>
            </Modal.Footer>
        </Modal>
    );
}

export default ReplyHistoryModal;
