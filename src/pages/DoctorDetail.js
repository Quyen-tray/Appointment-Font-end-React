import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";


import team1 from '../assets/img/team-1.jpg';
import team2 from '../assets/img/team-2.jpg';
import team3 from '../assets/img/team-3.jpg';
import team4 from '../assets/img/team-4.jpg';
import team5 from '../assets/img/team-5.jpg';
import team6 from '../assets/img/team-6.jpg';


const doctorImageMap = {
    "b1e6b2c2-1111-4a4b-aaaa-123456789001": team1,
    "b1e6b2c2-1111-4a4b-aaaa-123456789002": team2,
    "b1e6b2c2-1111-4a4b-aaaa-123456789003": team3,
    "b1e6b2c2-1111-4a4b-aaaa-123456789004": team4,
    "b1e6b2c2-1111-4a4b-aaaa-123456789005": team5,
    "b1e6b2c2-1111-4a4b-aaaa-123456789006": team6,
};

function DoctorDetail() {
    const { id } = useParams();
    const [doctor, setDoctor] = useState(null);

    useEffect(() => {
        axios.get(`http://localhost:8081/api/doctor/${id}`)
            .then(res => setDoctor(res.data))
            .catch(() => setDoctor(null));
    }, [id]);

    if (!doctor) return <div className="container">Đang tải hoặc không tìm thấy bác sĩ!</div>;

   
    const imageSrc = doctorImageMap[doctor.id] || team1;

    return (
        <div className="container py-5">
            <h2>Thông tin bác sĩ</h2>
            <img
                src={imageSrc}
                alt="Ảnh bác sĩ"
                style={{ width: "300px", borderRadius: "10px", marginBottom: "20px" }}
            />
            <p><strong>Họ tên:</strong> {doctor.fullName}</p>
            <p><strong>Chuyên môn:</strong> {doctor.specialty}</p>
            <p><strong>Chức vụ:</strong> {doctor.positionTitle}</p>
            <p><strong>Mô tả:</strong> {doctor.description}</p>
        </div>
    );
}

export default DoctorDetail;
