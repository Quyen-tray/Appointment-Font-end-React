import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

function Register() {
    const [formData, setFormData] = useState({
        username: "",
        email: "",
        password: "",
        confirmPassword: ""
    });
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false); // ✅ loading spinner

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setSuccess("");

        const { username, email, password, confirmPassword } = formData;

        if (!username || !email || !password || !confirmPassword) {
            setError("⚠️ Vui lòng điền vào tất cả các trường.");
            return;
        }

        if (password.length < 6) {
            setError("⚠️ Mật khẩu phải có ít nhất 6 ký tự.");
            return;
        }

        if (password !== confirmPassword) {
            setError(" Mật khẩu không khớp.");
            return;
        }

        const requestBody = { username, email, password };
        setLoading(true); //  Start loading
        try {
            const res = await fetch("http://localhost:8081/api/auth/register", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(requestBody)
            });

            setLoading(false); //  Start loading

            if (!res.ok) {
                const errorData = await res.json();
                setError(errorData.message || " Đăng ký thất bại.");
                return;
            }

            setSuccess(" Đăng Ký Thành Công ! Redirecting to login...");
            setTimeout(() => navigate("/login"), 1000);
        } catch (err) {
            console.error(" Register error:", err);
            setError("Đã có lỗi trong bên máy chủ");
        }
    };

    return (
        <motion.div
            className="container d-flex align-items-center justify-content-center min-vh-100"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
        >
            <div className="card shadow p-4" style={{ maxWidth: "450px", width: "100%" }}>
                <h3 className="text-center mb-4">Register</h3>
                {/* ✅ Spinner overlay */}
                {loading && (
                    <div className="position-absolute top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center bg-white bg-opacity-75" style={{ zIndex: 10 }}>
                        <div className="spinner-border text-primary" role="status">
                            <span className="visually-hidden">Loading...</span>
                        </div>
                    </div>
                )}
                <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                        <label className="form-label">Tên Tài Khoản</label>
                        <input type="text" name="username" className="form-control" value={formData.username} onChange={handleChange} required />
                    </div>
                    <div className="mb-3">
                        <label className="form-label">Email</label>
                        <input type="email" name="email" className="form-control" value={formData.email} onChange={handleChange} required />
                    </div>
                    <div className="mb-3">
                        <label className="form-label">Mật Khẩu</label>
                        <input type="password" name="password" className="form-control" value={formData.password} onChange={handleChange} required />
                    </div>
                    <div className="mb-3">
                        <label className="form-label">Nhập Lại Mật Khẩu</label>
                        <input type="password" name="confirmPassword" className="form-control" value={formData.confirmPassword} onChange={handleChange} required />
                    </div>
                    <button type="submit" className="btn btn-success w-100">Đăng Ký</button>
                </form>

                <div className="text-center mt-3">
                    Đã có tài khoản? <Link to="/login">Đăng Nhập</Link>
                </div>

                {error && <div className="alert alert-danger mt-3">{error}</div>}
                {success && <div className="alert alert-success mt-3">{success}</div>}
            </div>
        </motion.div>
    );
}

export default Register;
