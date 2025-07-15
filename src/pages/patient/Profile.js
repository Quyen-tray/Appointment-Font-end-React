import React, { useState, useEffect } from "react";
import axios from "axios";
import "./profile.css";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from "../../firebase/firebaseConfig";

import { v4 as uuidv4 } from "uuid";
const PatientProfile = () => {
    const [profile, setProfile] = useState({
        fullName: "",
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

    useEffect(() => {
        axios
            .get("http://localhost:8081/api/patient/profile", {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            })
            .then((res) => {
                console.log("DATA:", res.data);
                setProfile(res.data);
            })
            .catch((err) => {
                console.error("Lỗi khi gọi API:", err);
                alert("Không thể tải thông tin hồ sơ. Vui lòng đăng nhập lại.");
            });
    }, [token]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setProfile((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setLoading(true);
        axios
            .put("http://localhost:8081/api/patient/update-profile", profile, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            })
            .then(() => {
                setSuccessMessage("Cập nhật thành công!");
                setIsEditing(false);
            })
            .catch(() => alert("Lỗi khi cập nhật hồ sơ!"))
            .finally(() => setLoading(false));
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const uniqueName = `avatar_${uuidv4()}`;
        const storageRef = ref(storage, `avatars/${uniqueName}`);

        uploadBytes(storageRef, file)
            .then((snapshot) => getDownloadURL(snapshot.ref))
            .then((url) => {
                setProfile((prev) => ({
                    ...prev,
                    avatar: url,
                }));
            })
            .catch((error) => {
                console.error("Lỗi upload ảnh:", error);
                alert("Lỗi khi tải ảnh lên!");
            });
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
                </div>

                <form onSubmit={handleSubmit} className="profile-form">
                    <div className="form-group">
                        <label>Họ tên</label>
                        {isEditing ? (
                            <input name="fullName" value={profile.fullName} onChange={handleChange} required />
                        ) : (
                            <p>{profile.fullName || "(Chưa có)"}</p>
                        )}
                    </div>

                    <div className="form-group">
                        <label htmlFor="dob">Ngày sinh</label>
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
                            <input name="phone" value={profile.phone} onChange={handleChange} required />
                        ) : (
                            <p>{profile.phone || "(Chưa có)"}</p>
                        )}
                    </div>

                    <div className="form-group">
                        <label>Email</label>
                        {isEditing ? (
                            <input name="email" value={profile.email} onChange={handleChange} required />
                        ) : (
                            <p>{profile.email || "(Chưa có)"}</p>
                        )}
                    </div>

                    <div className="form-group">
                        <label htmlFor="address">Địa chỉ</label>
                        {isEditing ? (
                            <textarea
                                name="address"
                                id="address"
                                value={profile.address}
                                onChange={handleChange}
                                rows={3}
                                placeholder="Nhập địa chỉ..."
                                required
                            />
                        ) : (
                            <p>{profile.address || "(Chưa có)"}</p>
                        )}
                    </div>

                    {isEditing ? (
                        <div style={{ display: "flex", gap: "10px" }}>
                            <button type="submit" disabled={loading}>
                                {loading ? "Đang cập nhật..." : "Lưu thay đổi"}
                            </button>
                            <button type="button" onClick={() => setIsEditing(false)}>
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
