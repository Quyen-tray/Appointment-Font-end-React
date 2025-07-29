import axios from "axios";

const API_URL = "http://localhost:8081/api/doctor/appointment";
const API_PAYMENT = "http://localhost:8081/api/payment";
// Get token from localStorage
const getAuthHeader = () => {
    const token = localStorage.getItem("token");
    return token ? { Authorization: `Bearer ${token}` } : {};
};

export const DoctorAppointmentApi = {
    // Get all appointments for current doctor
    getMyAppointments: async (params = {}) => {
        try {
            const queryParams = new URLSearchParams();

            // Add query parameters if provided
            if (params.status) queryParams.append('status', params.status);
            if (params.date) queryParams.append('date', params.date);
            if (params.page) queryParams.append('page', params.page);
            if (params.size) queryParams.append('size', params.size);

            const url = queryParams.toString() ? `${API_URL}?${queryParams}` : API_URL;

            const response = await axios.get(url, {
                headers: getAuthHeader(),
            });

            return response.data;
        } catch (error) {
            console.error("Error fetching doctor appointments:", error);
            throw error;
        }
    },

    // Get appointment by ID (for doctor)
    getAppointmentById: async (id) => {
        try {
            const response = await axios.get(`${API_URL}/${id}`, {
                headers: getAuthHeader(),
            });
            return response.data;
        } catch (error) {
            console.error("Error fetching appointment:", error);
            throw error;
        }
    },

    // Update appointment note
    updateAppointmentNote: async (id, noteData) => {
        try {
            const response = await axios.patch(`${API_URL}/${id}`, noteData, {
                headers: {
                    "Content-Type": "application/json",
                    ...getAuthHeader(),
                },
            });
            return response.data;
        } catch (error) {
            console.error("Error updating appointment note:", error);
            throw error;
        }
    },

    // Add note to appointment
    addAppointmentNote: async (id, noteData) => {
        try {
            const response = await axios.post(`${API_URL}/${id}/note`, noteData, {
                headers: {
                    "Content-Type": "application/json",
                    ...getAuthHeader(),
                },
            });
            return response.data;
        } catch (error) {
            console.error("Error adding appointment note:", error);
            throw error;
        }
    },

    // Delete appointment note
    deleteAppointmentNote: async (id) => {
        try {
            const response = await axios.delete(`${API_URL}/${id}/note`, {
                headers: getAuthHeader(),
            });
            return response.data;
        } catch (error) {
            console.error("Error deleting appointment note:", error);
            throw error;
        }
    },

    // Update appointment status (if needed)
    updateAppointmentStatus: async (id, status) => {
        try {
            const response = await axios.patch(`${API_URL}/${id}/status`, { status }, {
                headers: {
                    "Content-Type": "application/json",
                    ...getAuthHeader(),
                },
            });
            return response.data;
        } catch (error) {
            console.error("Error updating appointment status:", error);
            throw error;
        }
    },

    // Get appointment statistics for doctor
    getAppointmentStats: async () => {
        try {
            const response = await axios.get(`${API_URL}/stats`, {
                headers: getAuthHeader(),
            });
            return response.data;
        } catch (error) {
            console.error("Error fetching appointment stats:", error);
            throw error;
        }
    },

    // Create bill for appointment
    createBill: async (appointmentId) => {
        try {
            const response = await axios.post(`${API_URL}/${appointmentId}/bill`, {}, {
                headers: {
                    "Content-Type": "application/json",
                    ...getAuthHeader(),
                },
            });
            return response.data;
        } catch (error) {
            console.error("Error creating bill:", error);
            throw error;
        }
    },

    // Create invoice and payment for completed appointment
    createInvoiceAndPayment: async (appointmentId) => {
        try {
            const response = await axios.post(`${API_PAYMENT}/${appointmentId}`, {}, {
                headers: {
                    "Content-Type": "application/json",
                    ...getAuthHeader(),
                },
            });
            return response.data;
        } catch (error) {
            console.error("Error creating invoice and payment:", error);
            throw error;
        }
    },

    // Get or create medical visit for appointment
    getMedicalVisit: async (appointmentId, patientId) => {
        try {
            const response = await axios.get(`http://localhost:8081/api/visits/${appointmentId}/${patientId}`, {
                headers: getAuthHeader(),
            });
            return response.data; // Returns MedicalVisitResponse with medicalVisit and labRequests
        } catch (error) {
            console.error("Error fetching medical visit:", error);
            throw error;
        }
    },

    // Update medical visit note only
    updateMedicalVisitNote: async (appointmentId, noteData) => {
        try {
            console.log(appointmentId)
            const response = await axios.put(`http://localhost:8081/api/visits/${appointmentId}`, noteData, {
                headers: {
                    "Content-Type": "application/json",
                    ...getAuthHeader(),
                },
            });
            return response.data;
        } catch (error) {
            console.error("Error updating medical visit note:", error);
            throw error;
        }
    },

    // Create lab request for a medical visit
    createLabRequest: async (visitId, labRequestData) => {
        try {
            const response = await axios.post(`http://localhost:8081/api/labrequests`, {
                visitId: visitId,
                ...labRequestData
            }, {
                headers: {
                    "Content-Type": "application/json",
                    ...getAuthHeader(),
                },
            });
            return response.data;
        } catch (error) {
            console.error("Error creating lab request:", error);
            throw error;
        }
    },

    // Delete lab request by ID
    deleteLabRequest: async (labRequestId) => {
        try {
            const response = await axios.delete(`http://localhost:8081/api/labrequests/${labRequestId}`, {
                headers: getAuthHeader(),
            });
            return response.data;
        } catch (error) {
            console.error("Error deleting lab request:", error);
            throw error;
        }
    }
}; 