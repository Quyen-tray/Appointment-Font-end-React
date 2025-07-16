import PatientNavbar from "../../components/PatientNavbar";
import {Outlet} from "react-router-dom";

export default function PatientLayout() {
    return (
        <>
            <PatientNavbar />
            <main className="patient-container">
                <Outlet />
            </main>
        </>
    );
}
