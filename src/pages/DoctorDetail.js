import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

function DoctorDetail() {
    const { id } = useParams();
    const [doctor, setDoctor] = useState(null);

    useEffect(() => {
        axios.get(`http://localhost:8081/api/doctor/${id}`)
            .then(res => setDoctor(res.data))
            .catch(() => setDoctor(null));
    }, [id]);

    if (!doctor) return <div className="container">Đang tải hoặc không tìm thấy bác sĩ!</div>;

    return (
        <div className="container py-5">
            <h2>Thông tin bác sĩ</h2>
            <p><strong>Họ tên:</strong> {doctor.fullName}</p>
            <p><strong>Chuyên môn:</strong> {doctor.specialty}</p>
            <p><strong>Chức vụ:</strong> {doctor.positionTitle}</p>
            <p><strong>Mô tả:</strong> {doctor.description}</p>
        </div>
    );
}

export default DoctorDetail;
