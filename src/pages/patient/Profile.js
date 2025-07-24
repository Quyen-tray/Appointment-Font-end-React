import React, { useState, useEffect } from "react";
import axios from "axios";
import "./profile.css";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useNavigate } from "react-router-dom";

const PatientProfile = () => {
    const [profile, setProfile] = useState({
        name: "",
        dob: "",
        gender: "",
        phone: "",
        email: "",
        address: "",
        avatar: "",
    });

    const [isEditing, setIsEditing] = useState(false);
    const [loading, setLoading] = useState(false);
    const [successMessage, setSuccessMessage] = useState("");
    const token = localStorage.getItem("token");
    const [nameError, setNameError] = useState("");
    const navigate = useNavigate();
    const [phoneError, setPhoneError] = useState("");
    const [originalProfile, setOriginalProfile] = useState(null);
    const [emailError, setEmailError] = useState("");
    const [addressError, setAddressError] = useState("");





    useEffect(() => {
        axios
            .get("http://localhost:8081/api/patient/profile", {
                headers: { Authorization: `Bearer ${token}` },
            })
            .then((res) => { setProfile(res.data); setOriginalProfile(res.data); })
            .catch(() => {
                alert("Không thể tải thông tin hồ sơ. Vui lòng đăng nhập lại.");
            });
    }, [token]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name === "name") {
            const nameRegex = /^[a-zA-ZÀ-Ỹà-ỹ\s]*$/u;
            if (!nameRegex.test(value)) {
                setNameError("Họ tên không được chứa số hoặc ký tự đặc biệt");
            } else {
                setNameError("");
            }
        }

        if (name === "phone") {
            const phoneRegex = /^0\d{9}$/;
            if (!phoneRegex.test(value)) {
                setPhoneError("Số điện thoại phải có 10 chữ số và bắt đầu bằng số 0");
            } else {
                setPhoneError("");
            }
        }

        if (name === "email") {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(value)) {
                setEmailError("Email không hợp lệ");
            } else {
                setEmailError("");
            }
        }

        if (name === "address") {
            const addressRegex = /^[a-zA-ZÀ-ỹ0-9\s,.-]*$/u;
            if (!addressRegex.test(value)) {
                setAddressError("Địa chỉ không được chứa ký hiệu đặc biệt!");
            } else {
                setAddressError("");
            }
        }


        setProfile((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const nameRegex = /^[a-zA-ZÀ-Ỹà-ỹ\s]+$/u;
        if (!nameRegex.test(profile.name)) {
            alert("Họ tên không được chứa số hoặc ký tự đặc biệt!");
            return;
        }

        const phoneRegex = /^0\d{9}$/;
        if (!phoneRegex.test(profile.phone)) {
            alert("Số điện thoại phải có 10 chữ số và bắt đầu bằng số 0!");
            return;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(profile.email)) {
            alert("Email không hợp lệ!");
            return;
        }


        setLoading(true);
        axios
            .put("http://localhost:8081/api/patient/update-profile", profile, {
                headers: { Authorization: `Bearer ${token}` },
            })
            .then(() => {
                setSuccessMessage("Cập nhật thành công!");
                setIsEditing(false);
            })
            .catch(() => alert("Lỗi khi cập nhật hồ sơ!"))
            .finally(() => setLoading(false));
    };

    const handleImageChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const formData = new FormData();
        formData.append("file", file);
        formData.append("upload_preset", "avatar_upload");

        try {
            const response = await fetch("https://api.cloudinary.com/v1_1/dpk1bgfbz/image/upload", {
                method: "POST",
                body: formData,
            });

            const data = await response.json();

            if (response.ok) {
                setProfile((prev) => ({ ...prev, avatar: data.secure_url }));
            } else {
                alert("Lỗi khi tải ảnh lên Cloudinary!");
            }
        } catch (err) {
            alert("Lỗi khi tải ảnh lên Cloudinary!");
        }
    };

    const handleChangePassword = () => {
        navigate("/patient/change-password");
    };

    return (
        <div className="profile-container">
            <h1>Hồ sơ cá nhân</h1>
            <div className="profile-content">
                <div className="profile-avatar">
                    <div className="avatar-wrapper">
                        {profile.avatar ? (
                            <img src={profile.avatar} alt="avatar" />
                        ) : (
                            <div className="avatar-placeholder">No Avatar</div>
                        )}
                        {isEditing && (
                            <div className="avatar-overlay">
                                <label htmlFor="avatar-upload" className="change-avatar-btn">
                                    Đổi ảnh
                                </label>
                                <input
                                    id="avatar-upload"
                                    type="file"
                                    accept="image/*"
                                    onChange={handleImageChange}
                                    style={{ display: "none" }}
                                />
                            </div>
                        )}
                    </div>
                    <button className="change-password-btn" onClick={handleChangePassword}>
                        Đổi mật khẩu
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="profile-form">
                    <div className="form-group">
                        <label>Họ tên</label>
                        {isEditing ? (
                            <>
                                <input
                                    name="name"
                                    value={profile.name}
                                    onChange={handleChange}
                                    required
                                    className={nameError ? "invalid" : ""}
                                    placeholder="Nhập họ tên"
                                />
                                {nameError && <p className="error-message">{nameError}</p>}
                            </>
                        ) : (
                            <p>{profile.name || "(Chưa có)"}</p>
                        )}
                    </div>

                    <div className="form-group">
                        <label>Ngày sinh</label>
                        {isEditing ? (
                            <DatePicker
                                selected={profile.dob ? new Date(profile.dob) : null}
                                onChange={(date) =>
                                    setProfile((prev) => ({
                                        ...prev,
                                        dob: date.toISOString().split("T")[0],
                                    }))
                                }
                                dateFormat="yyyy-MM-dd"
                                showMonthDropdown
                                showYearDropdown
                                dropdownMode="select"
                                placeholderText="Chọn ngày sinh"
                                maxDate={new Date()}
                                className="input-style"
                            />
                        ) : (
                            <p>{profile.dob || "(Chưa có)"}</p>
                        )}
                    </div>

                    <div className="form-group">
                        <label>Giới tính</label>
                        {isEditing ? (
                            <div style={{ display: "flex", gap: "20px", marginTop: "8px" }}>
                                {["Nam", "Nữ", "Khác"].map((g) => (
                                    <label key={g}>
                                        <input
                                            type="radio"
                                            name="gender"
                                            value={g}
                                            checked={profile.gender === g}
                                            onChange={handleChange}
                                            required
                                        />
                                        <span style={{ marginLeft: "8px" }}>{g}</span>
                                    </label>
                                ))}
                            </div>
                        ) : (
                            <p>{profile.gender || "(Chưa có)"}</p>
                        )}
                    </div>

                    <div className="form-group">
                        <label>Số điện thoại</label>
                        {isEditing ? (
                            <>
                                <input
                                    name="phone"
                                    value={profile.phone}
                                    onChange={handleChange}
                                    required
                                    className={phoneError ? "invalid" : ""}
                                    placeholder="Nhập số điện thoại"
                                />
                                {phoneError && <p className="error-message">{phoneError}</p>}
                            </>
                        ) : (
                            <p>{profile.phone || "(Chưa có)"}</p>
                        )}
                    </div>

                    <div className="form-group">
                        <label>Email</label>
                        {isEditing ? (
                            <>
                                <input
                                    name="email"
                                    value={profile.email}
                                    onChange={handleChange}
                                    required
                                    className={emailError ? "invalid" : ""}
                                    placeholder="Nhập email"
                                />
                                {emailError && <p className="error-message">{emailError}</p>}
                            </>
                        ) : (
                            <p>{profile.email || "(Chưa có)"}</p>
                        )}
                    </div>


                    <div className="form-group">
                        <label>Địa chỉ</label>
                        {isEditing ? (
                            <>
                                <textarea
                                    name="address"
                                    value={profile.address}
                                    onChange={handleChange}
                                    rows={3}
                                    placeholder="Nhập địa chỉ..."
                                    required
                                    className={addressError ? "invalid" : ""}
                                />
                                {addressError && <p className="error-message">{addressError}</p>}
                            </>
                        ) : (
                            <p>{profile.address || "(Chưa có)"}</p>
                        )}

                    </div>

                    {isEditing ? (
                        <div style={{ display: "flex", gap: "10px" }}>
                            <button type="submit" disabled={loading}>
                                {loading ? "Đang cập nhật..." : "Lưu thay đổi"}
                            </button>
                            <button
                                type="button"
                                onClick={() => {
                                    if (originalProfile) {
                                        setProfile(originalProfile);
                                    }
                                    setIsEditing(false);
                                    setNameError("");
                                    setPhoneError("");
                                }}
                            >
                                Hủy
                            </button>
                        </div>
                    ) : (
                        <button type="button" onClick={() => setIsEditing(true)}>
                            Chỉnh sửa
                        </button>
                    )}

                    {successMessage && <p className="success">{successMessage}</p>}
                </form>
            </div>
        </div>
    );
};

export default PatientProfile;
