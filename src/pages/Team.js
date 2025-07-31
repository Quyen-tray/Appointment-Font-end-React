import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

// ✅ Import đúng đường dẫn ảnh từ src/assets/img/
import img1 from '../assets/img/team-1.jpg';
import img2 from '../assets/img/team-2.jpg';
import img3 from '../assets/img/team-3.jpg';
import img4 from '../assets/img/team-4.jpg';
import img5 from '../assets/img/team-5.jpg';

function Team() {
    const [doctors, setDoctors] = useState([]);

    const doctorImages = [img1, img2, img3, img4, img5];

    useEffect(() => {
        axios.get("http://localhost:8081/api/doctor/list-doctor")
            .then(res => setDoctors(res.data))
            .catch(err => console.error("Lỗi lấy danh sách bác sĩ", err));
    }, []);

    return (
        <>
            {/* Hero Start */}
            <div className="container-fluid bg-primary py-5 hero-header mb-5">
                <div className="row py-3">
                    <div className="col-12 text-center">
                        <h1 className="display-3 text-white">Nha Sĩ</h1>
                        <Link to="/" className="h4 text-white">Trang chủ</Link>
                        <i className="far fa-circle text-white px-2"></i>
                        <Link to="/team" className="h4 text-white">Nha Sĩ</Link>
                    </div>
                </div>
            </div>
            {/* Hero End */}

            {/* Team Start */}
            <div className="container-fluid py-5">
                <div className="container">
                    <div className="row g-5">
                        {/* Section Title */}
                        <div className="col-lg-4">
                            <div className="section-title bg-light rounded h-100 p-5">
                                <h5 className="position-relative d-inline-block text-primary text-uppercase">Nha sĩ của chúng tôi</h5>
                                <h1 className="display-6 mb-4">Gặp gỡ nha sĩ được chứng nhận và giàu kinh nghiệm của chúng tôi</h1>
                                <Link to="/appointment" className="btn btn-primary py-3 px-5">Đặt lịch</Link>
                            </div>
                        </div>

                        {/* Danh sách bác sĩ */}
                        {doctors.map((doc, index) => (
                            <div className="col-lg-4" key={doc.id}>
                                <DentistCard
                                    id={doc.id}
                                    fullName={doc.fullName}
                                    image={doctorImages[index % doctorImages.length]}
                                />
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </>
    );
}

function DentistCard({ id, fullName, image }) {
    return (
        <div className="team-item">
            <Link to={`/doctor/${id}`}>
                <div className="position-relative rounded-top" style={{ zIndex: "1" }}>
                    <img className="img-fluid rounded-top w-100" src={image} alt={fullName} />
                </div>
                <div className="team-text position-relative bg-light text-center rounded-bottom p-4 pt-5">
                    <h4 className="mb-2">{fullName}</h4>
                    <p className="text-primary mb-0">Xem chi tiết</p>
                </div>
            </Link>
        </div>
    );
}

export default Team;
