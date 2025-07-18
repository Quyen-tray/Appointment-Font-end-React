import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

export default function AdminNavbar() {
    // const navigate = useNavigate();
    //
    // const handleLogout = () => {
    //     // TODO: Gọi logout từ context
    //     navigate("/login");
    // };

    return (
        <nav className="navbar navbar-expand-lg navbar-dark bg-dark px-3">
            {/*<Link className="navbar-brand" to="/admin">Admin Panel</Link>*/}

            <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#adminNavbar" aria-controls="adminNavbar" aria-expanded="false" aria-label="Toggle navigation">
                <span className="navbar-toggler-icon"></span>
            </button>

            <div className="collapse navbar-collapse" id="adminNavbar">
                <ul className="navbar-nav me-auto mb-2 mb-lg-0">

                    <li className="nav-item">
                        <Link className="nav-link" to="/admin/usersAccount">Account Management</Link>
                    </li>

                    <li className="nav-item">
                        <Link className="nav-link" to="/admin/usersPatient">Patient Management</Link>
                    </li>

                    <li className="nav-item">
                        <Link className="nav-link" to="/admin/usersReceptionist">Reception Management</Link>
                    </li>

                    <li className="nav-item">
                        <Link className="nav-link" to="/admin/usersActivityLog">Log Management</Link>
                    </li>

                    <li className="nav-item">
                        <Link className="nav-link" to="/admin/feedbacks">Feedback Management</Link>
                    </li>
                </ul>

                {/*<button className="btn btn-outline-light btn-sm" onClick={handleLogout}>Logout</button>*/}
            </div>
        </nav>
    );
}
