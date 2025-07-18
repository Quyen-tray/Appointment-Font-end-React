import React from 'react';
import backgroundImage from '../../assets/img/thiet-ke-quay-le-tan-khach-san-02-decox.jpg';

export default function ReceptionistDashboard() {
    return (
        <div
            style={{
                backgroundImage: `url(${backgroundImage})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                minHeight: '100vh',
                paddingTop: '60px', 
            }}
        >
            <div className="container mt-4" style={{ backgroundColor: 'rgba(255, 255, 255, 0.85)', borderRadius: '12px', padding: '20px' }}>
                <h2 className="mb-4">Thống kê hôm nay</h2>
                <div className="row">
                    <div className="col-md-4 mb-3">
                        <div className="card text-white bg-primary shadow">
                            <div className="card-body">
                                <h5 className="card-title">Bệnh nhân</h5>
                                <p className="card-text">12 bệnh nhân đã đăng ký hôm nay</p>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-4 mb-3">
                        <div className="card text-white bg-success shadow">
                            <div className="card-body">
                                <h5 className="card-title">Lịch hẹn</h5>
                                <p className="card-text">8 lịch hẹn đang chờ xử lý</p>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-4 mb-3">
                        <div className="card text-white bg-warning shadow">
                            <div className="card-body">
                                <h5 className="card-title">Bác sĩ</h5>
                                <p className="card-text">6 bác sĩ đang làm việc hôm nay</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
