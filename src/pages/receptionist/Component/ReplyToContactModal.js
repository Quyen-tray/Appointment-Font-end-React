import React, { useState } from "react";
import { Modal, Button, Form } from "react-bootstrap";

function ReplyToContactModal({ show, onClose, contact, onSend }) {
    const [subject, setSubject] = useState("");
    const [message, setMessage] = useState("");

    const handleSubmit = () => {
        if (!subject || !message) {
            alert("Vui lòng nhập đầy đủ chủ đề và nội dung.");
            return;
        }

        // Gọi hàm gửi từ props
        onSend(contact.id, subject, message, () => {
            onClose(); // chỉ đóng khi gửi thành công
        });
    };

    return (
        <Modal show={show} onHide={onClose}>
            <Modal.Header closeButton>
                <Modal.Title>Phản hồi liên hệ</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <p><strong>Đến:</strong> {contact.email}</p>
                <p><strong>Chủ đề gốc:</strong> {contact.subject}</p>
                <p><strong>Nội dung gốc:</strong> {contact.message}</p>

                <Form.Group className="mt-3">
                    <Form.Label>Chủ đề phản hồi</Form.Label>
                    <Form.Control
                        type="text"
                        value={subject}
                        onChange={(e) => setSubject(e.target.value)}
                    />
                </Form.Group>
                <Form.Group className="mt-3">
                    <Form.Label>Nội dung phản hồi</Form.Label>
                    <Form.Control
                        as="textarea"
                        rows={4}
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                    />
                </Form.Group>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={onClose}>Hủy</Button>
                <Button variant="primary" onClick={handleSubmit}>Gửi</Button>
            </Modal.Footer>
        </Modal>
    );
}

export default ReplyToContactModal;
