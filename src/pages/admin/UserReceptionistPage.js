import React, { useEffect, useState } from 'react';
import {
    fetchReceptionists,
    updateReceptionist,
    deleteReceptionist
} from './service/UserReceptionistApi';
import UserReceptionistForm from './components/UserReceptionistForm';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../AuthContext';

export default function UserReceptionistPage() {
    const { user, isLoggedIn, isAuthReady } = useAuth();
    const navigate = useNavigate();
    const [receptionists, setReceptionists] = useState([]);
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
            const res = await fetchReceptionists(page, size, sortBy, direction, keyword);
            setReceptionists(res.data.content);
            setTotalPages(res.data.totalPages);
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
            await updateReceptionist(editing.id, data);
            setEditing(null);
            loadData();
        } catch (err) {
            console.error('Update error:', err);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Delete this receptionist?')) {
            await deleteReceptionist(id);
            loadData();
        }
    };

    return (
        <motion.div className="container mt-4" initial={{opacity: 0}} animate={{opacity: 1}}
                    transition={{duration: 0.5}}>
            <h2 className="mb-4">Receptionist Management</h2>

            {/* Chỉ hiển thị form khi cập nhật */}
            {editing && (
                <UserReceptionistForm
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

                {/* ➕ Nút tạo user account mới */}
                <button
                    className="btn btn-success"
                    onClick={() => navigate('/admin/usersAccount')}  // hoặc điều hướng bạn muốn
                >
                    ➕ Tạo User Account mới
                </button>
            </div>

            {loading ? (
                <div className="text-center py-4">Loading...</div>
            ) : (
                <AnimatePresence>
                    <motion.table className="table table-bordered table-striped"
                                  initial={{opacity: 0, y: 20}}
                                  animate={{opacity: 1, y: 0}}
                                  exit={{opacity: 0, y: -20}}
                                  transition={{duration: 0.4}}
                    >
                        <thead>
                        <tr>
                            <th>Full Name</th>
                            <th>Gender</th>
                            <th>DOB</th>
                            <th>Email</th>
                            <th>Phone</th>
                            <th>Status</th>
                            <th>Department</th>
                            <th>Position</th>
                            <th>Note</th>
                            <th>Action</th>
                        </tr>
                        </thead>
                        <tbody>
                        {receptionists.map((r) => (
                            <motion.tr key={r.id}>
                                <td>{r.fullName}</td>
                                <td>{r.gender}</td>
                                <td>{r.dob}</td>
                                <td>{r.email}</td>
                                <td>{r.phone}</td>
                                <td>{r.status}</td>
                                <td>{r.department?.name}</td>
                                <td>{r.position?.name}</td>
                                <td>{r.note}</td>
                                <td>
                                    <button className="btn btn-warning btn-sm me-2" onClick={() => setEditing(r)}>
                                        Update
                                    </button>
                                    <button className="btn btn-danger btn-sm" onClick={() => handleDelete(r.id)}>
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
