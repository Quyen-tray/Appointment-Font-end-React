import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

export default function UserPatientForm({ onSubmit, initialData, onCancel }) {
    const [form, setForm] = useState({
        fullName: '',
        gender: '',
        dob: '',
        phone: '',
        email: ''
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
            <h5>{initialData ? 'Update Patient' : 'Create New Patient'}</h5>

            <div className="mb-3">
                <label className="form-label">Full Name</label>
                <input name="fullName" className="form-control" value={form.fullName} onChange={handleChange} required />
            </div>

            <div className="mb-3">
                <label className="form-label">Gender</label>
                <select name="gender" className="form-select" value={form.gender} onChange={handleChange} required>
                    <option value="">Select Gender</option>
                    <option value="MALE">Male</option>
                    <option value="FEMALE">Female</option>
                </select>
            </div>

            <div className="mb-3">
                <label className="form-label">Date of Birth</label>
                <input name="dob" type="date" className="form-control" value={form.dob} onChange={handleChange} required />
            </div>

            <div className="mb-3">
                <label className="form-label">Phone</label>
                <input name="phone" className="form-control" value={form.phone} onChange={handleChange} required />
            </div>

            <div className="mb-3">
                <label className="form-label">Email</label>
                <input name="email" type="email" className="form-control" value={form.email} onChange={handleChange} required />
            </div>

            <div className="d-flex justify-content-end gap-2">
                <button type="submit" className="btn btn-success">Save</button>
                {initialData && <button type="button" className="btn btn-secondary" onClick={onCancel}>Cancel</button>}
            </div>
        </motion.form>
    );
}
