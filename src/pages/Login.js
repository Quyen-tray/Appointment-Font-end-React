import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuth } from "../AuthContext";

function Login() {
    const [formData, setFormData] = useState({ username: "", password: "" });
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false); 
    const navigate = useNavigate();
    const { login, user, load } = useAuth();

    useEffect(() => {
        if (user && !load) {
            switch (user.roles) {
                case 'ROLE_ADMIN':
                    navigate('/admin');
                    break;
                case 'ROLE_RECEPTIONIST':
                    navigate('/receptionist');
                    break;
                case 'ROLE_DOCTOR':
                    navigate('/doctor');
                    break;
                case 'ROLE_PATIENT':
                    navigate('/patient');
                    break;
                default:
                    navigate('/');
            }
        }
    }, [user, load, navigate]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true); 

        const result = await login(formData.username, formData.password);

        if (!result.success) {
            setMessage(result.message);
        }
        setLoading(false); 
    };

    return (
        <motion.div
            className="container d-flex align-items-center justify-content-center min-vh-100"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
        >
            <div className="card shadow p-4 position-relative" style={{maxWidth: "400px", width: "100%"}}>
                <h3 className="text-center mb-4">Login</h3>

                {/*  Spinner overlay */}
                {loading && (
                    <div
                        className="position-absolute top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center bg-white bg-opacity-75"
                        style={{zIndex: 10}}>
                        <div className="spinner-border text-primary" role="status">
                            <span className="visually-hidden">Loading...</span>
                        </div>
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                        <label className="form-label">Tên Tài Khoản</label>
                        <input
                            type="text"
                            name="username"
                            className="form-control"
                            value={formData.username}
                            onChange={handleChange}
                            required
                            disabled={loading}
                        />
                    </div>
                    <div className="mb-3">
                        <label className="form-label">Mật Khẩu</label>
                        <input
                            type="password"
                            name="password"
                            className="form-control"
                            value={formData.password}
                            onChange={handleChange}
                            required
                            disabled={loading}
                        />
                    </div>
                    <button type="submit" className="btn btn-primary w-100" disabled={loading}>
                        {loading ? "Đang đăng nhập..." : "Đăng Nhập"}
                    </button>
                </form>

                <div className="text-center mt-3">
                    <Link to="/forgotPasswordPage">Quên mật khẩu?</Link>
                </div>

                <div className="text-center mt-3">
                    Bạn chưa có tài khoản ? <Link to="/register">Đăng Ký</Link>
                </div>

                {message && <div className="mt-3 alert alert-info">{message}</div>}
            </div>
        </motion.div>
    );
}

export default Login;
