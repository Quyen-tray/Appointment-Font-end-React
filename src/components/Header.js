import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import "../assets/css/Header.css";
import { Modal } from 'bootstrap';

function Header() {
    const [isSticky, setIsSticky] = useState(false);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const dropdownRef = useRef();

    useEffect(() => {
        const handleScroll = () => setIsSticky(window.scrollY > 40);
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    // Đóng dropdown khi click bên ngoài
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
                setIsDropdownOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    // Toggle modal search (không dùng data-bs-toggle)
    const openSearchModal = () => {
        const modalElement = document.getElementById("searchModal");
        if (modalElement) {
            const modal = new Modal(modalElement);
            modal.show();
        }
    };


    return (
        <>
            <nav className={`navbar navbar-expand-lg bg-white navbar-light shadow-sm px-5 py-3 py-lg-0 ${isSticky ? "sticky-top" : ""}`}>
                <Link to="/" className="navbar-brand p-0">
                    <h1 className="m-0 text-primary"><i className="fa fa-tooth me-2"></i>Sức khỏe</h1>
                </Link>
                <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarCollapse">
                    <span className="navbar-toggler-icon"></span>
                </button>

                <div className="collapse navbar-collapse" id="navbarCollapse">
                    <div className="navbar-nav ms-auto py-0">
                        <Link to="/" className="nav-item nav-link">Trang Chủ</Link>
                        <Link to="/about" className="nav-item nav-link">Về Chúng Tôi</Link>
                        <Link to="/service" className="nav-item nav-link">Dịch Vụ</Link>

                        <div className="nav-item dropdown" ref={dropdownRef}>
                            <button
                                className="nav-link dropdown-toggle btn btn-link"
                                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                                style={{ textDecoration: "none" }}
                            >
                                Pages
                            </button>
                            <div className={`dropdown-menu m-0 ${isDropdownOpen ? "show" : ""}`}>
                                <Link to="/price" className="dropdown-item">Gói Dịch Vụ</Link>
                                <Link to="/team" className="dropdown-item">Bác Sĩ</Link>
                                <Link to="/testimonial" className="dropdown-item">Lời chứng thực</Link>
                                <Link to="/appointment" className="dropdown-item">Đặt Lịch</Link>
                            </div>
                        </div>

                        <Link to="/contact" className="nav-item nav-link">Liên Hệ</Link>
                        <button type="button" className="btn text-dark" onClick={openSearchModal}>
                            <i className="fa fa-search"></i>
                        </button>
                        <Link to="/appointment" className="btn btn-primary py-2 px-4 ms-3">Đặt Lịch</Link>
                    </div>
                </div>
            </nav>

            {/* Search Modal */}
            <div className="modal fade" id="searchModal" tabIndex="-1">
                <div className="modal-dialog modal-fullscreen">
                    <div className="modal-content" style={{ background: "rgba(9, 30, 62, .7)" }}>
                        <div className="modal-header border-0">
                            <button type="button" className="btn bg-white btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div className="modal-body d-flex align-items-center justify-content-center">
                            <div className="input-group" style={{ maxWidth: "600px" }}>
                                <input type="text" className="form-control bg-transparent border-primary p-3" placeholder="Type search keyword" />
                                <button className="btn btn-primary px-4"><i className="bi bi-search"></i></button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default Header;
