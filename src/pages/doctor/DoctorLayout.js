import React from "react";
import { Outlet } from "react-router-dom";
import DoctorNavbar from "../../components/DoctorNavbar";

export default function DoctorLayout() {
    return (
        <>
            <DoctorNavbar />
            <main className="doctor-container">
                <Outlet />
            </main>
        </>
    );
} 