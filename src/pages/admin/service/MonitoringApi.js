import instance from '../AxiosInstance';

export const fetchLoginStats = () => instance.get("/api/admin/monitoring/login-stats").then(res => res.data);
export const fetchRecentLogins = () => instance.get("/api/admin/monitoring/recent-logins").then(res => res.data);
export const fetchTopEndpoints = () => instance.get("/api/admin/monitoring/top-endpoints").then(res => res.data);
export const fetchCallStatsPerDay = () => instance.get("/api/admin/monitoring/api-calls-daily").then(res => res.data);
export const fetchAvgDurations = () => instance.get("/api/admin/monitoring/average-duration").then(res => res.data);
export const fetchMethodStats = () => instance.get("/api/admin/monitoring/request-methods").then(res => res.data);
