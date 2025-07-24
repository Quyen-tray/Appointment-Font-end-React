import React, { useState } from "react";

export default function ChangePassword() {
    const [oldPassword, setOldPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage("");
        if (!oldPassword || !newPassword || !confirmPassword) {
            setMessage("Vui lòng nhập đầy đủ thông tin.");
            return;
        }
        if (newPassword !== confirmPassword) {
            setMessage("Mật khẩu mới và xác nhận không khớp.");
            return;
        }
        setLoading(true);
        try {
            const token = localStorage.getItem("token");
            const res = await fetch("http://localhost:8081/api/user/change-pass", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    oldPassword,
                    newPassword,
                }),
            });
            
            if (res.ok) {
                alert("Đổi mật khẩu thành công!");
                setOldPassword("");
                setNewPassword("");
                setConfirmPassword("");
            } else {
                const data = await res.json();
                setMessage(data.message || "Đổi mật khẩu thất bại!");
            }
        } catch (err) {
            setMessage("Có lỗi xảy ra!");
        }
        setLoading(false);
    };

    return (
        <div className="container mt-4" style={{ maxWidth: 400 }}>
            <h3>Đổi mật khẩu</h3>
            <form onSubmit={handleSubmit}>
                <div className="mb-3">
                    <label>Mật khẩu hiện tại</label>
                    <input
                        type="password"
                        className="form-control"
                        value={oldPassword}
                        onChange={e => setOldPassword(e.target.value)}
                        required
                    />
                </div>
                <div className="mb-3">
                    <label>Mật khẩu mới</label>
                    <input
                        type="password"
                        className="form-control"
                        value={newPassword}
                        onChange={e => setNewPassword(e.target.value)}
                        required
                    />
                </div>
                <div className="mb-3">
                    <label>Xác nhận mật khẩu mới</label>
                    <input
                        type="password"
                        className="form-control"
                        value={confirmPassword}
                        onChange={e => setConfirmPassword(e.target.value)}
                        required
                    />
                </div>
                {message && <div className="mb-2 text-danger">{message}</div>}
                <button className="btn btn-primary w-100" type="submit" disabled={loading}>
                    {loading ? "Đang xử lý..." : "Đổi mật khẩu"}
                </button>
            </form>
        </div>
    );
}