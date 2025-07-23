import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./ChangePassword.css";

const ChangePassword = () => {
  const [formData, setFormData] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
    newPasswordVisible: false,
    confirmPasswordVisible: false,
  });

  const [message, setMessage] = useState({ type: "", text: "" });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const toggleVisibility = (field) => {
    setFormData((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage({ type: "", text: "" });
    
    if (formData.newPassword !== formData.confirmPassword) {
      setMessage({ type: "error", text: "Mật khẩu xác nhận không khớp." });
      return;
    }

    setLoading(true);
    try {
      const res = await axios.post(
        "http://localhost:8081/api/patient/change-password",
        {
          oldPassword: formData.oldPassword,
          newPassword: formData.newPassword,
          confirmPassword: formData.confirmPassword,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const successMsg =
        typeof res.data === "string" ? res.data : "Đổi mật khẩu thành công.";
      setMessage({ type: "success", text: successMsg });

      setTimeout(() => {
        navigate("/patient");
      }, 1500);
    } catch (err) {
        console.log("Lỗi từ server:", err.response?.data);
      const errorMsg =
        err.response?.data?.message ||
        err.response?.data?.errors?.[0]?.defaultMessage ||
        (typeof err.response?.data === "string"
          ? err.response.data
          : "Đã xảy ra lỗi khi đổi mật khẩu.");
      setMessage({ type: "error", text: errorMsg });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="change-password-container">
      <h2>Đổi mật khẩu</h2>
      <form onSubmit={handleSubmit} className="change-password-form">
        <div className="form-group">
          <label>Mật khẩu hiện tại</label>
          <input
            type="password"
            name="oldPassword"
            value={formData.oldPassword}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Mật khẩu mới</label>
          <div className="password-input-wrapper">
            <input
              type={formData.newPasswordVisible ? "text" : "password"}
              name="newPassword"
              value={formData.newPassword}
              onChange={handleChange}
              required
            />
            <span
              className="toggle-password"
              onClick={() => toggleVisibility("newPasswordVisible")}
            >
              {formData.newPasswordVisible ? "Ẩn" : "Hiện"}
            </span>
          </div>
        </div>

        <div className="form-group">
          <label>Xác nhận mật khẩu mới</label>
          <div className="password-input-wrapper">
            <input
              type={formData.confirmPasswordVisible ? "text" : "password"}
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
            />
            <span
              className="toggle-password"
              onClick={() => toggleVisibility("confirmPasswordVisible")}
            >
              {formData.confirmPasswordVisible ? "Ẩn" : "Hiện"}
            </span>
          </div>
        </div>

        <button type="submit" disabled={loading}>
          {loading ? "Đang xử lý..." : "Xác nhận"}
        </button>

        {message.text && (
          <p className={message.type === "error" ? "error" : "success"}>
            {message.text}
          </p>
        )}
      </form>
    </div>
  );
};

export default ChangePassword;
