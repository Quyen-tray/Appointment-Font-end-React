import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

export default function PatientNavbar() {
    // const navigate = useNavigate();
    //
    // const handleLogout = () => {
    //     // TODO: gọi logout từ context nếu có
    //     navigate("/login");
    // };

    return (
        <nav className="navbar navbar-expand-lg navbar-dark bg-primary px-3">
            <Link className="navbar-brand" to="/patient">Patient Panel</Link>

            <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#patientNavbar" aria-controls="patientNavbar" aria-expanded="false" aria-label="Toggle navigation">
                <span className="navbar-toggler-icon"></span>
            </button>

            <div className="collapse navbar-collapse" id="patientNavbar">
                <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                    <li className="nav-item">
                        <Link className="nav-link" to="/booking">Book Appointment</Link>
                    </li>

                    <li className="nav-item">
                        <Link className="nav-link" to="/patient/appointments/history">View History Appointment</Link>
                    </li>

                    <li className="nav-item">
                        <Link className="nav-link" to="/patient/profile">Profile</Link>
                    </li>
                </ul>

                {/*<button className="btn btn-outline-light btn-sm" onClick={handleLogout}>*/}
                {/*    Logout*/}
                {/*</button>*/}
            </div>
        </nav>
    );
}
