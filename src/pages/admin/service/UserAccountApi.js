import instance from '../AxiosInstance';

export const fetchAccounts = (page, size, sortBy, direction, keyword) =>
    instance.get(`/api/admin/account/list`, {
        params: { page, size, sortBy, direction, keyword }
    });

export const createAccount = (data) =>
    instance.post(`/api/admin/account/create`, data);

export const updateAccount = (id, data) =>
    instance.put(`/api/admin/account/${id}`, data);

export const deleteAccount = (id) =>
    instance.delete(`/api/admin/account/${id}`);

export const getAccount = (id) =>
    instance.get(`/api/admin/account/${id}`);
