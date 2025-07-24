import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

export default function ReceptionistNavbar() {
    // const navigate = useNavigate();
    //
    // const handleLogout = () => {
    //     // TODO: gọi logout từ context nếu có
    //     navigate("/login");
    // };

    return (
        <nav className="navbar navbar-expand-lg navbar-dark bg-success px-3">
            <Link className="navbar-brand" to="/receptionist">Lễ Tân</Link>

            <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#receptionistNavbar" aria-controls="receptionistNavbar" aria-expanded="false" aria-label="Toggle navigation">
                <span className="navbar-toggler-icon"></span>
            </button>

            <div className="collapse navbar-collapse" id="receptionistNavbar">
                <ul className="navbar-nav me-auto mb-2 mb-lg-0">

                    <li className="nav-item">
                        <Link className="nav-link" to="/receptionist/appointments">Danh Sách Lịch Hẹn</Link>
                    </li>

                    <li className="nav-item">
                        <Link className="nav-link" to="/receptionist/patients">Danh Sách Bệnh Nhân</Link>
                    </li>

                    <li className="nav-item">
                        <Link className="nav-link" to="/receptionist/rooms">Danh Sách Phòng</Link>
                    </li>

                    <li className="nav-item">
                        <Link className="nav-link" to="/receptionist/doctors">Danh Sách Bác Sĩ</Link>
                    </li>

                    <li className="nav-item">
                        <Link className="nav-link" to="/receptionist/profile">Profile</Link>
                    </li>
                    <li className="nav-item">
                        <Link className="nav-link" to="/receptionist/change-password">Change Password</Link>
                    </li>
                </ul>

                {/*<button className="btn btn-outline-light btn-sm" onClick={handleLogout}>*/}
                {/*    Logout*/}
                {/*</button>*/}
            </div>
        </nav>
    );
}
