import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

function Contact() {
    return (
        <>
            {/* Hero Start */}
            <div className="container-fluid bg-primary py-5 hero-header mb-5">
                <div className="row py-3">
                    <div className="col-12 text-center">
                        <h1 className="display-3 text-white">Contact Us</h1>
                        <Link to="/" className="h4 text-white">Home</Link>
                        <i className="far fa-circle text-white px-2"></i>
                        <Link to="/contact" className="h4 text-white">Contact</Link>
                    </div>
                </div>
            </div>
            {/* Hero End */}

            {/* Contact Start */}
            <div className="container-fluid py-5">
                <div className="container">
                    <div className="row g-5">
                        <motion.div
                            className="col-xl-4 col-lg-6"
                            initial={{ opacity: 0, y: 50 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                            viewport={{ once: true }}
                        >
                            <div className="bg-light rounded h-100 p-5">
                                <div className="section-title">
                                    <h5 className="position-relative d-inline-block text-primary text-uppercase">Contact Us</h5>
                                    <h1 className="display-6 mb-4">Feel Free To Contact Us</h1>
                                </div>
                                <div className="d-flex align-items-center mb-2">
                                    <i className="bi bi-geo-alt fs-1 text-primary me-3"></i>
                                    <div className="text-start">
                                        <h5 className="mb-0">Our Office</h5>
                                        <span>123 Street, New York, USA</span>
                                    </div>
                                </div>
                                <div className="d-flex align-items-center mb-2">
                                    <i className="bi bi-envelope-open fs-1 text-primary me-3"></i>
                                    <div className="text-start">
                                        <h5 className="mb-0">Email Us</h5>
                                        <span>info@example.com</span>
                                    </div>
                                </div>
                                <div className="d-flex align-items-center">
                                    <i className="bi bi-phone-vibrate fs-1 text-primary me-3"></i>
                                    <div className="text-start">
                                        <h5 className="mb-0">Call Us</h5>
                                        <span>+012 345 6789</span>
                                    </div>
                                </div>
                            </div>
                        </motion.div>

                        <motion.div
                            className="col-xl-4 col-lg-6"
                            initial={{ opacity: 0, y: 50 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                            viewport={{ once: true }}
                        >
                            <form>
                                <div className="row g-3">
                                    <div className="col-12">
                                        <input type="text" className="form-control border-0 bg-light px-4" placeholder="Your Name" style={{ height: '55px' }} />
                                    </div>
                                    <div className="col-12">
                                        <input type="email" className="form-control border-0 bg-light px-4" placeholder="Your Email" style={{ height: '55px' }} />
                                    </div>
                                    <div className="col-12">
                                        <input type="text" className="form-control border-0 bg-light px-4" placeholder="Subject" style={{ height: '55px' }} />
                                    </div>
                                    <div className="col-12">
                                        <textarea className="form-control border-0 bg-light px-4 py-3" rows="5" placeholder="Message"></textarea>
                                    </div>
                                    <div className="col-12">
                                        <button className="btn btn-primary w-100 py-3" type="submit">Send Message</button>
                                    </div>
                                </div>
                            </form>
                        </motion.div>

                        <motion.div
                            className="col-xl-4 col-lg-12"
                            initial={{ opacity: 0, y: 50 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.6 }}
                            viewport={{ once: true }}
                        >
                            <iframe
                                className="position-relative rounded w-100 h-100"
                                src="https://www.google.com/maps/embed?pb=..."
                                frameBorder="0"
                                style={{ minHeight: '400px', border: '0' }}
                                allowFullScreen
                                aria-hidden="false"
                                tabIndex="0"
                                title="Google Maps"
                            ></iframe>
                        </motion.div>
                    </div>
                </div>
            </div>
            {/* Contact End */}

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

export default Contact;
