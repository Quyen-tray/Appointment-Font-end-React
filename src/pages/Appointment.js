import React, { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import axios from "axios";
import { useEffect } from "react";
import { setHours, setMinutes } from "date-fns";

function Appointment() {
    const [appointmentDate, setAppointmentDate] = useState(null);
    const [appointmentTime, setAppointmentTime] = useState(null);
    const [selectedDoctorId, setSelectedDoctorId] = useState("");
    const [doctorList, setDoctorList] = useState([]);
    const [patientProfile, setPatientProfile] = useState({
        fullName: "",
        email: ""
    });
    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log("appointmentDate", appointmentDate);
        console.log("appointmentTime", appointmentTime);
        if (!selectedDoctorId) {
            alert("Vui lòng chọn bác sĩ!");
            return;
        }
        if (!appointmentDate) {
            alert("Vui lòng chọn ngày hẹn!");
            return;
        }
        if (!appointmentTime) {
            alert("Vui lòng chọn giờ hẹn!");
            return;
        }
        try {
            const scheduledTime = new Date(
                appointmentDate.getFullYear(),
                appointmentDate.getMonth(),
                appointmentDate.getDate(),
                appointmentTime.getHours(),
                appointmentTime.getMinutes()
            );
            scheduledTime.setHours(scheduledTime.getHours() + 7);

            // rồi gửi ISO
            const isoTime = scheduledTime.toISOString();
            const requestData = {
                doctorId: selectedDoctorId,
                scheduledTime: isoTime
            };

            const res = await axios.post("http://localhost:8081/api/patient/appointments", requestData, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`
                }
            });

            alert(res.data);
        } catch (error) {
            console.error(error);
            alert(error.response?.data || "Đặt lịch thất bại");
        }

    }

    useEffect(() => {
        const fetchDoctors = async () => {
            try {
                const res = await axios.get("http://localhost:8081/api/doctor/list-doctor", {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`
                    }
                });
                setDoctorList(res.data);
            } catch (err) {
                console.error(err);
            }
        };
        fetchDoctors();
    }, []);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const res = await axios.get("http://localhost:8081/api/patient/profile", {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`
                    }
                });
                setPatientProfile({
                    fullName: res.data.fullName,
                    email: res.data.email
                });
            } catch (err) {
                console.error(err);
            }
        };
        fetchProfile();
    }, []);
    const handleTimeChange = (time) => {
        if (time && appointmentDate) {
            const newDateTime = new Date(
                appointmentDate.getFullYear(),
                appointmentDate.getMonth(),
                appointmentDate.getDate(),
                time.getHours(),
                time.getMinutes()
            );
            setAppointmentTime(newDateTime);
        }
    };

    return (
        <>
            {/* Hero Start */}
            <div className="container-fluid bg-primary py-5 hero-header mb-5">
                <div className="row py-3">
                    <div className="col-12 text-center">
                        <h1 className="display-3 text-white">Appointment</h1>
                        <Link to="/" className="h4 text-white">Home</Link>
                        <i className="far fa-circle text-white px-2"></i>
                        <Link to="/appointment" className="h4 text-white">Appointment</Link>
                    </div>
                </div>
            </div>
            {/* Hero End */}

            {/* Appointment Start */}
            <motion.div
                className="container-fluid bg-primary bg-appointment mb-5"
                style={{ marginTop: '90px' }}
                initial={{ opacity: 0, y: 60 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                viewport={{ once: true }}
            >
                <div className="container">
                    <div className="row gx-5">
                        <div className="col-lg-6 py-5">
                            <div className="py-5">
                                <h1 className="display-5 text-white mb-4">
                                    We Are A Certified and Award Winning Dental Clinic You Can Trust
                                </h1>
                                <p className="text-white mb-0">
                                    Eirmod sed tempor lorem ut dolores. Aliquyam sit sadipscing kasd ipsum...
                                </p>
                            </div>
                        </div>

                        <motion.div
                            className="col-lg-6"
                            initial={{ opacity: 0, scale: 0.95 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.6 }}
                            viewport={{ once: true }}
                        >
                            <div className="appointment-form h-100 d-flex flex-column justify-content-center text-center p-5">
                                <h1 className="text-white mb-4">Make Appointment</h1>
                                <form onSubmit={handleSubmit}>
                                    <div className="row g-3">
                                        {/* <div className="col-12 col-sm-6">
                                            <select className="form-select bg-light border-0" style={{ height: '55px' }} defaultValue="1">
                                                <option value="1">Chọn dịch vụ</option>
                                                <option value="2">Service 1</option>
                                                <option value="3">Service 2</option>
                                                <option value="4">Service 3</option>
                                            </select>
                                        </div> */}
                                        <div className="col-12 col-sm-6">
                                            <select className="form-select bg-light border-0" value={selectedDoctorId} onChange={(e) => setSelectedDoctorId(e.target.value)} style={{ height: '55px' }}>
                                                <option value="">Chọn bác sĩ</option>
                                                {doctorList.map((doc) => (<option key={doc.id} value={doc.id}>{doc.fullName}</option>))}
                                            </select>
                                        </div>
                                        <div className="col-12 col-sm-6">
                                            <input type="text" className="form-control bg-light border-0" placeholder="Họ và tên" value={patientProfile.fullName} readOnly style={{ height: '55px' }} />
                                        </div>
                                        <div className="col-12 col-sm-6">
                                            <input type="email" className="form-control bg-light border-0" placeholder="Email" value={patientProfile.email} readOnly style={{ height: '55px' }} />
                                        </div>
                                        <div className="col-12 col-sm-6">
                                            <DatePicker
                                                selected={appointmentDate}
                                                onChange={(date) => setAppointmentDate(date)}
                                                placeholderText="Chọn ngày"
                                                className="form-control bg-light border-0"
                                                dateFormat="dd/MM/yyyy"
                                            />
                                        </div>
                                        <div className="col-12 col-sm-6">
                                            <DatePicker
                                                selected={appointmentTime}
                                                onChange={handleTimeChange}
                                                placeholderText="Chọn giờ"
                                                className="form-control bg-light border-0"
                                                showTimeSelect
                                                showTimeSelectOnly
                                                timeIntervals={30}
                                                minTime={setHours(setMinutes(new Date(), 30), 6)}
                                                maxTime={setHours(setMinutes(new Date(), 0), 18)}
                                                timeCaption="Time"
                                                dateFormat="h:mm aa"
                                            />
                                        </div>
                                        <div className="col-12">
                                            <button className="btn btn-dark w-100 py-3" type="submit">Tạo lịch hẹn</button>
                                        </div>
                                    </div>
                                </form>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </motion.div>
            {/* Appointment End */}

            {/* Newsletter Start */}
            <motion.div
                className="container-fluid position-relative pt-5"
                style={{ zIndex: '1' }}
                initial={{ opacity: 0, y: 60 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                viewport={{ once: true }}
            >
                <div className="container">
                    <div className="bg-primary p-5">
                        <form className="mx-auto" style={{ maxWidth: '600px' }}>
                            <div className="input-group">
                                <input type="text" className="form-control border-white p-3" placeholder="Your Email" />
                                <button className="btn btn-dark px-4">Sign Up</button>
                            </div>
                        </form>
                    </div>
                </div>
            </motion.div>
            {/* Newsletter End */}

            {/* Back to Top */}
            {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
            <a href="#" className="btn btn-lg btn-primary btn-lg-square rounded back-to-top">
                <i className="bi bi-arrow-up"></i>
            </a>
        </>
    );
}

export default Appointment;
