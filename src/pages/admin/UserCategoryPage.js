import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    fetchCategories,
    deleteCategory,
} from "./service/UserCategoryApi";

function UserCategoryPage() {
    const [categories, setCategories] = useState([]);
    const [keyword, setKeyword] = useState("");
    const [page, setPage] = useState(0);
    const [size] = useState(5);
    const [sortBy, setSortBy] = useState("name");
    const [direction, setDirection] = useState("asc");
    const [totalPages, setTotalPages] = useState(0);
    const [reload, setReload] = useState(false);

    const navigate = useNavigate();

    useEffect(() => {
        const load = async () => {
            try {
                const res = await fetchCategories(page, size, `${sortBy},${direction}`, keyword);
                setCategories(res.data.content);
                setTotalPages(res.data.totalPages);
            } catch (error) {
                console.error("Load failed", error);
            }
        };
        load();
    }, [page, size, sortBy, direction, keyword, reload]);

    const handleDelete = async (id) => {
        if (window.confirm("Bạn chắc chắn muốn xóa danh mục này?")) {
            try {
                await deleteCategory(id);
                setReload(!reload);
            } catch (error) {
                alert("Xóa thất bại");
            }
        }
    };

    return (
        <div className="p-4 max-w-5xl mx-auto">
            <h2 className="text-2xl font-bold mb-4">Quản lý danh mục chức vụ</h2>

            {/* Tìm kiếm + Sắp xếp + Thêm */}
            <div className="flex flex-wrap gap-2 items-center justify-between mb-4">
                <input
                    type="text"
                    className="border px-3 py-1 rounded w-full md:w-1/3"
                    placeholder="Tìm theo tên hoặc mô tả..."
                    value={keyword}
                    onChange={(e) => {
                        setPage(0);
                        setKeyword(e.target.value);
                    }}
                />

                <div className="flex gap-2 items-center">
                    <select
                        className="border px-3 py-1 rounded"
                        value={sortBy}
                        onChange={(e) => {
                            setSortBy(e.target.value);
                            setPage(0);
                        }}
                    >
                        <option value="name">Sắp xếp theo Tên</option>
                        <option value="description">Sắp xếp theo Mô tả</option>
                    </select>

                    <select
                        className="border px-3 py-1 rounded"
                        value={direction}
                        onChange={(e) => {
                            setDirection(e.target.value);
                            setPage(0);
                        }}
                    >
                        <option value="asc">Tăng dần</option>
                        <option value="desc">Giảm dần</option>
                    </select>

                    <button
                        className="bg-blue-600 text-white px-4 py-2 rounded"
                        onClick={() => navigate("/admin/user-categories/new")}
                    >
                        + Thêm mới
                    </button>
                </div>
            </div>

            {/* Bảng dữ liệu */}
            <table className="w-full border shadow-sm">
                <thead className="bg-gray-100">
                <tr>
                    <th className="border px-2 py-1">Tên</th>
                    <th className="border px-2 py-1">Mô tả</th>
                    <th className="border px-2 py-1">Action</th>
                </tr>
                </thead>
                <tbody>
                {categories.map((cat) => (
                    <tr key={cat.id}>
                        <td className="border px-2 py-1">{cat.name}</td>
                        <td className="border px-2 py-1">{cat.description}</td>
                        <td className="border px-2 py-1 space-x-2">
                            <button
                                onClick={() => navigate(`/admin/user-categories/${cat.id}/edit`)}
                                className="px-2 py-1 bg-yellow-400 text-white rounded"
                            >
                                Sửa
                            </button>
                            <button
                                onClick={() => handleDelete(cat.id)}
                                className="px-2 py-1 bg-red-500 text-white rounded"
                            >
                                Xóa
                            </button>
                        </td>
                    </tr>
                ))}
                {categories.length === 0 && (
                    <tr>
                        <td colSpan="3" className="text-center text-gray-500 py-4">
                            Không có kết quả
                        </td>
                    </tr>
                )}
                </tbody>
            </table>

            {/* Phân trang */}
            <div className="flex justify-center mt-4 space-x-2">
                {Array.from({ length: totalPages }).map((_, i) => (
                    <button
                        key={i}
                        onClick={() => setPage(i)}
                        className={`px-3 py-1 rounded ${
                            page === i ? "bg-blue-500 text-white" : "bg-gray-200"
                        }`}
                    >
                        {i + 1}
                    </button>
                ))}
            </div>
        </div>
    );
}

export default UserCategoryPage;
