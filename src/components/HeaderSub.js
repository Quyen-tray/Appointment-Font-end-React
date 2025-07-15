import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth} from "../AuthContext";
import { useNavigate } from "react-router-dom";

function HeaderSub() {
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState("");
    const { isLoggedIn,logout,token,user,load} = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        const timer = setTimeout(() => setLoading(false), 1000);
        return () => clearTimeout(timer);
    }, [token]);

    if(load){
        return null;
    }

    const handleLogout =async () => {
        const result = await logout();
        if(result&&result.success){
            setMessage(result.message);
            console.log(message);
            navigate("/");
        }else{
            setMessage(result.message);
            console.log(message);
        }
    };

    console.log("🔍 user:", user);
    console.log("🔍 user.roles:", user?.roles);

    return (
        <>
            {/* Spinner Start */}
            {loading && (
                <div id="spinner" className="show bg-white position-fixed translate-middle w-100 vh-100 top-50 start-50 d-flex align-items-center justify-content-center">
                    <div className="spinner-grow text-primary m-1" role="status"></div>
                    <div className="spinner-grow text-dark m-1" role="status"></div>
                    <div className="spinner-grow text-secondary m-1" role="status"></div>
                </div>
            )}
            {/* Spinner End */}

            {/* Topbar Start */}
            <div className="container-fluid bg-light ps-5 pe-0 d-none d-lg-block">
                <div className="row gx-0">
                    <div className="col-md-6 text-center text-lg-start mb-2 mb-lg-0">
                        <div className="d-inline-flex align-items-center">
                            <small className="py-2">
                                <i className="far fa-clock text-primary me-2"></i>
                                Opening Hours: Mon - Tues : 6.00 am - 10.00 pm, Sunday Closed
                            </small>
                        </div>
                    </div>
                    <div className="col-md-6 text-center text-lg-end">
                        <div className="position-relative d-inline-flex align-items-center bg-primary text-white top-shape px-4 py-2">
                            <div className="me-3 pe-3 border-end py-1">
                                <p className="m-0">
                                    <i className="fa fa-envelope-open me-2"></i>info@example.com
                                </p>
                            </div>
                            <div className="me-3 py-1">
                                <p className="m-0">
                                    <i className="fa fa-phone-alt me-2"></i>+012 345 6789
                                </p>
                            </div>

                            {/* ⬇️ Thêm phần này để hiển thị login/register hoặc user info */}
                            <div className="d-flex align-items-center ps-3">
                                {isLoggedIn && user ? (
                                    <>
                                        <span className="me-3">
                                            <i className="fa fa-user me-1"></i> Hello, {user.username}
                                        </span>
                                        <button className="btn btn-sm btn-light" onClick={handleLogout}>Logout</button>
                                    </>
                                ) : (
                                    <>
                                        <Link to="/login" className="btn btn-sm btn-light me-2">Login</Link>
                                        <Link to="/register" className="btn btn-sm btn-outline-light">Register</Link>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {/* Topbar End */}
        </>
    );
}

export default HeaderSub;
