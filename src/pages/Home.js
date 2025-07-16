//
// import React, { useEffect } from "react";
// import WOW from "wowjs";

import carousel1 from "../assets/img/carousel-1.jpg";
import carousel2 from "../assets/img/carousel-2.jpg";
import aboutImg from '../assets/img/about.jpg';
import {Link} from "react-router-dom";
import beforeImage from "../assets/img/before.jpg";
import afterImage from "../assets/img/after.jpg";
import service1 from "../assets/img/service-1.jpg";
import service2 from "../assets/img/service-2.jpg";
import service3 from "../assets/img/service-3.jpg";
import service4 from "../assets/img/service-4.jpg";
import price1 from "../assets/img/price-1.jpg";
import price2 from "../assets/img/price-2.jpg";
import price3 from "../assets/img/price-3.jpg";
import testimonial1 from "../assets/img/testimonial-1.jpg";
import testimonial2 from "../assets/img/testimonial-2.jpg";
import team1 from "../assets/img/team-1.jpg";
import team2 from "../assets/img/team-2.jpg";
import team3 from "../assets/img/team-3.jpg";
import team4 from "../assets/img/team-4.jpg";
import team5 from "../assets/img/team-5.jpg";
import {motion} from "framer-motion";
import React, {useState} from "react";
import DatePicker from "react-datepicker";
import CompareImage from "react-compare-image";
import Slider from "react-slick";

function ServiceItem({ img, title }) {
    return (
        <div className="col-md-6 service-item">
            <div className="rounded-top overflow-hidden">
                <img className="img-fluid" src={img} alt={title} />
            </div>
            <div className="position-relative bg-light rounded-bottom text-center p-4">
                <h5 className="m-0">{title}</h5>
            </div>
        </div>
    );
}

function Home() {
    const [appointmentDate, setAppointmentDate] = useState(null);
    const [appointmentTime, setAppointmentTime] = useState(null);

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
            title: "Teeth Whitening",
            price: "$35"
        },
        {
            img: price2,
            title: "Dental Implant",
            price: "$49"
        },
        {
            img: price3,
            title: "Root Canal",
            price: "$99"
        }
    ];

    const teamData = [
        { img: team1, name: "Dr. John Doe", title: "Implant Surgeon" },
        { img: team2, name: "Dr. Sarah Smith", title: "Orthodontist" },
        { img: team3, name: "Dr. Lisa Nguyen", title: "Cosmetic Dentist" },
        { img: team4, name: "Dr. James Lee", title: "Pediatric Dentist" },
        { img: team5, name: "Dr. Emily Brown", title: "Periodontist" },
    ];

    // Nếu có nhiều đánh giá hơn sau này, dễ mở rộng
    const testimonials = [
        {
            image: testimonial1,
            text: "Dolores sed duo clita justo dolor et stet lorem kasd dolore lorem ipsum. At lorem lorem magna ut et, nonumy labore diam erat. Erat dolor rebum sit ipsum.",
            name: "Client One",
        },
        {
            image: testimonial2,
            text: "Dolores sed duo clita justo dolor et stet lorem kasd dolore lorem ipsum. At lorem lorem magna ut et, nonumy labore diam erat. Erat dolor rebum sit ipsum.",
            name: "Client Two",
        },
    ];
  return (
    <>
        {/* Carousel Start */}
        <div className="container-fluid p-0">
            <div id="header-carousel" className="carousel slide carousel-fade" data-bs-ride="carousel">
                <div className="carousel-inner">
                    <div className="carousel-item active">
                        <img className="w-100" src={carousel1} alt="carousel1" />
                        <div className="carousel-caption d-flex flex-column align-items-center justify-content-center">
                            <motion.div
                                className="p-3"
                                style={{ maxWidth: "900px" }}
                                initial={{ opacity: 0, y: -50 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.8 }}
                            >
                                <h5 className="text-white text-uppercase mb-3">Keep Your Teeth Healthy</h5>
                                <h1 className="display-1 text-white mb-md-4">Take The Best Quality Dental Treatment</h1>
                                <Link to="/appointment" className="btn btn-primary py-md-3 px-md-5 me-3">Appointment</Link>
                                <Link to="/contact" className="btn btn-secondary py-md-3 px-md-5">Contact Us</Link>
                            </motion.div>
                        </div>
                    </div>
                    <div className="carousel-item">
                        <img className="w-100" src={carousel2} alt="carousel2" />
                        <div className="carousel-caption d-flex flex-column align-items-center justify-content-center">
                            <motion.div
                                className="p-3"
                                style={{ maxWidth: "900px" }}
                                initial={{ opacity: 0, y: -50 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.8, delay: 0.2 }}
                            >
                                <h5 className="text-white text-uppercase mb-3">Keep Your Teeth Healthy</h5>
                                <h1 className="display-1 text-white mb-md-4">Take The Best Quality Dental Treatment</h1>
                                <Link to="/appointment" className="btn btn-primary py-md-3 px-md-5 me-3">Appointment</Link>
                                <Link to="/contact" className="btn btn-secondary py-md-3 px-md-5">Contact Us</Link>
                            </motion.div>
                        </div>
                    </div>
                </div>
                <button className="carousel-control-prev" type="button" data-bs-target="#header-carousel" data-bs-slide="prev">
                    <span className="carousel-control-prev-icon" aria-hidden="true"></span>
                    <span className="visually-hidden">Previous</span>
                </button>
                <button className="carousel-control-next" type="button" data-bs-target="#header-carousel" data-bs-slide="next">
                    <span className="carousel-control-next-icon" aria-hidden="true"></span>
                    <span className="visually-hidden">Next</span>
                </button>
            </div>
        </div>
        {/* Carousel End */}

        {/* Banner Start */}
        <div className="container-fluid banner mb-5">
            <div className="container">
                <div className="row gx-0">
                    <div className="col-lg-4">
                        <motion.div
                            className="bg-primary d-flex flex-column p-5"
                            style={{ height: "300px" }}
                            initial={{ opacity: 0, scale: 0.9 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.5 }}
                        >
                            <h3 className="text-white mb-3">Opening Hours</h3>
                            <div className="d-flex justify-content-between text-white mb-3">
                                <h6 className="mb-0">Mon - Fri</h6>
                                <p className="mb-0">8:00am - 9:00pm</p>
                            </div>
                            <div className="d-flex justify-content-between text-white mb-3">
                                <h6 className="mb-0">Saturday</h6>
                                <p className="mb-0">8:00am - 7:00pm</p>
                            </div>
                            <div className="d-flex justify-content-between text-white mb-3">
                                <h6 className="mb-0">Sunday</h6>
                                <p className="mb-0">8:00am - 5:00pm</p>
                            </div>
                            <Link className="btn btn-light" to="/appointment">Appointment</Link>
                        </motion.div>
                    </div>

                    <div className="col-lg-4">
                        <motion.div
                            className="bg-dark d-flex flex-column p-5"
                            style={{ height: "300px" }}
                            initial={{ opacity: 0, y: 50 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.2 }}
                        >
                            <h3 className="text-white mb-3">Search A Doctor</h3>
                            <div className="date mb-3">
                                <input type="text" className="form-control bg-light border-0 datetimepicker-input" placeholder="Appointment Date" style={{ height: "40px" }} />
                            </div>
                            <select className="form-select bg-light border-0 mb-3" style={{ height: "40px" }} defaultValue="1">
                                <option value="1">Select A Service</option>
                                <option value="2">Service 1</option>
                                <option value="3">Service 2</option>
                                <option value="4">Service 3</option>
                            </select>
                            {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
                            <a className="btn btn-light" href="#">Search Doctor</a>
                        </motion.div>
                    </div>

                    <div className="col-lg-4">
                        <motion.div
                            className="bg-secondary d-flex flex-column p-5"
                            style={{ height: "300px" }}
                            initial={{ opacity: 0, x: 50 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.5, delay: 0.4 }}
                        >
                            <h3 className="text-white mb-3">Make Appointment</h3>
                            <p className="text-white">Ipsum erat ipsum dolor clita rebum no rebum dolores labore, ipsum magna at eos et eos amet.</p>
                            <h2 className="text-white mb-0">+012 345 6789</h2>
                        </motion.div>
                    </div>
                </div>
            </div>
        </div>
        {/* Banner End */}


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
                            <h5 className="position-relative d-inline-block text-primary text-uppercase">About Us</h5>
                            <h1 className="display-5 mb-0">The World's Best Dental Clinic That You Can Trust</h1>
                        </div>
                        <h4 className="text-body fst-italic mb-4">Diam dolor diam ipsum sit...</h4>
                        <p className="mb-4">Tempor erat elitr rebum at clita...</p>
                        <div className="row g-3">
                            <motion.div
                                className="col-sm-6"
                                initial={{ opacity: 0, scale: 0.9 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                transition={{ delay: 0.3, duration: 0.5 }}
                                viewport={{ once: true }}
                            >
                                <h5 className="mb-3"><i className="fa fa-check-circle text-primary me-3"></i>Award Winning</h5>
                                <h5 className="mb-3"><i className="fa fa-check-circle text-primary me-3"></i>Professional Staff</h5>
                            </motion.div>

                            <motion.div
                                className="col-sm-6"
                                initial={{ opacity: 0, scale: 0.9 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                transition={{ delay: 0.6, duration: 0.5 }}
                                viewport={{ once: true }}
                            >
                                <h5 className="mb-3"><i className="fa fa-check-circle text-primary me-3"></i>24/7 Opened</h5>
                                <h5 className="mb-3"><i className="fa fa-check-circle text-primary me-3"></i>Fair Prices</h5>
                            </motion.div>
                        </div>

                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.6 }}
                            viewport={{ once: true }}
                        >
                            <Link to="/appointment" className="btn btn-primary py-3 px-5 mt-4">Make Appointment</Link>
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


        {/* Service Start */}
        <div className="container-fluid py-5">
            <div className="container">
                <div className="row g-5 mb-5">
                    <div className="col-lg-5" style={{ minHeight: "400px" }}>
                        <div className="position-relative h-100 rounded overflow-hidden">
                            <CompareImage
                                leftImage={beforeImage}
                                rightImage={afterImage}
                                alt="Before and After"
                                sliderLineColor="#0d6efd"
                            />
                        </div>
                    </div>
                    <div className="col-lg-7">
                        <div className="section-title mb-5">
                            <h5 className="position-relative d-inline-block text-primary text-uppercase">Our Services</h5>
                            <h1 className="display-5 mb-0">We Offer The Best Quality Dental Services</h1>
                        </div>
                        <div className="row g-5">
                            <ServiceItem img={service1} title="Cosmetic Dentistry" />
                            <ServiceItem img={service2} title="Dental Implants" />
                        </div>
                    </div>
                </div>

                <div className="row g-5">
                    <div className="col-lg-7">
                        <div className="row g-5">
                            <ServiceItem img={service3} title="Dental Bridges" />
                            <ServiceItem img={service4} title="Teeth Whitening" />
                        </div>
                    </div>
                    <div className="col-lg-5">
                        <div className="position-relative bg-primary rounded h-100 d-flex flex-column align-items-center justify-content-center text-center p-4">
                            <h3 className="text-white mb-3">Make Appointment</h3>
                            <p className="text-white mb-3">Clita ipsum magna kasd rebum at ipsum amet dolor justo dolor est magna stet eirmod</p>
                            <h2 className="text-white mb-0">+012 345 6789</h2>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        {/* Service End */}


    {/*} Offer Start */}
    <div className="container-fluid bg-offer my-5 py-5 wow fadeInUp" >
        <div className="container py-5">
            <div className="row justify-content-center">
                <div className="col-lg-7 wow zoomIn" >
                    <div className="offer-text text-center rounded p-5">
                        <h1 className="display-5 text-white">Save 30% On Your First Dental Checkup</h1>
                        <p className="text-white mb-4">Eirmod sed tempor lorem ut dolores sit kasd ipsum. Dolor ea et dolore et at sea ea at dolor justo ipsum duo rebum sea. Eos vero eos vero ea et dolore eirmod diam duo lorem magna sit dolore sed et.</p>
                        <Link to="/appointment" className="btn btn-dark py-3 px-5 me-3">Appointment</Link>
                        <Link to="" className="btn btn-light py-3 px-5">Read More</Link>
                    </div>
                </div>
            </div>
        </div>
    </div>
    {/*} Offer End */}


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
                            <h5 className="position-relative d-inline-block text-primary text-uppercase">Pricing Plan</h5>
                            <h1 className="display-5 mb-0">We Offer Fair Prices for Dental Treatment</h1>
                        </div>
                        <p className="mb-4">
                            Tempor erat elitr rebum at clita. Diam dolor diam ipsum et tempor sit. Aliqu diam amet diam et eos labore.
                            Clita erat ipsum et lorem et sit, sed stet no labore lorem sit. Sanctus clita duo justo eirmod magna dolore erat amet
                        </p>
                        <h5 className="text-uppercase text-primary">Call for Appointment</h5>
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
                                        <div className="d-flex justify-content-between mb-3"><span>Modern Equipment</span><i className="fa fa-check text-primary pt-1"></i></div>
                                        <div className="d-flex justify-content-between mb-3"><span>Professional Dentist</span><i className="fa fa-check text-primary pt-1"></i></div>
                                        <div className="d-flex justify-content-between mb-2"><span>24/7 Call Support</span><i className="fa fa-check text-primary pt-1"></i></div>
                                        <Link to="/appointment" className="btn btn-primary py-2 px-4 position-absolute top-100 start-50 translate-middle">Appointment</Link>
                                    </div>
                                </div>
                            ))}
                        </Slider>
                    </motion.div>
                </div>
            </div>
        </div>
        {/* Pricing End */}


        {/* Testimonial Start */}
        <div className="container-fluid bg-primary bg-testimonial py-5 mb-5" style={{ marginTop: "90px" }}>
            <div className="container py-5">
                <div className="row justify-content-center">
                    <div className="col-lg-7">
                        <div className="rounded p-5">
                            {testimonials.map((item, index) => (
                                <div key={index} className="testimonial-item text-center text-white mb-5">
                                    <img className="img-fluid mx-auto rounded mb-4" src={item.image} alt={`testimonial-${index}`} />
                                    <p className="fs-5">{item.text}</p>
                                    <hr className="mx-auto w-25" />
                                    <h4 className="text-white mb-0">{item.name}</h4>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
        {/* Testimonial End */}


        {/* Team Start */}
        <div className="container-fluid py-5">
            <div className="container">
                <div className="row g-5">
                    {/* Section Title */}
                    <div className="col-lg-4">
                        <div className="section-title bg-light rounded h-100 p-5">
                            <h5 className="position-relative d-inline-block text-primary text-uppercase">Our Dentist</h5>
                            <h1 className="display-6 mb-4">Meet Our Certified & Experienced Dentist</h1>
                            <Link to="/appointment" className="btn btn-primary py-3 px-5">Appointment</Link>
                        </div>
                    </div>

                    {/* Dentist Cards */}
                    {teamData.map((dentist, index) => (
                        <div className="col-lg-4" key={index}>
                            <DentistCard {...dentist} />
                        </div>
                    ))}
                </div>
            </div>
        </div>
        {/* Team End */}


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


    {/*} Back to Top */}
        {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
    <a href="#" className="btn btn-lg btn-primary btn-lg-square rounded back-to-top"><i className="bi bi-arrow-up"></i></a>
    </>
  );
}

function DentistCard({ img, name, title }) {
    return (
        <div className="team-item">
            <div className="position-relative rounded-top" style={{ zIndex: "1" }}>
                <img className="img-fluid rounded-top w-100" src={img} alt={name} />
                <div className="position-absolute top-100 start-50 translate-middle bg-light rounded p-2 d-flex">
                    {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
                    <a className="btn btn-primary btn-square m-1" href="#"><i className="fab fa-twitter fw-normal"></i></a>
                    {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
                    <a className="btn btn-primary btn-square m-1" href="#"><i className="fab fa-facebook-f fw-normal"></i></a>
                    {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
                    <a className="btn btn-primary btn-square m-1" href="#"><i className="fab fa-linkedin-in fw-normal"></i></a>
                    {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
                    <a className="btn btn-primary btn-square m-1" href="#"><i className="fab fa-instagram fw-normal"></i></a>
                </div>
            </div>
            <div className="team-text position-relative bg-light text-center rounded-bottom p-4 pt-5">
                <h4 className="mb-2">{name}</h4>
                <p className="text-primary mb-0">{title}</p>
            </div>
        </div>
    );
}

export default Home;
