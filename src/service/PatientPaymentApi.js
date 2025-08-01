import axios from "axios";

const API_URL = "http://localhost:8081/api/patient/invoices";
const API_PAYMENT = "http://localhost:8081/api/payment/add/transaction";
const API_PAYMENT_URL = "http://localhost:8081/api/payment";
// Get token from localStorage
const getAuthHeader = () => {
    const token = localStorage.getItem("token");
    return token ? { Authorization: `Bearer ${token}` } : {};
};

export const PatientPaymentApi = {
    // Get all unpaid invoices for current patient
    getUnpaidInvoices: async (id) => {
        try {
            const response = await axios.get(`${API_URL}/unpaid/${id}`, {
                headers: getAuthHeader(),
            });
            return response.data;
        } catch (error) {
            console.error("Error fetching unpaid invoices:", error);
            throw error;
        }
    },

    // Get all unpaid invoices for all patients (admin/receptionist view)
    getAllUnpaidInvoices: async () => {
        try {
            const response = await axios.get(`${API_PAYMENT_URL}/invoices/unpaid`, {
                headers: getAuthHeader(),
            });
            return response.data;
        } catch (error) {
            console.error("Error fetching all unpaid invoices:", error);
            throw error;
        }
    },



    // Create VNPay payment for invoice
    createVNPayPayment: async (invoiceId) => {
        try {
            const response = await axios.post(`${API_PAYMENT}/${invoiceId}`, {}, {
                headers: {
                    "Content-Type": "application/json",
                    ...getAuthHeader(),
                },
            });
            return response.data; // Should return payment URL
        } catch (error) {
            console.error("Error creating VNPay payment:", error);
            throw error;
        }
    },

    // Get payment history
    getPaymentHistory: async () => {
        try {
            const response = await axios.get(`${API_URL}/history`, {
                headers: getAuthHeader(),
            });
            return response.data;
        } catch (error) {
            console.error("Error fetching payment history:", error);
            throw error;
        }
    },

    // Send reminder emails for selected invoices
    sendReminderEmails: async (invoiceIds) => {
        try {
            const response = await axios.post(`${API_PAYMENT_URL}/send-email`, {
                invoiceIds: invoiceIds
            }, {
                headers: {
                    "Content-Type": "application/json",
                    ...getAuthHeader(),
                },
            });
            return response.data;
        } catch (error) {
            console.error("Error sending reminder emails:", error);
            throw error;
        }
    }
}; 