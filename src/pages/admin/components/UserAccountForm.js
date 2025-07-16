import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

export default function UserAccountForm({ onSubmit, initialData, onCancel }) {
    const [form, setForm] = useState({
        username: '',
        password: '',
        roles: '',
        status: ''
    });

    useEffect(() => {
        if (initialData) {
            setForm({ ...initialData, password: '' });
        }
    }, [initialData]);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(form);
    };

    return (
        <motion.form
            onSubmit={handleSubmit}
            className="mb-4 border p-3 rounded bg-light"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
        >
            <h5>{initialData ? 'Update Account' : 'Create New Account'}</h5>

            <input
                className="form-control mb-2"
                name="username"
                placeholder="Username"
                value={form.username}
                onChange={handleChange}
                required
            />

            <input
                className="form-control mb-2"
                name="password"
                type="password"
                placeholder="Password"
                value={form.password}
                onChange={handleChange}
                required={!initialData}
            />

            <select
                className="form-select mb-2"
                name="roles"
                value={form.roles}
                onChange={handleChange}
                required
            >
                <option value="">-- Select Role --</option>
                <option value="ADMIN">ADMIN</option>
                <option value="PATIENT">PATIENT</option>
                <option value="RECEPTIONIST">RECEPTIONIST</option>
            </select>

            <select
                className="form-select mb-3"
                name="status"
                value={form.status}
                onChange={handleChange}
                required
            >
                <option value="">-- Select Status --</option>
                <option value="ACTIVE">ACTIVE</option>
                <option value="INACTIVE">INACTIVE</option>
                <option value="LOCKED">LOCKED</option>
                <option value="PENDING">PENDING</option>
            </select>

            <button type="submit" className="btn btn-primary me-2">
                {initialData ? 'Update' : 'Create'}
            </button>

            {onCancel && (
                <button type="button" className="btn btn-secondary" onClick={onCancel}>
                    Cancel
                </button>
            )}
        </motion.form>
    );
}
