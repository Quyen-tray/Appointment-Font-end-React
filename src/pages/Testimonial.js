import { Link } from "react-router-dom";
import testimonial1 from "../assets/img/testimonial-1.jpg";
import testimonial2 from "../assets/img/testimonial-2.jpg";

// Nếu có nhiều đánh giá hơn sau này, dễ mở rộng
const testimonials = [
    {
        image: testimonial1,
        text: "Tôi rất hài lòng với dịch vụ tại bệnh viện nha khoa này. Đội ngũ bác sĩ tận tâm, nhẹ nhàng và luôn giải thích kỹ lưỡng trước khi điều trị. Không gian sạch sẽ, hiện đại, tạo cảm giác yên tâm khi đến khám răng. Chắc chắn sẽ quay lại khi cần!",
        name: "— Nguyễn Thị Mai, 32 tuổi",
    },
    {
        image: testimonial2,
        text: "Lần đầu đến khám răng nhưng mình thấy rất ấn tượng. Thời gian chờ không lâu, nhân viên thân thiện, bác sĩ điều trị chuyên nghiệp. Chi phí cũng rõ ràng, hợp lý. Đây là địa chỉ nha khoa uy tín mà mình sẽ giới thiệu cho người thân.",
        name: "— Jesica Nguyễn, 27 tuổi",
    },
];

function Testimonial() {
    return (
        <>
            {/* Hero Start */}
            <div className="container-fluid bg-primary py-5 hero-header mb-5">
                <div className="row py-3">
                    <div className="col-12 text-center">
                        <h1 className="display-3 text-white">Lời chứng thực</h1>
                        <Link to="/" className="h4 text-white">Trang chủ</Link>
                        <i className="far fa-circle text-white px-2"></i>
                        <Link to="/testimonial" className="h4 text-white">Lời chứng thực</Link>
                    </div>
                </div>
            </div>
            {/* Hero End */}

            {/* Testimonial Section */}
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

export default Testimonial;
