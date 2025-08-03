import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { BlogApi } from "../service/BlogApi";

export default function BlogList() {
    const [blogs, setBlogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        fetchBlogs();
    }, []);

    const fetchBlogs = async () => {
        try {
            setLoading(true);
            const data = await BlogApi.getAllBlogs();
            setBlogs(data);
        } catch (err) {
            setError("Không thể tải danh sách blog. Vui lòng thử lại sau.");
            console.error("Error fetching blogs:", err);
        } finally {
            setLoading(false);
        }
    };

    const filteredBlogs = blogs.filter(blog => {
        const searchLower = searchTerm.toLowerCase();
        const titleMatch = blog.title.toLowerCase().includes(searchLower);
        // Remove HTML tags for searching in content
        const contentText = blog.postData.replace(/<[^>]*>/g, '').toLowerCase();
        const contentMatch = contentText.includes(searchLower);
        
        return titleMatch || contentMatch;
    });

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString("vi-VN", {
            year: "numeric",
            month: "long",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit"
        });
    };

    const truncateText = (text, maxLength = 200) => {
        // Remove HTML tags for length calculation and preview
        const textOnly = text.replace(/<[^>]*>/g, '');
        if (textOnly.length <= maxLength) return textOnly;
        return textOnly.substr(0, maxLength) + "...";
    };

    const truncateHtml = (html, maxLength = 200) => {
        // Remove HTML tags to get text length
        const textOnly = html.replace(/<[^>]*>/g, '');
        if (textOnly.length <= maxLength) return html;

        // If too long, truncate and return plain text
        return textOnly.substr(0, maxLength) + "...";
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
                {/* Header */}
                <div className="row mb-5">
                    <div className="col-12 text-center">
                        <h1 className="display-4 fw-bold text-primary mb-3">
                            Blog Y Tế
                        </h1>
                        <p className="lead text-muted">
                            Cập nhật những thông tin y tế mới nhất và hữu ích
                        </p>
                    </div>
                </div>

                {/* Search */}
                <div className="row mb-4">
                    <div className="col-md-6 mx-auto">
                        <div className="input-group">
                            <span className="input-group-text">
                                <i className="fas fa-search"></i>
                            </span>
                            <input
                                type="text"
                                className="form-control"
                                placeholder="Tìm kiếm blog..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                    </div>
                </div>

                {/* Blog Grid */}
                {filteredBlogs.length === 0 ? (
                    <div className="text-center py-5">
                        <i className="fas fa-blog fa-3x text-muted mb-3"></i>
                        <h4 className="text-muted">
                            {searchTerm ? "Không tìm thấy blog phù hợp" : "Chưa có blog nào"}
                        </h4>
                    </div>
                ) : (
                    <div className="row">
                        {filteredBlogs.map((blog, index) => (
                            <motion.div
                                key={blog.id}
                                className="col-lg-4 col-md-6 mb-4"
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6, delay: index * 0.1 }}
                            >
                                <div className="card h-100 shadow-sm border-0 blog-card">
                                    {blog.image && (
                                        <div className="position-relative">
                                            <img
                                                src={blog.image}
                                                className="card-img-top"
                                                alt={blog.title}
                                                style={{ height: "200px", objectFit: "cover" }}
                                            />
                                            <div className="position-absolute top-0 end-0 m-2">
                                                <span className="badge bg-primary">
                                                    {formatDate(blog.dateCreate).split(",")[0]}
                                                </span>
                                            </div>
                                        </div>
                                    )}
                                    <div className="card-body d-flex flex-column">
                                        <h5 className="card-title fw-bold text-dark mb-2">
                                            {blog.title}
                                        </h5>
                                        <div className="card-text text-muted flex-grow-1">
                                            <div
                                                dangerouslySetInnerHTML={{
                                                    __html: truncateHtml(blog.postData)
                                                }}
                                            />
                                        </div>
                                        <div className="mt-auto">
                                            <div className="d-flex justify-content-between align-items-center">
                                                <small className="text-muted">
                                                    <i className="fas fa-calendar-alt me-1"></i>
                                                    {formatDate(blog.dateCreate)}
                                                </small>
                                                <Link
                                                    to={`/blog/${blog.id}`}
                                                    className="btn btn-outline-primary btn-sm"
                                                >
                                                    Đọc thêm
                                                    <i className="fas fa-arrow-right ms-1"></i>
                                                </Link>
                                            </div>
                                            {blog.user && (
                                                <div className="mt-2">
                                                    <small className="text-muted">
                                                        <i className="fas fa-user me-1"></i>
                                                        Tác giả: {blog.user.fullName || blog.user.username}
                                                    </small>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}

                {/* Pagination could be added here */}
                {filteredBlogs.length > 0 && (
                    <div className="row mt-5">
                        <div className="col-12 text-center">
                            <p className="text-muted">
                                Hiển thị {filteredBlogs.length} blog
                            </p>
                        </div>
                    </div>
                )}
            </motion.div>
        </div>
    );
} 