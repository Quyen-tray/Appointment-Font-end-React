import React, { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import axios from "axios";
import { useAuth } from "../AuthContext";

function Contact() {
    const { token } = useAuth();

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [subject, setSubject] = useState("");
    const [message, setMessage] = useState("");
    const [status, setStatus] = useState(""); // hiển thị kết quả cả thành công và thất bại
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setStatus("");
        setLoading(true);
        try {
            await axios.post(
                "http://localhost:8081/api/patient/contact",
                { name, email, subject, message },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            // Hiển thị thông báo thành công dưới form giống alert
            window.alert("🎉 Rất vui vì bạn đã liên hệ với chúng tôi, chúng tôi sẽ sớm phản hồi lại bạn sau giây lát.");
            // Reset form
            setName("");
            setEmail("");
            setSubject("");
            setMessage("");
        } catch (err) {
            console.error(err);
            setStatus("❌ Gửi thất bại. Vui lòng thử lại.");
        } finally {
            setLoading(false);
        }
    };

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

                        {/* Thông tin liên hệ */}
                        <motion.div
                            className="col-xl-4 col-lg-6"
                            initial={{ opacity: 0, y: 50 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                            viewport={{ once: true }}
                        >
                            <div className="bg-light rounded h-100 p-5">
                                <div className="section-title">
                                    <h5 className="position-relative d-inline-block text-primary text-uppercase">
                                        Contact Us
                                    </h5>
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

                        {/* Form liên hệ */}
                        <motion.div
                            className="col-xl-4 col-lg-6"
                            initial={{ opacity: 0, y: 50 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                            viewport={{ once: true }}
                        >
                            <form onSubmit={handleSubmit}>
                                <div className="row g-3">
                                    <div className="col-12">
                                        <input
                                            type="text"
                                            className="form-control border-0 bg-light px-4"
                                            placeholder="Your Name"
                                            style={{ height: '55px' }}
                                            value={name}
                                            onChange={(e) => setName(e.target.value)}
                                            required
                                        />
                                    </div>
                                    <div className="col-12">
                                        <input
                                            type="email"
                                            className="form-control border-0 bg-light px-4"
                                            placeholder="Your Email"
                                            style={{ height: '55px' }}
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            required
                                        />
                                    </div>
                                    <div className="col-12">
                                        <input
                                            type="text"
                                            className="form-control border-0 bg-light px-4"
                                            placeholder="Subject"
                                            style={{ height: '55px' }}
                                            value={subject}
                                            onChange={(e) => setSubject(e.target.value)}
                                            required
                                        />
                                    </div>
                                    <div className="col-12">
                                        <textarea
                                            className="form-control border-0 bg-light px-4 py-3"
                                            rows="5"
                                            placeholder="Message"
                                            value={message}
                                            onChange={(e) => setMessage(e.target.value)}
                                            required
                                        />
                                    </div>
                                    <div className="col-12">
                                        <button
                                            className="btn btn-primary w-100 py-3"
                                            type="submit"
                                            disabled={loading}
                                        >
                                            {loading ? 'Đang gửi...' : 'Send Message'}
                                        </button>
                                    </div>
                                    {status && (
                                        <div className="col-12 text-center mt-2">
                                            <div className={`alert ${status.startsWith('🎉') ? 'alert-success' : 'alert-danger'}`} role="alert">
                                                {status}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </form>
                        </motion.div>

                        {/* Google Map */}
                        <motion.div
                            className="col-xl-4 col-lg-12"
                            initial={{ opacity: 0, y: 50 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.5 }}
                            viewport={{ once: true }}
                        >
                            <iframe
                                className="position-relative rounded w-100 h-100"
                                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3023.9647658810283!2d-74.0060!3d40.7128!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xxxxx!2sNew%20York!5e0!3m2!1sen!2sus!4v0000000000000"
                                frameBorder="0"
                                style={{ minHeight: '400px', border: '0' }}
                                allowFullScreen=""
                                aria-hidden="false"
                                tabIndex="0"
                                title="Google Maps"
                            />
                        </motion.div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default Contact;
