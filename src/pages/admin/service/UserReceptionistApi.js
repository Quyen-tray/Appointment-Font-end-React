import instance from '../AxiosInstance';

export const fetchReceptionists = (page, size, sortBy, direction, keyword) =>
    instance.get(`/api/admin/receptionist/list`, {
        params: { page, size, sortBy, direction, keyword }
    });

export const updateReceptionist = (id, data) =>
    instance.put(`/api/admin/receptionist/${id}`, data);

export const deleteReceptionist = (id) =>
    instance.delete(`/api/admin/account/${id}`);

export const getReceptionist = (id) =>
    instance.get(`/api/admin/receptionist/${id}`);