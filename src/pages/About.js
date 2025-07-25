import React from "react";
import { Link } from "react-router-dom";
import aboutImg from '../assets/img/about.jpg';
import { motion } from "framer-motion";

function About() {
    return (
        <>
            {/* Hero Start */}
            <div className="container-fluid bg-primary py-5 hero-header mb-5">
                <div className="row py-3">
                    <div className="col-12 text-center">
                        <h1 className="display-3 text-white">Chúng tôi</h1>
                        <Link to="/" className="h4 text-white">Trang chủ</Link>
                        <i className="far fa-circle text-white px-2"></i>
                        <Link to="/about" className="h4 text-white">Chúng tôi</Link>
                    </div>
                </div>
            </div>
            {/* Hero End */}

            {/* About Start */}
            <motion.div
                className="container-fluid py-5"
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.1 }}
                viewport={{ once: true }}
            >
                <div className="container">
                    <div className="row g-5">
                        <div className="col-lg-7">
                            <div className="section-title mb-4">
                                <h5 className="position-relative d-inline-block text-primary text-uppercase">Chúng tôi</h5>
                                <h1 className="display-5 mb-0">Phòng khám nha khoa tốt nhất thế giới mà bạn có thể tin tưởng</h1>
                            </div>
                            <h4 className="text-body fst-italic mb-4">Chăm sóc toàn diện...</h4>
                            <p className="mb-4">Tận tâm từng phút, vững bước cùng bạn!</p>
                            <div className="row g-3">
                                <motion.div
                                    className="col-sm-6"
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    whileInView={{ opacity: 1, scale: 1 }}
                                    transition={{ delay: 0.3, duration: 0.5 }}
                                    viewport={{ once: true }}
                                >
                                    <h5 className="mb-3"><i className="fa fa-check-circle text-primary me-3"></i>Giải thưởng đạt được</h5>
                                    <h5 className="mb-3"><i className="fa fa-check-circle text-primary me-3"></i>Đội ngũ chuyên nghiệp</h5>
                                </motion.div>

                                <motion.div
                                    className="col-sm-6"
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    whileInView={{ opacity: 1, scale: 1 }}
                                    transition={{ delay: 0.6, duration: 0.5 }}
                                    viewport={{ once: true }}
                                >
                                    <h5 className="mb-3"><i className="fa fa-check-circle text-primary me-3"></i>Mở cửa 24/7</h5>
                                    <h5 className="mb-3"><i className="fa fa-check-circle text-primary me-3"></i>Giá cả hợp lý</h5>
                                </motion.div>
                            </div>

                            <motion.div
                                initial={{ opacity: 0, scale: 0.9 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                transition={{ delay: 0.6 }}
                                viewport={{ once: true }}
                            >
                                <Link to="/appointment" className="btn btn-primary py-3 px-5 mt-4">Đặt lịch</Link>
                            </motion.div>
                        </div>

                        <motion.div
                            className="col-lg-5"
                            style={{ minHeight: '500px' }}
                            initial={{ opacity: 0, scale: 0.95 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.9 }}
                            viewport={{ once: true }}
                        >
                            <div className="position-relative h-100">
                                <img className="position-absolute w-100 h-100 rounded" src={aboutImg} style={{ objectFit: 'cover' }} alt="about" />
                            </div>
                        </motion.div>
                    </div>
                </div>
            </motion.div>
            {/* About End */}

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
                                <input type="text" className="form-control border-white p-3" placeholder="Email" />
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

export default About;
