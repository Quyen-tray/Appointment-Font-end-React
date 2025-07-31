import { Link } from "react-router-dom";
import CompareImage from "react-compare-image";
import beforeImage from "../assets/img/before.jpg";
import afterImage from "../assets/img/after.jpg";
import service1 from "../assets/img/service-1.jpg";
import service2 from "../assets/img/service-2.jpg";
import service3 from "../assets/img/service-3.jpg";
import service4 from "../assets/img/service-4.jpg";

function Service() {
    return (
        <>
            {/* Hero Start */}
            <div className="container-fluid bg-primary py-5 hero-header mb-5">
                <div className="row py-3">
                    <div className="col-12 text-center">
                        <h1 className="display-3 text-white animated zoomIn">Dịch vụ</h1>
                        <Link to="/" className="h4 text-white">Trang Chủ</Link>
                        <i className="far fa-circle text-white px-2"></i>
                        <Link to="/service" className="h4 text-white">Dịch vụ</Link>
                    </div>
                </div>
            </div>
            {/* Hero End */}

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
                                <h5 className="position-relative d-inline-block text-primary text-uppercase">Dịch vụ của chúng tôi</h5>
                                <h1 className="display-5 mb-0">Chúng tôi cung cấp dịch vụ nha khoa chất lượng tốt nhất</h1>
                            </div>
                            <div className="row g-5">
                                <ServiceItem img={service1} title="Nha khoa thẩm mỹ" />
                                <ServiceItem img={service2} title="Cấy ghép răng" />
                            </div>
                        </div>
                    </div>

                    <div className="row g-5">
                        <div className="col-lg-7">
                            <div className="row g-5">
                                <ServiceItem img={service3} title="Cầu răng" />
                                <ServiceItem img={service4} title="Làm trắng răng" />
                            </div>
                        </div>
                        <div className="col-lg-5">
                            <div className="position-relative bg-primary rounded h-100 d-flex flex-column align-items-center justify-content-center text-center p-4">
                                <h3 className="text-white mb-3">Đặt lịch</h3>
                                <p className="text-white mb-3">LIÊN HỆ TRỰC TIẾP</p>
                                <h2 className="text-white mb-0">+012 345 6789</h2>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {/* Service End */}

            {/* Newsletter Start */}
            <div className="container-fluid position-relative pt-5" style={{ zIndex: "1" }}>
                <div className="container">
                    <div className="bg-primary p-5">
                        <form className="mx-auto" style={{ maxWidth: "600px" }}>
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

export default Service;
