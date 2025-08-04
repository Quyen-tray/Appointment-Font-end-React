
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

function Footer() {
    return (
        <>

            <motion.div
                className="container-fluid bg-dark text-light py-5"
                style={{ marginTop: '75px' }}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                viewport={{ once: true }}
            >
                <div className="container pt-5">
                    <div className="row g-5 pt-4">
                        <div className="col-lg-3 col-md-6">
                            <h3 className="text-white mb-4">Truy cập ngay</h3>
                            <div className="d-flex flex-column justify-content-start">
                                <Link className="text-light mb-2" to="#"><i
                                    className="bi bi-arrow-right text-primary me-2"></i>Trang Chủ</Link>
                                <Link className="text-light mb-2" to="#"><i
                                    className="bi bi-arrow-right text-primary me-2"></i>Về chúng tôi</Link>
                                <Link className="text-light" to="#"><i className="bi bi-arrow-right text-primary me-2"></i>Liên hệ với chúng tôi</Link>
                            </div>
                        </div>
                        {/* <div className="col-lg-3 col-md-6">
                        <h3 className="text-white mb-4">Popular Links</h3>
                        <div className="d-flex flex-column justify-content-start">
                            <Link className="text-light mb-2" to="#"><i
                                className="bi bi-arrow-right text-primary me-2"></i>Home</Link>
                            <Link className="text-light mb-2" to="#"><i
                                className="bi bi-arrow-right text-primary me-2"></i>About Us</Link>
                            <Link className="text-light mb-2" to="#"><i
                                className="bi bi-arrow-right text-primary me-2"></i>Our Services</Link>
                            <Link className="text-light mb-2" to="#"><i
                                className="bi bi-arrow-right text-primary me-2"></i>Latest Blog</Link>
                            <Link className="text-light" to="#"><i className="bi bi-arrow-right text-primary me-2"></i>Contact
                                Us</Link>
                        </div>
                    </div> */}
                        <div className="col-lg-3 col-md-6">
                            <h3 className="text-white mb-4">Get In Touch</h3>
                            <p className="mb-2"><i className="bi bi-geo-alt text-primary me-2"></i>Đại học FPT, Hà Nội
                            </p>
                            <p className="mb-2"><i className="bi bi-envelope-open text-primary me-2"></i>nhom1@gmail.com
                            </p>
                            <p className="mb-0"><i className="bi bi-telephone text-primary me-2"></i>+84 969 222 666</p>
                        </div>
                        <div className="col-lg-3 col-md-6">
                            <h3 className="text-white mb-4"></h3>
                            <div className="d-flex">
                                <Link className="btn btn-lg btn-primary btn-lg-square rounded me-2" to="#">
                                    <i className="bi bi-twitter fw-normal"></i>
                                </Link>
                                <Link className="btn btn-lg btn-primary btn-lg-square rounded me-2" to="#">
                                    <i className="bi bi-facebook fw-normal"></i>
                                </Link>
                                <Link className="btn btn-lg btn-primary btn-lg-square rounded me-2" to="#">
                                    <i className="bi bi-linkedin fw-normal"></i>
                                </Link>
                                <Link className="btn btn-lg btn-primary btn-lg-square rounded" to="#">
                                    <i className="bi bi-instagram fw-normal"></i>
                                </Link>
                            </div>
                        </div>

                    </div>
                </div>
            </motion.div>
            <div className="container-fluid text-light py-4" style={{ background: '#051225' }}>
                <div className="container">
                    <div className="row g-0">
                        <div className="col-md-6 text-center text-md-start">
                            <p className="mb-md-0">&copy; <Link className="text-white border-bottom" to="#">Nhóm 1</Link></p>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default Footer;
