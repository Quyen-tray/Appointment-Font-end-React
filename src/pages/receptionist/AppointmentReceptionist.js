import React, { useState, useEffect } from "react";

export default function AppointmentReceptionist() {
    const [appointments, setAppointments] = useState([]);
    const [patients, setPatients] = useState([]);
    const [doctors, setDoctors] = useState([]);
    const [rooms, setRooms] = useState([]);
    const [receptionists, setReceptionists] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [token,setToken] = useState(localStorage.getItem('token'));
    const [editing, setEditing] = useState(null); // null: add, object: edit
    const [form, setForm] = useState({
        patient: "",
        doctor: "",
        room: "",
        scheduledTime: "",
        status: "",
    });
    const [showDetail, setShowDetail] = useState(false);
    const [detailData, setDetailData] = useState(null);
    const [detailForm, setDetailForm] = useState({});
    const [showConfirm, setShowConfirm] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize] = useState(10);
    const [search, setSearch] = useState("");
    const [filterStatus, setFilterStatus] = useState("");
    const [sortScheduledTime, setSortScheduledTime] = useState();

    // Lấy danh sách appointment, bệnh nhân, bác sĩ, phòng từ API
    useEffect(() => {
        fetch("http://localhost:8081/api/appointment")
            .then((res) => res.json())
            .then((data) => setAppointments(data))
            .catch(() => setAppointments([]));
        fetch("http://localhost:8081/api/patient")
            .then((res) => res.json())
            .then((data) => setPatients(data))
            .catch(() => setPatients([]));
        fetch("http://localhost:8081/api/doctor/list-doctor")
            .then((res) => res.json())
            .then((data) => setDoctors(data))
            .catch(() => setDoctors([]));
        fetch("http://localhost:8081/api/room")
            .then((res) => res.json())
            .then((data) => setRooms(data))
            .catch(() => setRooms([]));
        fetch("http://localhost:8081/api/receptionist")
            .then((res) => res.json())
            .then((data) => setReceptionists(data))
            .catch(() => setReceptionists([]));
    }, []);

    // Xử lý mở form thêm/sửa
    const openModal = (item = null) => {
        setEditing(item);
        if (item) {
            setForm({
                patient: item.patient?.id || "",
                doctor: item.doctor?.id || "",
                room: item.room?.id || "",
                scheduledTime: item.scheduledTime || "",
            });
        } else {
            setForm({
                patient: "",
                doctor: "",
                room: "",
                scheduledTime: "",
            });
        }
        setShowModal(true);
    };

    // Xử lý đóng form
    const closeModal = () => {
        setShowModal(false);
        setEditing(null);
    };

    // Xử lý thay đổi form
    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    // Thêm hoặc cập nhật appointment qua API
    const handleSubmit = (e) => {
        e.preventDefault();
        const method = editing ? "PUT" : "POST";
        const url = editing
            ? `http://localhost:8081/api/appointment/update/${editing.id}`
            : "http://localhost:8081/api/appointment/create";
        // Chuyển đổi scheduledTime sang ISO-8601 có 'Z'
        let scheduledTime = form.scheduledTime;
        if (scheduledTime && !scheduledTime.endsWith('Z')) {
            // Nếu thiếu giây, thêm :00
            if (scheduledTime.length === 16) scheduledTime += ":00";
            scheduledTime += "Z";
        }
        const body = {
            ...editing,
            patientId: patients.find((p) => p.id === form.patient).id,
            doctorId: doctors.find((d) => d.id === form.doctor).id,
            roomId: rooms.find((r) => r.id === form.room).id,
            scheduledTime,
            createdRole: "RECEPTIONIST", // Mặc định là receptionist
        };
        fetch(url, {
            method,
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify(body),
        })
            .then(() => {
                // Reload list
                return fetch("http://localhost:8081/api/appointment").then((res) => res.json());
            })
            .then((data) => setAppointments(data))
            .finally(closeModal);
    };

    // Xóa appointment qua API
    const handleDelete = (id) => {
        if (window.confirm("Bạn có chắc muốn xóa?")) {
            fetch(`http://localhost:8081/api/appointment/delete/${id}`, {
                method: "DELETE", headers: {
                    Authorization: `Bearer ${token}`,
                },
            })
                .then(() => fetch("http://localhost:8081/api/appointment"))
                .then((res) => res.json())
                .then((data) => setAppointments(data));
        }
    };

    const openDetail = (item) => {
        setDetailData(item);
        setDetailForm({
            patient: item.patient?.id || "",
            doctor: item.doctor?.id || "",
            room: item.room?.id || "",
            scheduledTime: item.scheduledTime || "",
            status: item.status || "",
            receptionistId: item.approvedBy?.id || "",
        });
        setShowDetail(true);
    };
    const closeDetail = () => {
        setShowDetail(false);
        setDetailData(null);
    };
    const handleDetailChange = (e) => {
        setDetailForm({ ...detailForm, [e.target.name]: e.target.value });
    };
    const handleUpdateDetail = (e) => {
        e.preventDefault();
        setShowConfirm(true);
    };
    const confirmUpdateDetail = () => {
        // Chuyển đổi scheduledTime sang ISO-8601 có 'Z'
        let scheduledTime = detailForm.scheduledTime;
        if (scheduledTime && !scheduledTime.endsWith('Z')) {
            if (scheduledTime.length === 16) scheduledTime += ":00";
            scheduledTime += "Z";
        }
        const body = {
            status: detailForm.status,
            receptionistId: detailForm.approvedBy || null,
        };
        fetch(`http://localhost:8081/api/appointment/status/${detailData.id}`, {
            method: "PUT",
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify(body),
        })
            .then(() => fetch("http://localhost:8081/api/appointment").then((res) => res.json()))
            .then((data) => setAppointments(data))
            .finally(() => {
                setShowConfirm(false);
                closeDetail();
            });
    };

    const handleSearch = (e) => {
        e.preventDefault();
        setCurrentPage(1);
        let url = `http://localhost:8081/api/appointment?keyword=${encodeURIComponent(search)}`;
        if (filterStatus) url += `&status=${filterStatus}`;
        if (sortScheduledTime) url += `&isIncreaseScheduleDate=${sortScheduledTime}`;
        fetch(url)
            .then((res) => res.json())
            .then((data) => setAppointments(data))
            .catch(() => setAppointments([]));
    };

    function formatDate(dateString) {
        if (!dateString) return "null";
        const d = new Date(dateString);
        if (isNaN(d.getTime())) return dateString;
        const day = String(d.getDate()).padStart(2, '0');
        const month = String(d.getMonth() + 1).padStart(2, '0');
        const year = d.getFullYear();
        return `${day}/${month}/${year}`;
    }

    const paginatedAppointments = appointments.slice((currentPage - 1) * pageSize, currentPage * pageSize);
    const totalPages = Math.ceil(appointments.length / pageSize);

    const handlePageChange = (page) => {
        if (page >= 1 && page <= totalPages) setCurrentPage(page);
    };

    return (
        <div className="container mt-4">
            <h2>Quản lý lịch hẹn</h2>
            <form className="row mb-3" onSubmit={handleSearch}>
                <div className="col-md-3">
                    <label className="form-label">Từ khóa</label>
                    <input
                        type="text"
                        className="form-control"
                        placeholder="Tìm kiếm theo tên  ..."
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                    />
                </div>
                <div className="col-md-2">
                    <label className="form-label">Trạng thái</label>
                    <select className="form-control" value={filterStatus} onChange={e => setFilterStatus(e.target.value)}>
                        <option value="">-- Tất cả trạng thái --</option>
                        <option value="PENDING">Pending</option>
                        <option value="APPROVED">Approved</option>
                        <option value="CANCELLED">Cancelled</option>
                        <option value="DONE">Done</option>
                    </select>
                </div>
                <div className="col-md-2">
                    <label className="form-label">Sắp xếp theo ngày hẹn</label>
                    <select className="form-control" value={sortScheduledTime} onChange={e => setSortScheduledTime(e.target.value)}>
                        <option value={null}>-- Mặc định --</option>
                        <option value={true}>Tăng dần</option>
                        <option value={false}>Giảm dần</option>
                    </select>
                </div>
                <div className="col-md-2 d-flex align-items-end">
                    <button className="btn btn-primary w-100" type="submit">Tìm kiếm</button>
                </div>
            </form>
            <button className="btn btn-primary mb-2" onClick={() => openModal()}>Thêm lịch hẹn</button>
            <table className="table table-bordered">
                <thead>
                    <tr>
                        <th>Bệnh nhân</th>
                        <th>Bác sĩ</th>
                        <th>Phòng</th>
                        <th>Thời gian</th>
                        <th>Trạng thái</th>
                        <th>Người tạo</th>
                        <th>Vai trò tạo</th>
                        <th>Người duyệt</th>
                        <th>Trạng thái duyệt</th>
                        <th>Thời gian duyệt</th>
                        <th>Hành động</th>
                    </tr>
                </thead>
                <tbody>
                    {paginatedAppointments.map((a) => (
                        <tr key={a.id}>
                            <td>{a.patient?.fullName}</td>
                            <td>{a.doctor?.fullName}</td>
                            <td>{a.room?.roomName}</td>
                            <td>{formatDate(a.scheduledTime)}</td>
                            <td>{a.status}</td>
                            <td>{a.createdBy?.username}</td>
                            <td>{a.createdRole}</td>
                            <td>{a.approvedBy?.fullName ?? 'null'}</td>
                            <td>{a.approvalStatus ??'null'}</td>
                            <td>{formatDate(a.approvedAt) ?? 'null'}</td>
                            <td>
                                <button className="btn btn-sm btn-info me-2" onClick={() => openDetail(a)}>Xem chi tiết</button>
                                <button className="btn btn-sm btn-warning me-2" onClick={() => openModal(a)}>Sửa</button>
                                <button className="btn btn-sm btn-danger" onClick={() => handleDelete(a.id)}>Xóa</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {/* Modal thêm/sửa */}
            {showModal && (
                <div className="modal show" style={{ display: "block", background: "rgba(0,0,0,0.3)" }}>
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">{editing ? "Sửa" : "Thêm"} lịch hẹn</h5>
                                <button type="button" className="btn-close" onClick={closeModal}></button>
                            </div>
                            <form onSubmit={handleSubmit}>
                                <div className="modal-body">
                                    <div className="mb-2">
                                        <label>Bệnh nhân</label>
                                        <select name="patient" className="form-control" value={form.patient} onChange={handleChange} required>
                                            <option value="">-- Chọn bệnh nhân --</option>
                                            {patients.map((p) => (
                                                <option key={p.id} value={p.id}>{p.fullName}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="mb-2">
                                        <label>Bác sĩ</label>
                                        <select name="doctor" className="form-control" value={form.doctor} onChange={handleChange} required>
                                            <option value="">-- Chọn bác sĩ --</option>
                                            {doctors.map((d) => (
                                                <option key={d.id} value={d.id}>{d.fullName}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="mb-2">
                                        <label>Phòng</label>
                                        <select name="room" className="form-control" value={form.room} onChange={handleChange} required>
                                            <option value="">-- Chọn phòng --</option>
                                            {rooms.map((r) => (
                                                <option key={r.id} value={r.id}>{r.roomName}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="mb-2">
                                        <label>Thời gian</label>
                                        <input
                                            name="scheduledTime"
                                            type="datetime-local"
                                            className="form-control"
                                            value={form.scheduledTime}
                                            onChange={handleChange}
                                            required
                                            step="1"
                                        />
                                     </div>




                                </div>
                                <div className="modal-footer">
                                    <button type="button" className="btn btn-secondary" onClick={closeModal}>Hủy</button>
                                    <button type="submit" className="btn btn-primary">Lưu</button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}

            {/* Modal xem chi tiết */}
            {showDetail && (
                <div className="modal show" style={{ display: "block", background: "rgba(0,0,0,0.3)" }}>
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">Chi tiết lịch hẹn</h5>
                                <button type="button" className="btn-close" onClick={closeDetail}></button>
                            </div>
                            <form onSubmit={handleUpdateDetail}>
                                <div className="modal-body">
                                    <div className="mb-2">
                                        <label>Bệnh nhân</label>
                                        <select name="patient" className="form-control" value={detailForm.patient} onChange={handleDetailChange} required disabled>
                                            <option value="">-- Chọn bệnh nhân --</option>
                                            {patients.map((p) => (
                                                <option key={p.id} value={p.id}>{p.fullName}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="mb-2">
                                        <label>Bác sĩ</label>
                                        <select name="doctor" className="form-control" value={detailForm.doctor} onChange={handleDetailChange} required disabled>
                                            <option value="">-- Chọn bác sĩ --</option>
                                            {doctors.map((d) => (
                                                <option key={d.id} value={d.id}>{d.fullName}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="mb-2">
                                        <label>Phòng</label>
                                        <select name="room" className="form-control" value={detailForm.room} onChange={handleDetailChange} required disabled>
                                            <option value="">-- Chọn phòng --</option>
                                            {rooms.map((r) => (
                                                <option key={r.id} value={r.id}>{r.roomName}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="mb-2">
                                        <label>Thời gian</label>
                                        <input
                                            name="scheduledTime"
                                            type="datetime-local"
                                            className="form-control"
                                            value={detailForm.scheduledTime}
                                            onChange={handleDetailChange}
                                            required
                                            step="1"
                                            disabled
                                        />
                                    </div>
                                    <div className="mb-2">
                                        <label>Trạng thái</label>
                                        <select name="status" className="form-control" value={detailForm.status} onChange={handleDetailChange} required>
                                            <option value="">-- Chọn trạng thái --</option>
                                            <option value="PENDING">PENDING</option>
                                            <option value="APPROVED">APPROVED</option>
                                            <option value="CANCELLED">CANCELLED</option>
                                            <option value="DONE">DONE</option>
                                        </select>
                                    </div>
                                   
                                </div>
                                <div className="modal-footer">
                                    <button type="button" className="btn btn-secondary" onClick={closeDetail}>Đóng</button>
                                    <button type="submit" className="btn btn-primary">Cập nhật</button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
            {showConfirm && (
                <div className="modal show" style={{ display: "block", background: "rgba(0,0,0,0.3)" }}>
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">Xác nhận cập nhật</h5>
                            </div>
                            <div className="modal-body">
                                Bạn có chắc chắn muốn cập nhật trạng thái lịch hẹn này không?
                            </div>
                            <div className="modal-footer">
                                <button className="btn btn-secondary" onClick={() => setShowConfirm(false)}>Hủy</button>
                                <button className="btn btn-primary" onClick={confirmUpdateDetail}>Xác nhận</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
            {totalPages > 1 && (
                <nav>
                    <ul className="pagination justify-content-center">
                        <li className={`page-item${currentPage === 1 ? ' disabled' : ''}`}>
                            <button className="page-link" onClick={() => handlePageChange(currentPage - 1)}>&laquo;</button>
                        </li>
                        {Array.from({ length: totalPages }, (_, i) => (
                            <li key={i + 1} className={`page-item${currentPage === i + 1 ? ' active' : ''}`}>
                                <button className="page-link" onClick={() => handlePageChange(i + 1)}>{i + 1}</button>
                            </li>
                        ))}
                        <li className={`page-item${currentPage === totalPages ? ' disabled' : ''}`}>
                            <button className="page-link" onClick={() => handlePageChange(currentPage + 1)}>&raquo;</button>
                        </li>
                    </ul>
                </nav>
            )}
        </div>
    );
}
