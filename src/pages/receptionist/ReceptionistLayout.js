
import {Outlet} from "react-router-dom";
import ReceptionistNavbar from "../../components/ReceptionistNavbar";

export default function ReceptionistLayout() {
    return (
        <>
            <ReceptionistNavbar />
            <main className="receptionist-container">
                <Outlet />
            </main>
        </>
    );
}
