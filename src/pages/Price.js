import React from "react";
import { Link } from "react-router-dom";
import Slider from "react-slick";
import { motion } from "framer-motion";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

import price1 from "../assets/img/price-1.jpg";
import price2 from "../assets/img/price-2.jpg";
import price3 from "../assets/img/price-3.jpg";

function Price() {
    const settings = {
        dots: true,
        infinite: true,
        speed: 600,
        slidesToShow: 2,
        slidesToScroll: 1,
        responsive: [
            { breakpoint: 992, settings: { slidesToShow: 1 } }
        ]
    };

    const priceData = [
        {
            img: price1,
            title: "Làm trắng răng",
            price: "$35"
        },
        {
            img: price2,
            title: "Cấy ghép răng",
            price: "$49"
        },
        {
            img: price3,
            title: "Kênh gốc",
            price: "$99"
        }
    ];

    return (
        <>
            {/* Hero Start */}
            <div className="container-fluid bg-primary py-5 hero-header mb-5">
                <div className="row py-3">
                    <div className="col-12 text-center">
                        <h1 className="display-3 text-white animated zoomIn">Gói Dịch Vụ</h1>
                        <Link to="/" className="h4 text-white">Trang chủ</Link>
                        <i className="far fa-circle text-white px-2"></i>
                        <Link to="/price" className="h4 text-white">Giá cả</Link>
                    </div>
                </div>
            </div>
            {/* Hero End */}

            {/* Pricing Start */}
            <div className="container-fluid py-5">
                <div className="container">
                    <div className="row g-5">
                        <motion.div
                            className="col-lg-5"
                            initial={{ opacity: 0, x: -50 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.6 }}
                            viewport={{ once: true }}
                        >
                            <div className="section-title mb-4">
                                <h5 className="position-relative d-inline-block text-primary text-uppercase">Kế hoạch giá</h5>
                                <h1 className="display-5 mb-0">Chúng tôi cung cấp giá cả hợp lý cho điều trị nha khoa</h1>
                            </div>
                            <h5 className="text-uppercase text-primary">LIÊN HỆ TRỰC TIẾP</h5>
                            <h1>+012 345 6789</h1>
                        </motion.div>

                        <motion.div
                            className="col-lg-7"
                            initial={{ opacity: 0, x: 50 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.6 }}
                            viewport={{ once: true }}
                        >
                            <Slider {...settings}>
                                {priceData.map((item, index) => (
                                    <div key={index} className="price-item pb-4">
                                        <div className="position-relative">
                                            <img className="img-fluid rounded-top" src={item.img} alt={item.title} />
                                            <div className="d-flex align-items-center justify-content-center bg-light rounded pt-2 px-3 position-absolute top-100 start-50 translate-middle" style={{ zIndex: 2 }}>
                                                <h2 className="text-primary m-0">{item.price}</h2>
                                            </div>
                                        </div>
                                        <div className="position-relative text-center bg-light border-bottom border-primary py-5 p-4">
                                            <h4>{item.title}</h4>
                                            <hr className="text-primary w-50 mx-auto mt-0" />
                                            <div className="d-flex justify-content-between mb-3"><span>Thiết bị hiện đại</span><i className="fa fa-check text-primary pt-1"></i></div>
                                            <div className="d-flex justify-content-between mb-3"><span>Bác sĩ nha khoa chuyên nghiệp</span><i className="fa fa-check text-primary pt-1"></i></div>
                                            <div className="d-flex justify-content-between mb-2"><span>Hỗ trợ cuộc gọi 24/7</span><i className="fa fa-check text-primary pt-1"></i></div>
                                            <Link to="/appointment" className="btn btn-primary py-2 px-4 position-absolute top-100 start-50 translate-middle">Đặt lịch</Link>
                                        </div>
                                    </div>
                                ))}
                            </Slider>
                        </motion.div>
                    </div>
                </div>
            </div>
            {/* Pricing End */}

            {/* Newsletter Start */}
            <div className="container-fluid position-relative pt-5" style={{ zIndex: 1 }}>
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
            </div>
            {/* Newsletter End */}

            {/* Back to Top */}
            {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
            <a href="#" className="btn btn-lg btn-primary btn-lg-square rounded back-to-top">
                <i className="bi bi-arrow-up"></i>
            </a>
        </>
    );
}

export default Price;
