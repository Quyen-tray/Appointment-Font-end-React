import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { BlogApi } from "../service/BlogApi";

export default function BlogDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [blog, setBlog] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        fetchBlogDetail();
    }, [id]);


    const cleanContent = (content) => {
        // Remove any potential encoding issues
        return content
            .replace(/&lt;/g, '<')
            .replace(/&gt;/g, '>')
            .replace(/&amp;/g, '&')
            .replace(/&quot;/g, '"')
            .replace(/&#39;/g, "'");
    };

    const fetchBlogDetail = async () => {
        try {
            setLoading(true);
            const data = await BlogApi.getBlogById(id);



            setBlog(data);
        } catch (err) {
            if (err.response?.status === 404) {
                setError("Không tìm thấy blog này.");
            } else {
                setError("Không thể tải blog. Vui lòng thử lại sau.");
            }
            console.error("Error fetching blog detail:", err);
        } finally {
            setLoading(false);
        }
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString("vi-VN", {
            year: "numeric",
            month: "long",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit"
        });
    };

    if (loading) {
        return (
            <div className="container mt-5">
                <div className="d-flex justify-content-center">
                    <div className="spinner-border text-primary" role="status">
                        <span className="visually-hidden">Đang tải...</span>
                    </div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="container mt-5">
                <div className="alert alert-danger" role="alert">
                    {error}
                </div>
                <div className="text-center">
                    <Link to="/blog" className="btn btn-primary">
                        <i className="fas fa-arrow-left me-2"></i>
                        Quay lại danh sách blog
                    </Link>
                </div>
            </div>
        );
    }

    if (!blog) {
        return (
            <div className="container mt-5">
                <div className="alert alert-warning" role="alert">
                    Không tìm thấy blog.
                </div>
            </div>
        );
    }

    return (
        <div className="container mt-5">
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
            >
                {/* Back Button */}
                <div className="mb-4">
                    <Link to="/blog" className="btn btn-outline-secondary">
                        <i className="fas fa-arrow-left me-2"></i>
                        Quay lại danh sách blog
                    </Link>
                </div>

                <div className="row">
                    <div className="col-lg-8 mx-auto">
                        {/* Blog Header */}
                        <div className="mb-4">
                            <h1 className="display-5 fw-bold text-dark mb-3">
                                {blog.title}
                            </h1>

                            <div className="d-flex flex-wrap align-items-center text-muted mb-3">
                                <div className="me-4 mb-2">
                                    <i className="fas fa-calendar-alt me-2"></i>
                                    {formatDate(blog.dateCreate)}
                                </div>

                                {blog.user && (
                                    <div className="me-4 mb-2">
                                        <i className="fas fa-user me-2"></i>
                                        Tác giả: {blog.user.fullName || blog.user.username}
                                    </div>
                                )}

                                {blog.updateDate && blog.updateDate !== blog.dateCreate && (
                                    <div className="mb-2">
                                        <i className="fas fa-edit me-2"></i>
                                        Cập nhật: {formatDate(blog.updateDate)}
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Blog Image */}
                        {blog.image && (
                            <div className="mb-4">
                                <img
                                    src={blog.image}
                                    alt={blog.title}
                                    className="img-fluid rounded shadow"
                                    style={{ width: "100%", maxHeight: "400px", objectFit: "cover" }}
                                />
                            </div>
                        )}

                        {/* Blog Content */}
                        <div className="blog-content">
                            <div
                                dangerouslySetInnerHTML={{
                                    __html: cleanContent(blog.postData || '')
                                }}
                            />
                        </div>

                        {/* Blog Footer */}
                        <div className="mt-5 pt-4 border-top">
                            <div className="row">
                                <div className="col-md-6">
                                    <p className="text-muted mb-0">
                                        <i className="fas fa-clock me-2"></i>
                                        Ngày đăng: {formatDate(blog.dateCreate)}
                                    </p>
                                </div>
                                <div className="col-md-6 text-md-end">
                                    <button
                                        className="btn btn-outline-primary me-2"
                                        onClick={() => navigate(-1)}
                                    >
                                        <i className="fas fa-arrow-left me-2"></i>
                                        Quay lại
                                    </button>
                                    <Link to="/blog" className="btn btn-primary">
                                        <i className="fas fa-list me-2"></i>
                                        Tất cả blog
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Related Articles could be added here */}
                <div className="row mt-5">
                    <div className="col-12">
                        <div className="bg-light rounded p-4 text-center">
                            <h5 className="text-muted mb-3">
                                <i className="fas fa-heart text-danger me-2"></i>
                                Cảm ơn bạn đã đọc!
                            </h5>
                            <p className="text-muted mb-0">
                                Hãy theo dõi blog của chúng tôi để cập nhật những thông tin y tế mới nhất.
                            </p>
                        </div>
                    </div>
                </div>
            </motion.div>
        </div>
    );
} 