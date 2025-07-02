import React, { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

function Appointment() {
    const [appointmentDate, setAppointmentDate] = useState(null);
    const [appointmentTime, setAppointmentTime] = useState(null);

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
                                <form>
                                    <div className="row g-3">
                                        <div className="col-12 col-sm-6">
                                            <select className="form-select bg-light border-0" style={{ height: '55px' }} defaultValue="1">
                                                <option value="1">Select A Service</option>
                                                <option value="2">Service 1</option>
                                                <option value="3">Service 2</option>
                                                <option value="4">Service 3</option>
                                            </select>
                                        </div>
                                        <div className="col-12 col-sm-6">
                                            <select className="form-select bg-light border-0" style={{ height: '55px' }} defaultValue="1">
                                                <option value="1">Select Doctor</option>
                                                <option value="2">Doctor 1</option>
                                                <option value="3">Doctor 2</option>
                                                <option value="4">Doctor 3</option>
                                            </select>
                                        </div>
                                        <div className="col-12 col-sm-6">
                                            <input type="text" className="form-control bg-light border-0" placeholder="Your Name" style={{ height: '55px' }} />
                                        </div>
                                        <div className="col-12 col-sm-6">
                                            <input type="email" className="form-control bg-light border-0" placeholder="Your Email" style={{ height: '55px' }} />
                                        </div>
                                        <div className="col-12 col-sm-6">
                                            <DatePicker
                                                selected={appointmentDate}
                                                onChange={(date) => setAppointmentDate(date)}
                                                placeholderText="Appointment Date"
                                                className="form-control bg-light border-0"
                                                dateFormat="dd/MM/yyyy"
                                            />
                                        </div>
                                        <div className="col-12 col-sm-6">
                                            <DatePicker
                                                selected={appointmentTime}
                                                onChange={(time) => setAppointmentTime(time)}
                                                placeholderText="Appointment Time"
                                                className="form-control bg-light border-0"
                                                showTimeSelect
                                                showTimeSelectOnly
                                                timeIntervals={30}
                                                timeCaption="Time"
                                                dateFormat="h:mm aa"
                                            />
                                        </div>
                                        <div className="col-12">
                                            <button className="btn btn-dark w-100 py-3" type="submit">Make Appointment</button>
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
