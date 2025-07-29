import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { BlogApi } from "../../service/BlogApi";
import BlogForm from "./BlogForm";

export default function BlogManagement() {
    const [blogs, setBlogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [showModal, setShowModal] = useState(false);
    const [editingBlog, setEditingBlog] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [filterStatus, setFilterStatus] = useState("all"); // all, active, inactive

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

    const handleCreateBlog = () => {
        setEditingBlog(null);
        setShowModal(true);
    };

    const handleEditBlog = (blog) => {
        setEditingBlog(blog);
        setShowModal(true);
    };

    const handleDeleteBlog = async (id) => {
        if (window.confirm("Bạn có chắc chắn muốn xóa blog này?")) {
            try {
                await BlogApi.deleteBlog(id);
                setBlogs(blogs.filter(blog => blog.id !== id));
                alert("Xóa blog thành công!");
            } catch (err) {
                alert("Có lỗi xảy ra khi xóa blog!");
                console.error("Error deleting blog:", err);
            }
        }
    };

    const handleToggleStatus = async (id) => {
        try {
            await BlogApi.toggleBlogStatus(id);
            setBlogs(blogs.map(blog =>
                blog.id === id ? { ...blog, status: !blog.status } : blog
            ));
        } catch (err) {
            alert("Có lỗi xảy ra khi cập nhật trạng thái blog!");
            console.error("Error toggling blog status:", err);
        }
    };

    const handleBlogSaved = () => {
        setShowModal(false);
        fetchBlogs(); // Refresh the list
    };

    const filteredBlogs = blogs.filter(blog => {
        const searchLower = searchTerm.toLowerCase();
        const titleMatch = blog.title.toLowerCase().includes(searchLower);
        // Remove HTML tags for searching in content
        const contentText = blog.postData.replace(/<[^>]*>/g, '').toLowerCase();
        const contentMatch = contentText.includes(searchLower);
        const matchesSearch = titleMatch || contentMatch;

        const matchesStatus = filterStatus === "all" ||
            (filterStatus === "active" && blog.status) ||
            (filterStatus === "inactive" && !blog.status);

        return matchesSearch && matchesStatus;
    });

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString("vi-VN", {
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
            hour: "2-digit",
            minute: "2-digit"
        });
    };

    const truncateText = (text, maxLength = 100) => {
        // Remove HTML tags to get clean text for preview
        const textOnly = text.replace(/<[^>]*>/g, '');
        if (textOnly.length <= maxLength) return textOnly;
        return textOnly.substr(0, maxLength) + "...";
    };

    if (loading) {
        return (
            <div className="d-flex justify-content-center mt-5">
                <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Đang tải...</span>
                </div>
            </div>
        );
    }

    return (
        <div className="container-fluid">
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
            >
                {/* Header */}
                <div className="d-flex justify-content-end align-items-center my-4">

                    <button
                        className="btn btn-primary"
                        onClick={handleCreateBlog}
                    >
                        <i className="fas fa-plus me-2"></i>
                        Thêm Blog Mới
                    </button>
                </div>

                {error && (
                    <div className="alert alert-danger" role="alert">
                        {error}
                    </div>
                )}

                {/* Filters */}
                <div className="row mb-4">
                    <div className="col-md-6">
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

                    <div className="col-md-3">
                        <div className="text-muted">
                            Tổng: {filteredBlogs.length} blog
                        </div>
                    </div>
                </div>

                {/* Blog Table */}
                <div className="card">
                    <div className="card-body">
                        {filteredBlogs.length === 0 ? (
                            <div className="text-center py-5">
                                <i className="fas fa-blog fa-3x text-muted mb-3"></i>
                                <h5 className="text-muted">Không có blog nào</h5>
                            </div>
                        ) : (
                            <div className="table-responsive">
                                <table className="table table-hover blog-management-table">
                                    <thead className="table-light">
                                        <tr>
                                            <th>Tiêu đề</th>
                                            <th>Hình ảnh</th>
                                            <th>Nội dung</th>
                                            <th>Ngày tạo</th>
                                            <th>Thao tác</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {filteredBlogs.map((blog) => (
                                            <tr key={blog.id}>
                                                <td>
                                                    <div className="fw-bold blog-title">{blog.title}</div>
                                                </td>
                                                <td>
                                                    {blog.image ? (
                                                        <img
                                                            src={blog.image}
                                                            alt={blog.title}
                                                            className="blog-image"
                                                        />
                                                    ) : (
                                                        <span className="text-muted">Không có</span>
                                                    )}
                                                </td>
                                                <td>
                                                    <div
                                                        className="blog-content"
                                                        dangerouslySetInnerHTML={{
                                                            __html: truncateText(blog.postData)
                                                        }}
                                                    />
                                                </td>

                                                <td>{formatDate(blog.dateCreate)}</td>

                                                <td>
                                                    <div className="btn-group" role="group">
                                                        <button
                                                            className="btn btn-sm btn-outline-primary"
                                                            onClick={() => handleEditBlog(blog)}
                                                            title="Chỉnh sửa"
                                                        >
                                                            <i className="fas fa-edit"></i>
                                                        </button>
                                                        <button
                                                            className="btn btn-sm btn-outline-danger"
                                                            onClick={() => handleDeleteBlog(blog.id)}
                                                            title="Xóa"
                                                        >
                                                            <i className="fas fa-trash"></i>
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                </div>
            </motion.div>

            {/* Blog Form Modal */}
            {showModal && (
                <BlogForm
                    blog={editingBlog}
                    onClose={() => setShowModal(false)}
                    onSave={handleBlogSaved}
                />
            )}
        </div>
    );
} 