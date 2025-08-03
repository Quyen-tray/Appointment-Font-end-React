import React from 'react';
import { Link } from 'react-router-dom';

export default function DoctorNavbar() {
    return (
        <nav className="navbar navbar-expand-lg navbar-dark bg-success px-3">
            <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#doctorNavbar" aria-controls="doctorNavbar" aria-expanded="false" aria-label="Toggle navigation">
                <span className="navbar-toggler-icon"></span>
            </button>

            <div className="collapse navbar-collapse" id="doctorNavbar">
                <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                    <li className="nav-item">
                        <Link className="nav-link" to="/doctor">
                            <i className="fas fa-calendar-check me-2"></i>Cuộc Hẹn
                        </Link>
                    </li>
                    <li className="nav-item">
                        <Link className="nav-link" to="/doctor/profile">
                            <i className="fas fa-user-md me-2"></i>Hồ Sơ
                        </Link>
                    </li>

                    <li className="nav-item">
                        <Link className="nav-link" to="/doctor/change-password">
                            <i className="fas fa-key me-2"></i>Đổi Mật Khẩu
                        </Link>
                    </li>
                </ul>

                <div className="navbar-text text-light">
                    <i className="fas fa-user-md me-2"></i>
                    Bác sĩ
                </div>
            </div>
        </nav>
    );
} 