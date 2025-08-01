import React from 'react';
import { Link } from 'react-router-dom';

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
                        <Link className="nav-link" to="/admin/adminHome">Home Admin</Link>
                    </li>

                    <li className="nav-item">
                        <Link className="nav-link" to="/admin/usersAccount">Quản Lý Tài Khoản</Link>
                    </li>

                    <li className="nav-item">
                        <Link className="nav-link" to="/admin/usersPatient">Quản Lý Bệnh Nhân</Link>
                    </li>

                    <li className="nav-item">
                        <Link className="nav-link" to="/admin/usersReceptionist">Quản Lý Lễ Tân</Link>
                    </li>

                    <li className="nav-item">
                        <Link className="nav-link" to="/admin/usersActivityLog"> Lịch Sử Truy Cập API</Link>
                    </li>

                    <li className="nav-item">
                        <Link className="nav-link" to="/admin/loginAuditPage"> Lịch sử đăng nhập</Link>
                    </li>

                </ul>

            </div>
        </nav>
    );
}
