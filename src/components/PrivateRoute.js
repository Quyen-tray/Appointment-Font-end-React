// src/components/PrivateRoute.js
import { Navigate } from "react-router-dom";
import { useAuth } from "../AuthContext";

export default function PrivateRoute({ children, allowedRoles }) {
    const { user, load } = useAuth();

    if (load) return null; // đang kiểm tra token/user

    // Nếu chưa đăng nhập
    if (!user) {
        return <Navigate to="/login" replace />;
    }

    // Nếu không có quyền truy cập
    if (allowedRoles && !allowedRoles.includes(user.roles)) {
        return <Navigate to="/" replace />;
    }

    return children;
}
