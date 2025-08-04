import React, { useEffect, useState } from "react";
import axios from "axios";
import ReactDatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { registerLocale } from "react-datepicker";
import vi from "date-fns/locale/vi";
registerLocale("vi", vi);

function RelativeManagement() {
    const [relatives, setRelatives] = useState([]);
    const [formData, setFormData] = useState({
        id: null,
        fullName: "",
        dob: "",
        gender: "",
        relation: "",
        note: ""
    });
    const [isEditing, setIsEditing] = useState(false);
    const [searchInput, setSearchInput] = useState("");
    const [page, setPage] = useState(0);
    const [size] = useState(5);
    const [totalPages, setTotalPages] = useState(0);
    const [search, setSearch] = useState("");
    const isFullNameValid = (name) => /^[\p{L} ]+$/u.test(name);

    const fetchRelatives = async () => {
        const config = {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`
            }
        };
        const response = await axios.get(`http://localhost:8081/api/patient/relatives/paged?page=${page}&size=${size}&search=${search}`, config);
        setRelatives(response.data.content);
        setTotalPages(response.data.totalPages);
    };

    useEffect(() => {
        fetchRelatives();
    }, [page, search]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleDateChange = (date) => {
        setFormData(prev => ({ ...prev, dob: date.toISOString().split("T")[0] }));
    };

    const capitalizeWords = (str) => {
        return str
            .toLowerCase()
            .split(" ")
            .filter(word => word.trim() !== "")
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join(" ");
    };
    const [submitAttempted, setSubmitAttempted] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitAttempted(true);

        if (!isFullNameValid(formData.fullName)) {
            return;
        }

        const config = {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`
            }
        };

        const submitData = {
            ...formData,
            fullName: capitalizeWords(formData.fullName)
        };

        try {
            if (isEditing) {
                await axios.put(`http://localhost:8081/api/patient/relatives/update/${formData.id}`, submitData, config);
            } else {
                await axios.post("http://localhost:8081/api/patient/relatives/add", submitData, config);
            }
            fetchRelatives();
            setFormData({ id: null, fullName: "", dob: "", gender: "", relation: "", note: "" });
            setIsEditing(false);
            setSubmitAttempted(false);
        } catch (err) {
            alert("Đã xảy ra lỗi khi lưu dữ liệu.");
        }
    };


    const handleEdit = (relative) => {
        setFormData(relative);
        setIsEditing(true);
    };

    const handleDelete = async (id) => {
        const confirmed = window.confirm("Bạn có chắc chắn muốn xóa người thân này?");
        if (!confirmed) return;
        const config = {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`
            }
        };
        await axios.delete(`http://localhost:8081/api/patient/relatives/delete/${id}`, config);
        fetchRelatives();
    };

    useEffect(() => {
        fetchRelatives();
    }, []);

    return (
        <div className="container mt-4">
            <h4>Quản lý người thân</h4>
            <form onSubmit={handleSubmit} className="mb-4">
                <div className="row">
                    <div className="col-md-4">
                        <label>Họ tên</label>
                        <input className="form-control" name="fullName" value={formData.fullName} onChange={handleChange} required />
                        {submitAttempted && !isFullNameValid(formData.fullName) && (
                            <small className="text-danger">Họ tên không được chứa số hoặc ký hiệu đặc biệt.</small>
                        )}
                    </div>
                    <div className="col-md-2">
                        <label>Ngày sinh</label>
                        <ReactDatePicker
                            className="form-control"
                            selected={formData.dob ? new Date(formData.dob) : null}
                            onChange={handleDateChange}
                            dateFormat="yyyy-MM-dd"
                            locale="vi"
                            showMonthDropdown
                            showYearDropdown
                            dropdownMode="select"
                            maxDate={new Date()}
                            minDate={new Date("1900-01-01")}
                            placeholderText="Chọn ngày sinh"
                            required
                        />
                    </div>
                    <div className="col-md-2">
                        <label>Giới tính</label>
                        <select className="form-control" name="gender" value={formData.gender} onChange={handleChange} required>
                            <option value="">-- Chọn --</option>
                            <option value="Nam">Nam</option>
                            <option value="Nữ">Nữ</option>
                            <option value="Khác">Khác</option>
                        </select>
                    </div>
                    <div className="col-md-2">
                        <label>Quan hệ</label>
                        <select className="form-control" name="relation" value={formData.relation} onChange={handleChange} required>
                            <option value="">-- Chọn --</option>
                            <option value="Bố">Bố</option>
                            <option value="Mẹ">Mẹ</option>
                            <option value="Anh">Anh</option>
                            <option value="Chị">Chị</option>
                            <option value="Em">Em</option>
                            <option value="Con">Con</option>
                            <option value="Khác">Khác</option>
                        </select>
                    </div>
                    <div className="col-md-2">
                        <label>Ghi chú</label>
                        <input className="form-control" name="note" value={formData.note} onChange={handleChange} />
                    </div>
                </div>
                <button className="btn btn-success mt-3" type="submit">
                    {isEditing ? "Cập nhật" : "Thêm người thân"}
                </button>
                {isEditing && (
                    <button
                        className="btn btn-secondary mt-3 ms-2"
                        type="button"
                        onClick={() => {
                            setFormData({ id: null, fullName: "", dob: "", gender: "", relation: "", note: "" });
                            setIsEditing(false);
                        }}
                    >
                        Hủy
                    </button>
                )}
            </form>
            <div className="row mb-3">
                <div className="col-md-6">
                    <input
                        type="text"
                        className="form-control"
                        placeholder="Tìm theo tên người thân..."
                        value={searchInput}
                        onChange={(e) => setSearchInput(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === "Enter") {
                                setPage(0);
                                setSearch(searchInput.trim());
                            }
                        }}
                    />
                </div>
                <div className="col-md-6 d-flex justify-content-start mt-2 mt-md-0">
                    <button
                        className="btn btn-primary me-2"
                        type="button"
                        onClick={() => {
                            setPage(0);
                            setSearch(searchInput.trim());
                        }}
                    >
                        Tìm
                    </button>
                    <button
                        className="btn btn-warning"
                        type="button"
                        onClick={() => {
                            setSearchInput("");
                            setSearch("");
                            setPage(0);
                        }}
                    >
                        Làm mới
                    </button>
                </div>
            </div>

            <h5>Danh sách người thân:</h5>
            <div className="table-responsive">
                <table className="table table-bordered table-hover text-center">
                    <thead className="table-primary">
                        <tr>
                            <th>STT</th>
                            <th>Họ tên</th>
                            <th>Ngày sinh</th>
                            <th>Giới tính</th>
                            <th>Quan hệ</th>
                            <th>Ghi chú</th>
                            <th>Thao tác</th>
                        </tr>
                    </thead>
                    <tbody>
                        {relatives.length === 0 ? (
                            <tr>
                                <td colSpan="7">Không có dữ liệu</td>
                            </tr>
                        ) : (
                            relatives.map((r, index) => (
                                <tr key={r.id}>
                                    <td>{index + 1}</td>
                                    <td className="text-start">{r.fullName}</td>
                                    <td>{r.dob}</td>
                                    <td>{r.gender}</td>
                                    <td>{r.relation}</td>
                                    <td className="text-start">{r.note || "-"}</td>
                                    <td>
                                        <button className="btn btn-sm btn-primary me-2" onClick={() => handleEdit(r)}>Sửa</button>
                                        <button className="btn btn-sm btn-danger" onClick={() => handleDelete(r.id)}>Xóa</button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
                <div className="d-flex justify-content-center mt-3">
                    <button
                        className="btn btn-outline-primary me-2"
                        disabled={page === 0}
                        onClick={() => setPage(prev => prev - 1)}
                    >
                        Trang trước
                    </button>
                    <span className="align-self-center">Trang {page + 1} / {totalPages}</span>
                    <button
                        className="btn btn-outline-primary ms-2"
                        disabled={page + 1 >= totalPages}
                        onClick={() => setPage(prev => prev + 1)}
                    >
                        Trang sau
                    </button>
                </div>
            </div>
        </div>
    );
}

export default RelativeManagement;
