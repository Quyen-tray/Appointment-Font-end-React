import React, { useEffect, useState } from 'react';
import { fetchLogs, deleteLog } from './service/UserActivityLogApi';
import { motion, AnimatePresence } from 'framer-motion';

export default function UserActivityLogPage() {
    const [logs, setLogs] = useState([]);
    const [page, setPage] = useState(0);
    const [size] = useState(10);
    const [totalPages, setTotalPages] = useState(0);
    const [username, setUsername] = useState('');
    const [action, setAction] = useState('');
    const [endpoint, setEndpoint] = useState('');
    const [sortBy, setSortBy] = useState('username');
    const [direction, setDirection] = useState('ASC');
    const [loading, setLoading] = useState(true);

    const loadLogs = async () => {
        setLoading(true);
        try {
            const res = await fetchLogs(page, size, username, action, endpoint, sortBy, direction);
            setLogs(res.data.content);
            setTotalPages(res.data.totalPages);
        } catch (err) {
            console.error('Load logs error:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadLogs();
    }, [page, username, action, endpoint, sortBy, direction]);

    const handleDelete = async (id) => {
        if (window.confirm('Delete this log entry?')) {
            await deleteLog(id);
            loadLogs();
        }
    };

    return (
        <motion.div
            className="container mt-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4 }}
        >
            <h3>User Activity Logs</h3>

            <div className="d-flex flex-wrap gap-3 mb-3">
                <input
                    className="form-control w-25"
                    placeholder="Search by username"
                    value={username}
                    onChange={(e) => { setUsername(e.target.value); setPage(0); }}
                />
                <input
                    className="form-control w-25"
                    placeholder="Search by action"
                    value={action}
                    onChange={(e) => { setAction(e.target.value); setPage(0); }}
                />
                <input
                    className="form-control w-25"
                    placeholder="Search by endpoint"
                    value={endpoint}
                    onChange={(e) => { setEndpoint(e.target.value); setPage(0); }}
                />
                <select
                    className="form-select w-25"
                    value={sortBy}
                    onChange={(e) => { setSortBy(e.target.value); setPage(0); }}
                >
                    <option value="username">Sort by Username</option>
                    <option value="action">Sort by Action</option>
                    <option value="endpoint">Sort by Endpoint</option>
                </select>
                <select
                    className="form-select w-25"
                    value={direction}
                    onChange={(e) => { setDirection(e.target.value); setPage(0); }}
                >
                    <option value="ASC">Ascending</option>
                    <option value="DESC">Descending</option>
                </select>
            </div>

            {loading ? (
                <div className="text-center py-4">Loading logs...</div>
            ) : (
                <AnimatePresence>
                    <motion.table
                        className="table table-bordered table-hover"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.3 }}
                    >
                        <thead>
                        <tr>
                            <th>Username</th>
                            <th>Action</th>
                            <th>Method</th>
                            <th>Endpoint</th>
                            <th>IP</th>
                            <th>User Agent</th>
                            <th>Time</th>
                            <th>Duration (ms)</th>
                            <th>Action</th>
                        </tr>
                        </thead>
                        <tbody>
                        {logs.map((log) => (
                            <motion.tr key={log.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.2 }}>
                                <td>{log.username}</td>
                                <td>{log.action}</td>
                                <td>{log.method}</td>
                                <td>{log.endpoint}</td>
                                <td>{log.ipAddress}</td>
                                <td style={{ maxWidth: '200px', overflowWrap: 'break-word' }}>{log.userAgent}</td>
                                <td>{new Date(log.timestamp).toLocaleString()}</td>
                                <td>{log.durationMs}</td>
                                <td>
                                    <button className="btn btn-sm btn-danger" onClick={() => handleDelete(log.id)}>Delete</button>
                                </td>
                            </motion.tr>
                        ))}
                        </tbody>
                    </motion.table>
                </AnimatePresence>
            )}

            <ul className="pagination">
                {Array.from({length: totalPages}, (_, idx) => idx)
                    .filter(i => i === 0 || i === totalPages - 1 || Math.abs(i - page) <= 2) // Hiện trang đầu, cuối, và ±2 xung quanh
                    .map(i => (
                        <li key={i} className={`page-item ${i === page ? 'active' : ''}`}>
                            <button className="page-link" onClick={() => setPage(i)}>{i + 1}</button>
                        </li>
                    ))}
            </ul>
        </motion.div>
    );
}

