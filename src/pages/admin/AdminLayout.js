
import {Outlet} from "react-router-dom";
import AdminNavbar from "../../components/AdminNavbar";

export default function AdminLayout() {
    // Kiểm tra role tại đây
    return (
        <>
            <AdminNavbar />
            <main className="admin-container">
                <Outlet /> {/* Render nội dung bên trong */}
            </main>
        </>
    );
}
