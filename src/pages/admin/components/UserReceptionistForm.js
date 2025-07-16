import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

export default function UserReceptionistForm({ initialData, onSubmit, onCancel }) {
    const [form, setForm] = useState({
        fullName: '',
        gender: '',
        dob: '',
        email: '',
        phone: '',
        status: '',
        note: '',
    });

    useEffect(() => {
        if (initialData) {
            setForm({ ...initialData });
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
            <h5>{initialData ? 'Update Receptionist' : 'Create Receptionist'}</h5>

            <div className="mb-2">
                <label>Full Name</label>
                <input type="text" name="fullName" className="form-control" value={form.fullName} onChange={handleChange} required />
            </div>

            <div className="mb-2">
                <label>Gender</label>
                <select name="gender" className="form-select" value={form.gender} onChange={handleChange}>
                    <option value="">-- Select Gender --</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                </select>
            </div>

            <div className="mb-2">
                <label>Date of Birth</label>
                <input type="date" name="dob" className="form-control" value={form.dob} onChange={handleChange} />
            </div>

            <div className="mb-2">
                <label>Email</label>
                <input type="email" name="email" className="form-control" value={form.email} onChange={handleChange} />
            </div>

            <div className="mb-2">
                <label>Phone</label>
                <input type="text" name="phone" className="form-control" value={form.phone} onChange={handleChange} />
            </div>

            <div className="mb-2">
                <label>Status</label>
                <select name="status" className="form-select" value={form.status} onChange={handleChange}>
                    <option value="ACTIVE">ACTIVE</option>
                    <option value="INACTIVE">INACTIVE</option>
                </select>
            </div>

            <div className="mb-2">
                <label>Note</label>
                <textarea name="note" className="form-control" value={form.note} onChange={handleChange}></textarea>
            </div>

            <div className="d-flex justify-content-end gap-2">
                <button type="submit" className="btn btn-success">Save</button>
                <button type="button" className="btn btn-secondary" onClick={onCancel}>Cancel</button>
            </div>
        </motion.form>
    );
}
