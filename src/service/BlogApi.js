import axios from "axios";

const API_URL = "http://localhost:8081/api/blogs";

// Get token from localStorage
const getAuthHeader = () => {
    const token = localStorage.getItem("token");
    return token ? { Authorization: `Bearer ${token}` } : {};
};

export const BlogApi = {
    // Get all blogs (public)
    getAllBlogs: async () => {
        try {
            const response = await axios.get(API_URL);
            return response.data;
        } catch (error) {
            console.error("Error fetching blogs:", error);
            throw error;
        }
    },

    // Get blog by ID (public)
    getBlogById: async (id) => {
        try {
            const response = await axios.get(`${API_URL}/${id}`);
            return response.data;
        } catch (error) {
            console.error("Error fetching blog:", error);
            throw error;
        }
    },

    // Create new blog (admin only)
    createBlog: async (blogData) => {
        try {
            const response = await axios.post(API_URL, blogData, {
                headers: {
                    "Content-Type": "application/json",
                    ...getAuthHeader(),
                },
            });
            return response.data;
        } catch (error) {
            console.error("Error creating blog:", error);
            throw error;
        }
    },

    // Update blog (admin only)
    updateBlog: async (id, blogData) => {
        try {
            const response = await axios.put(`${API_URL}/${id}`, blogData, {
                headers: {
                    "Content-Type": "application/json",
                    ...getAuthHeader(),
                },
            });
            return response.data;
        } catch (error) {
            console.error("Error updating blog:", error);
            throw error;
        }
    },

    // Delete blog (admin only)
    deleteBlog: async (id) => {
        try {
            const response = await axios.delete(`${API_URL}/${id}`, {
                headers: getAuthHeader(),
            });
            return response.data;
        } catch (error) {
            console.error("Error deleting blog:", error);
            throw error;
        }
    },

    // Toggle blog status (admin only)
    toggleBlogStatus: async (id) => {
        try {
            const response = await axios.patch(`${API_URL}/${id}/toggle-status`, {}, {
                headers: getAuthHeader(),
            });
            return response.data;
        } catch (error) {
            console.error("Error toggling blog status:", error);
            throw error;
        }
    }
}; 