import React, { useEffect, useState } from 'react';
import {
    fetchPatient,
    updatePatient,
    deletePatient
} from './service/UserPatientApi';
import UserPatientForm from './components/UserPatientForm';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../AuthContext';
import { useNavigate } from 'react-router-dom';

export default function UserPatientPage() {
    const { user, isLoggedIn, isAuthReady } = useAuth();
    const navigate = useNavigate();

    const [patients, setPatients] = useState([]);
    const [editing, setEditing] = useState(null);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(0);
    const [size] = useState(5);
    const [totalPages, setTotalPages] = useState(1);
    const [keyword, setKeyword] = useState('');
    const [sortBy, setSortBy] = useState('fullName');
    const [direction, setDirection] = useState('ASC');

    const loadData = async () => {
        setLoading(true);
        try {
            const res = await fetchPatient(page, size, sortBy, direction, keyword);
            setPatients(res.data.content || []);
            setTotalPages(res.data.totalPages || 1);
            console.log(patients);
        } catch (err) {
            console.error('Load error:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (isAuthReady && isLoggedIn) {
            loadData();
        }
    }, [page, keyword, sortBy, direction, isAuthReady, isLoggedIn]);

    const handleSubmit = async (data) => {
        try {
            await updatePatient(editing.id, data);
            setEditing(null);
            loadData();
        } catch (err) {
            console.error('Update error:', err);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Delete this patient?')) {
            try {
                await deletePatient(id);
                loadData();
            } catch (err) {
                console.error('Delete error:', err);
            }
        }
    };

    return (
        <motion.div className="container mt-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
            <h2 className="mb-4">Patient Management</h2>

            {/* Hiển thị form nếu đang chỉnh sửa */}
            {editing && (
                <UserPatientForm
                    initialData={editing}
                    onSubmit={handleSubmit}
                    onCancel={() => setEditing(null)}
                />
            )}

            <div className="d-flex justify-content-between align-items-center mb-3 gap-3 flex-wrap">
                <input
                    className="form-control w-25"
                    placeholder="Search..."
                    value={keyword}
                    onChange={(e) => {
                        setKeyword(e.target.value);
                        setPage(0);
                    }}
                />

                <select className="form-select w-25" value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
                    <option value="fullName">Sắp xếp theo tên</option>
                    <option value="email">Sắp xếp theo Email</option>
                    <option value="phone">Sắp xếp theo SĐT</option>
                </select>

                <select className="form-select w-25" value={direction} onChange={(e) => setDirection(e.target.value)}>
                    <option value="ASC">Tăng dần (A-Z)</option>
                    <option value="DESC">Giảm dần (Z-A)</option>
                </select>

                {/* Nút chuyển sang trang tạo tài khoản mới */}
                <button
                    className="btn btn-success"
                    onClick={() => navigate('/admin/usersAccount')}
                >
                    ➕ Tạo User Account mới
                </button>
            </div>

            {loading ? (
                <div className="text-center py-4">Loading...</div>
            ) : (
                <AnimatePresence>
                    <motion.table
                        className="table table-bordered table-striped"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.4 }}
                    >
                        <thead>
                        <tr>
                            <th>Full Name</th>
                            <th>Gender</th>
                            <th>DOB</th>
                            <th>Phone</th>
                            <th>Email</th>
                            <th>Action</th>
                        </tr>
                        </thead>
                        <tbody>
                        {patients.map((p) => (
                            <motion.tr key={p.id}>
                                <td>{p.fullName}</td>
                                <td>{p.gender}</td>
                                <td>{p.dob}</td>
                                <td>{p.phone}</td>
                                <td>{p.email}</td>
                                <td>
                                    <button
                                        className="btn btn-warning btn-sm me-2"
                                        onClick={() => setEditing(p)}
                                    >
                                        Update
                                    </button>
                                    <button
                                        className="btn btn-danger btn-sm"
                                        onClick={() => handleDelete(p.userAccountDto.id)}
                                    >
                                        Delete
                                    </button>
                                </td>
                            </motion.tr>
                        ))}
                        </tbody>
                    </motion.table>
                </AnimatePresence>
            )}

            <nav>
                <ul className="pagination">
                    {[...Array(totalPages)].map((_, idx) => (
                        <li key={idx} className={`page-item ${idx === page ? 'active' : ''}`}>
                            <button className="page-link" onClick={() => setPage(idx)}>
                                {idx + 1}
                            </button>
                        </li>
                    ))}
                </ul>
            </nav>
        </motion.div>
    );
}
