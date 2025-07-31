import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
    createCategory,
    getCategoryById,
    updateCategory,
} from "../service/UserCategoryApi";

export default function CategoryFormPage() {
    const [form, setForm] = useState({ name: "", description: "" });
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const { id } = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        if (id) {
            getCategoryById(id)
                .then((res) => setForm(res.data))
                .catch(() => setError("Không tìm thấy danh mục"));
        }
    }, [id]);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            if (id) {
                await updateCategory(id, form);
            } else {
                await createCategory(form);
            }
            navigate("/admin/user-categories");
        } catch (err) {
            setError("Lưu thất bại. Vui lòng kiểm tra dữ liệu.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-xl mx-auto mt-8 p-4 border rounded shadow">
            <h2 className="text-xl font-semibold mb-4">{id ? "Chỉnh sửa" : "Tạo mới"} Danh Mục</h2>

            {error && <div className="text-red-600 mb-2">{error}</div>}

            <form onSubmit={handleSubmit}>
                <div className="mb-3">
                    <label className="block mb-1">Tên</label>
                    <input
                        type="text"
                        name="name"
                        className="w-full border px-3 py-2 rounded"
                        value={form.name || ""}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="mb-3">
                    <label className="block mb-1">Mô tả</label>
                    <textarea
                        name="description"
                        className="w-full border px-3 py-2 rounded"
                        value={form.description || ""}
                        onChange={handleChange}
                    ></textarea>
                </div>

                <div className="flex justify-end gap-2">
                    <button
                        type="button"
                        onClick={() => navigate("/admin/user-categories")}
                        className="bg-gray-400 text-white px-4 py-2 rounded"
                    >
                        Hủy
                    </button>
                    <button
                        type="submit"
                        className="bg-blue-600 text-white px-4 py-2 rounded"
                        disabled={loading}
                    >
                        {loading ? "Đang lưu..." : id ? "Cập nhật" : "Tạo mới"}
                    </button>
                </div>
            </form>
        </div>
    );
}
