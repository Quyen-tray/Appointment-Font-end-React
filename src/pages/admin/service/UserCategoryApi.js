// UserCategoryApi.js
import axiosInstance from "../AxiosInstance";

const BASE_URL = "/api/admin/categories";

export const fetchCategories = (page = 0, size = 10, sort = "name,asc", keyword = "") =>
    axiosInstance.get(`${BASE_URL}/list`, {
        params: { page, size, sort, keyword },
    });

export const createCategory = (category) =>
    axiosInstance.post(`${BASE_URL}/create`, category);

export const updateCategory = (id, category) =>
    axiosInstance.put(`${BASE_URL}/update/${id}`, category);

export const deleteCategory = (id) =>
    axiosInstance.delete(`${BASE_URL}/delete/${id}`);
