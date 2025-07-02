import { Link } from "react-router-dom";
import team1 from "../assets/img/team-1.jpg";
import team2 from "../assets/img/team-2.jpg";
import team3 from "../assets/img/team-3.jpg";
import team4 from "../assets/img/team-4.jpg";
import team5 from "../assets/img/team-5.jpg";

const teamData = [
    { img: team1, name: "Dr. John Doe", title: "Implant Surgeon" },
    { img: team2, name: "Dr. Sarah Smith", title: "Orthodontist" },
    { img: team3, name: "Dr. Lisa Nguyen", title: "Cosmetic Dentist" },
    { img: team4, name: "Dr. James Lee", title: "Pediatric Dentist" },
    { img: team5, name: "Dr. Emily Brown", title: "Periodontist" },
];

function Team() {
    return (
        <>
            {/* Hero Start */}
            <div className="container-fluid bg-primary py-5 hero-header mb-5">
                <div className="row py-3">
                    <div className="col-12 text-center">
                        <h1 className="display-3 text-white">Dentist</h1>
                        <Link to="/" className="h4 text-white">Home</Link>
                        <i className="far fa-circle text-white px-2"></i>
                        <Link to="/team" className="h4 text-white">Dentist</Link>
                    </div>
                </div>
            </div>
            {/* Hero End */}

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

export default Team;
