import instance from '../AxiosInstance';

export const fetchLogs = (page, size, username, action, endpoint) =>
    instance.get('/api/admin/log', {
        params: { page, size, username, action, endpoint }
    });

export const deleteLog = (id) =>
    instance.delete(`/api/admin/log/${id}`);
