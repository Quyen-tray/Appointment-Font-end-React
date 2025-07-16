import React, { useEffect, useState } from 'react';
import {
    fetchAccounts,
    createAccount,
    updateAccount,
    deleteAccount
} from './service/UserAccountApi';
import UserAccountForm from './components/UserAccountForm';

import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {useAuth} from "../../AuthContext";

export default function UserAccountPage() {
    const { user, isLoggedIn,isAuthReady } = useAuth();
    const navigate = useNavigate();
    const [accounts, setAccounts] = useState([]);
    const [totalPages, setTotalPages] = useState(1);
    const [page, setPage] = useState(0);
    const [size] = useState(5);
    const [sortBy, setSortBy] = useState('username');
    const [direction, setDirection] = useState('ASC');
    const [keyword, setKeyword] = useState('');
    const [editing, setEditing] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (isAuthReady && (!isLoggedIn || !user.roles) ) {
            navigate("/");
        }
    }, [isLoggedIn,isAuthReady]);

    const loadData = async () => {
        setLoading(true);
        try {
            const res = await fetchAccounts(page, size, sortBy, direction, keyword);
            setAccounts(res.data.content);
            setTotalPages(res.data.totalPages);
        } catch (err) {
            console.error('Load error:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadData();
    }, [page, keyword,sortBy, direction]);

    const handleSubmit = async (data) => {
        try {
            if (editing) {
                await updateAccount(editing.id, data);
            } else {
                await createAccount(data);
            }
            setEditing(null);
            loadData();
        } catch (err) {
            console.error('Submit error:', err);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Delete this account?')) {
            await deleteAccount(id);
            loadData();
        }
    };

    return (
        <motion.div
            className="container mt-4"
            initial={{opacity: 0}}
            animate={{opacity: 1}}
            transition={{duration: 0.5}}
        >
            <h2 className="mb-4">User Account Management</h2>

            <UserAccountForm
                initialData={editing}
                onSubmit={handleSubmit}
                onCancel={() => setEditing(null)}
            />

            <div className="d-flex justify-content-between align-items-center mb-3 gap-3 flex-wrap">
                <input
                    className="form-control w-25"
                    placeholder="Search..."
                    value={keyword}
                    onChange={(e) => {
                        setPage(0);
                        setKeyword(e.target.value);
                    }}
                />

                <select
                    className="form-select w-25"
                    value={sortBy}
                    onChange={(e) => {
                        setSortBy(e.target.value);
                        setPage(0);
                    }}
                >
                    <option value="username">Sắp xếp theo Username</option>
                    <option value="roles">Sắp xếp theo Role</option>
                    <option value="status">Sắp xếp theo Status</option>
                </select>

                <select
                    className="form-select w-25"
                    value={direction}
                    onChange={(e) => {
                        setDirection(e.target.value);
                        setPage(0);
                    }}
                >
                    <option value="ASC">Tăng dần (A-Z)</option>
                    <option value="DESC">Giảm dần (Z-A)</option>
                </select>
            </div>

            {loading ? (
                <div className="text-center py-4">Loading...</div>
            ) : (
                <AnimatePresence>
                    <motion.table
                        className="table table-bordered table-striped"
                        initial={{opacity: 0, y: 20}}
                        animate={{opacity: 1, y: 0}}
                        exit={{opacity: 0, y: -20}}
                        transition={{duration: 0.4}}
                    >
                        <thead>
                        <tr>
                            <th>Username</th>
                            <th>Role</th>
                            <th>Status</th>
                            <th>Last Login</th>
                            <th>Action</th>
                        </tr>
                        </thead>
                        <tbody>
                        {accounts.map((acc) => (
                            <motion.tr
                                key={acc.id}
                                initial={{opacity: 0, scale: 0.95}}
                                animate={{opacity: 1, scale: 1}}
                                transition={{duration: 0.3}}
                            >
                                <td>{acc.username}</td>
                                <td>{acc.roles}</td>
                                <td>{acc.status}</td>
                                <td>{acc.lastLogin ? new Date(acc.lastLogin).toLocaleString() : '-'}</td>
                                <td>
                                    <button className="btn btn-sm btn-warning me-2"
                                            onClick={() => setEditing(acc)}>Edit
                                    </button>
                                    <button className="btn btn-sm btn-danger"
                                            onClick={() => handleDelete(acc.id)}>Delete
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
                            <button className="page-link" onClick={() => setPage(idx)}>{idx + 1}</button>
                        </li>
                    ))}
                </ul>
            </nav>
        </motion.div>
    );
}
