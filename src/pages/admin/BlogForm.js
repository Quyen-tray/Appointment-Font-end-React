import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { BlogApi } from "../../service/BlogApi";
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';

export default function BlogForm({ blog, onClose, onSave }) {
    const [formData, setFormData] = useState({
        title: "",
        postData: "",
        image: "",
        status: true
    });
    const [loading, setLoading] = useState(false);
    const [uploadingImage, setUploadingImage] = useState(false);
    const [error, setError] = useState("");

    const fileInputRef = useRef(null);

    useEffect(() => {
        if (blog) {
            setFormData({
                title: blog.title || "",
                postData: blog.postData || "",
                image: blog.image || "",
                status: blog.status !== undefined ? blog.status : true
            });
        }
    }, [blog]);

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value
        }));
    };

    // Clean and process content from ReactQuill
    const cleanContent = (content) => {
        // Remove any potential encoding issues
        return content
            .replace(/&lt;/g, '<')
            .replace(/&gt;/g, '>')
            .replace(/&amp;/g, '&')
            .replace(/&quot;/g, '"')
            .replace(/&#39;/g, "'");
    };

    // Handle ReactQuill content change
    const handleQuillChange = (content) => {
        console.log('ReactQuill content (raw):', content); // Debug log
        const cleanedContent = cleanContent(content);
        console.log('ReactQuill content (cleaned):', cleanedContent); // Debug log

        setFormData(prev => ({
            ...prev,
            postData: cleanedContent
        }));
    };

    const handleImageUpload = async (event) => {
        const file = event.target.files[0];
        if (!file) return;

        // Validate file type
        if (!file.type.startsWith('image/')) {
            alert('Vui lòng chọn file hình ảnh!');
            return;
        }

        // Validate file size (5MB max)
        if (file.size > 5 * 1024 * 1024) {
            alert('Kích thước file không được vượt quá 5MB!');
            return;
        }

        const formDataUpload = new FormData();
        formDataUpload.append("file", file);
        formDataUpload.append("upload_preset", "avatar_upload");

        try {
            setUploadingImage(true);
            const response = await fetch("https://api.cloudinary.com/v1_1/dpk1bgfbz/image/upload", {
                method: "POST",
                body: formDataUpload,
            });

            const data = await response.json();

            if (response.ok) {
                setFormData(prev => ({ ...prev, image: data.secure_url }));
            } else {
                alert("Lỗi khi tải ảnh lên Cloudinary!");
            }
        } catch (err) {
            alert("Lỗi khi tải ảnh lên Cloudinary!");
            console.error("Error uploading image:", err);
        } finally {
            setUploadingImage(false);
        }
    };

    const removeImage = () => {
        setFormData(prev => ({ ...prev, image: "" }));
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.title.trim()) {
            setError("Vui lòng nhập tiêu đề blog!");
            return;
        }

        if (!formData.postData.trim() || formData.postData === '<p><br></p>') {
            setError("Vui lòng nhập nội dung blog!");
            return;
        }

        try {
            setLoading(true);
            setError("");

            const blogData = {
                title: formData.title.trim(),
                postData: formData.postData.trim(),
                image: formData.image,
                status: formData.status
            };

            if (blog) {
                // Update existing blog
                await BlogApi.updateBlog(blog.id, blogData);
            } else {
                // Create new blog
                await BlogApi.createBlog(blogData);
            }

            onSave();
        } catch (err) {
            setError("Có lỗi xảy ra khi lưu blog. Vui lòng thử lại!");
            console.error("Error saving blog:", err);
        } finally {
            setLoading(false);
        }
    };

    // ReactQuill modules configuration
    const quillModules = {
        toolbar: [
            [{ 'header': [1, 2, 3, false] }],
            ['bold', 'italic', 'underline', 'strike'],
            [{ 'list': 'ordered' }, { 'list': 'bullet' }],
            [{ 'script': 'sub' }, { 'script': 'super' }],
            [{ 'indent': '-1' }, { 'indent': '+1' }],
            [{ 'direction': 'rtl' }],
            [{ 'color': [] }, { 'background': [] }],
            [{ 'align': [] }],
            ['link', 'image', 'video'],
            ['clean']
        ],
    };

    const quillFormats = [
        'header', 'bold', 'italic', 'underline', 'strike',
        'list', 'bullet', 'script', 'indent', 'direction',
        'color', 'background', 'align', 'link', 'image', 'video'
    ];

    return (
        <div className="modal show d-block" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
            <div className="modal-dialog modal-xl">
                <motion.div
                    className="modal-content"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3 }}
                >
                    <div className="modal-header">
                        <h5 className="modal-title">
                            <i className="fas fa-blog me-2"></i>
                            {blog ? "Chỉnh sửa Blog" : "Thêm Blog Mới"}
                        </h5>
                        <button
                            type="button"
                            className="btn-close"
                            onClick={onClose}
                            disabled={loading}
                        ></button>
                    </div>

                    <form onSubmit={handleSubmit}>
                        <div className="modal-body">
                            {error && (
                                <div className="alert alert-danger" role="alert">
                                    {error}
                                </div>
                            )}

                            <div className="row">
                                {/* Title */}
                                <div className="col-12 mb-3">
                                    <label className="form-label fw-bold">
                                        Tiêu đề <span className="text-danger">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        name="title"
                                        value={formData.title}
                                        onChange={handleInputChange}
                                        placeholder="Nhập tiêu đề blog..."
                                        required
                                    />
                                </div>

                                {/* Image Upload */}
                                <div className="col-12 mb-3">
                                    <label className="form-label fw-bold">Hình ảnh</label>

                                    <div className="input-group">
                                        <input
                                            type="file"
                                            className="form-control"
                                            ref={fileInputRef}
                                            onChange={handleImageUpload}
                                            accept="image/*"
                                            disabled={uploadingImage}
                                        />
                                        {formData.image && (
                                            <button
                                                type="button"
                                                className="btn btn-outline-danger"
                                                onClick={removeImage}
                                                disabled={uploadingImage}
                                            >
                                                <i className="fas fa-trash"></i>
                                            </button>
                                        )}
                                    </div>

                                    {uploadingImage && (
                                        <div className="mt-2">
                                            <div className="spinner-border spinner-border-sm me-2" role="status"></div>
                                            <small className="text-muted">Đang tải ảnh lên...</small>
                                        </div>
                                    )}

                                    {formData.image && (
                                        <div className="mt-3">
                                            <img
                                                src={formData.image}
                                                alt="Preview"
                                                className="img-thumbnail"
                                                style={{ maxWidth: "200px", maxHeight: "200px" }}
                                            />
                                        </div>
                                    )}
                                </div>

                                {/* ReactQuill Editor */}
                                <div className="col-12 mb-3">
                                    <label className="form-label fw-bold">
                                        Nội dung <span className="text-danger">*</span>
                                    </label>

                                    <div className="quill-container">
                                        <ReactQuill
                                            theme="snow"
                                            value={formData.postData}
                                            onChange={handleQuillChange}
                                            modules={quillModules}
                                            formats={quillFormats}
                                            placeholder="Nhập nội dung blog..."
                                            style={{ height: '300px', marginBottom: '50px' }}
                                        />
                                    </div>
                                    <small className="text-muted">
                                        Sử dụng toolbar để định dạng văn bản, thêm hình ảnh và liên kết.
                                    </small>
                                </div>

                                {/* Preview */}
                                {formData.postData && formData.postData !== '<p><br></p>' && (
                                    <div className="col-12">
                                        <h6 className="fw-bold mb-2">
                                            <i className="fas fa-eye me-2"></i>
                                            Xem trước:
                                        </h6>
                                        <div className="blog-preview">
                                            <div
                                                dangerouslySetInnerHTML={{
                                                    __html: cleanContent(formData.postData || '')
                                                }}
                                            />
                                        </div>
                                        <small className="text-muted mt-2 d-block">
                                            💡 Đây là cách blog sẽ hiển thị cho người đọc
                                        </small>


                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="modal-footer">
                            <button
                                type="button"
                                className="btn btn-secondary"
                                onClick={onClose}
                                disabled={loading}
                            >
                                Hủy
                            </button>
                            <button
                                type="submit"
                                className="btn btn-primary"
                                disabled={loading || uploadingImage}
                            >
                                {loading ? (
                                    <>
                                        <div className="spinner-border spinner-border-sm me-2" role="status"></div>
                                        Đang lưu...
                                    </>
                                ) : (
                                    <>
                                        <i className="fas fa-save me-2"></i>
                                        {blog ? "Cập nhật" : "Tạo mới"}
                                    </>
                                )}
                            </button>
                        </div>
                    </form>
                </motion.div>
            </div>
        </div>
    );
} 