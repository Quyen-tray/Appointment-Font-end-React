import React from "react";
import { Modal, Button } from "react-bootstrap";

function ReplyHistoryModal({ show, onClose, history }) {
    const safeReplies = history || [];

    return (
        <Modal show={show} onHide={onClose}>
            <Modal.Header closeButton>
                <Modal.Title>Lịch sử phản hồi</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {safeReplies.length === 0 ? (
                    <p>Chưa có phản hồi nào.</p>
                ) : (
                    safeReplies.map((r, idx) => (
                        <div key={idx} className="mb-3 border-bottom pb-2">
                            <p><strong>Chủ đề:</strong> {r.subject}</p>
                            <p><strong>Nội dung:</strong> {r.message}</p>
                            <p><small><strong>Ngày phản hồi:</strong> {new Date(r.sentAt).toLocaleString()}</small></p>
                        </div>
                    ))
                )}
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={onClose}>Đóng</Button>
            </Modal.Footer>
        </Modal>
    );
}

export default ReplyHistoryModal;
