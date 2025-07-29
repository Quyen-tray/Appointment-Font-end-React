import { Link } from 'react-router-dom';

export default function PatientNavbar() {

    return (
        <nav className="navbar navbar-expand-lg navbar-dark bg-primary px-3">
            <Link className="navbar-brand" to="/patient">Trang chủ</Link>

            <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#patientNavbar" aria-controls="patientNavbar" aria-expanded="false" aria-label="Toggle navigation">
                <span className="navbar-toggler-icon"></span>
            </button>

            <div className="collapse navbar-collapse" id="patientNavbar">
                <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                    <li className="nav-item">

                        <Link className="nav-link" to="/patient/booking">Đặt lịch khám</Link>
                    </li>

                    <li className="nav-item">
                        <Link className="nav-link" to="/patient/appointments/history">Lịch sử hẹn khám</Link>
                    </li>

                    <li className="nav-item">
                        <Link className="nav-link" to="/patient/medicalvisit">lịch sử khám bệnh</Link>
                    </li>

                    <li className="nav-item">
                        <Link className="nav-link" to="/patient/feedback">Đánh Giá</Link>
                    </li>

                    <li className="nav-item">
                        <Link className="nav-link" to="/patient/feedback/submit">Gửi Đánh giá</Link>
                    </li>

                    <li className="nav-item">
                        <Link className="nav-link" to="/patient/invoice">Xem hóa đơn</Link>
                    </li>

                    <li className="nav-item">
                        <Link className="nav-link" to="/patient/payments">
                            <i className="fas fa-credit-card me-2"></i>
                            Thanh toán
                        </Link>
                    </li>

                    <li className="nav-item">
                        <Link className="nav-link" to="/patient/profile">Hồ sơ</Link>
                    </li>
                </ul>

                {/*<button className="btn btn-outline-light btn-sm" onClick={handleLogout}>*/}
                {/*    Logout*/}
                {/*</button>*/}
            </div>
        </nav>
    );
}
