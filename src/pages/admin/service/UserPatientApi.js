import instance from '../AxiosInstance';

export const fetchPatient = (page, size, sortBy, direction, keyword) =>
    instance.get(`/api/admin/patient/list`, {
        params: { page, size, sortBy, direction, keyword }
    });

export const updatePatient = (id, data) =>
    instance.put(`/api/admin/patient/${id}`, data);

export const deletePatient = (id) =>
    instance.delete(`/api/admin/account/${id}`);

export const getPatient = (id) =>
    instance.get(`/api/admin/patient/${id}`);