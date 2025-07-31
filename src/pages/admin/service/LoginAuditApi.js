import instance from '../AxiosInstance';

export const fetchLoginAudits = (params) => {
    return instance.get("/api/admin/login-audit", { params });
};

export const fetchLoginStats = () => {
    return instance.get("/api/admin/login-audit/stats");
};

export const fetchRecentLogins = (limit = 10) => {
    return instance.get("/api/admin/login-audit/recent", {
        params: { limit },
    });
};

export const exportLoginAuditExcel = () => {
    return instance.get("/api/admin/login-audit/export", {
        responseType: "blob",
    });
};
