
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import About from "./pages/About";
import Appointment from "./pages/Appointment";
import Contact from "./pages/Contact";
import Price from "./pages/Price";
import Service from "./pages/Service";
import Team from "./pages/Team";
import Testimonial from "./pages/Testimonial";
// import Header from "./components/Header";
import Footer from "./components/Footer";
import HeaderSub from "./components/HeaderSub";
import Login from "./pages/Login";
import Register from "./pages/Register";

import "./assets/css/style.css";
import PatientLayout from "./pages/patient/PatientLayout";
import AdminLayout from "./pages/admin/AdminLayout";
import ReceptionistLayout from "./pages/receptionist/ReceptionistLayout";
import Unauthorized from "./pages/Unauthorized";
import PublicLayout from "./pages/PublicLayout";
import MedicalVisit from "./pages/patient/MedicalVisit";
import PrivateRoute from "./components/PrivateRoute";
import PatientFeedback from "./pages/patient/PatientFeedback";
import SubmitFeedback from "./pages/patient/SubmitFeedback";
import Invoice from "./pages/patient/Invoice";
import Profile from "./pages/patient/Profile";



function App() {
  return (
      <Router>
        <HeaderSub />
        <Routes>
            {/* Public routes */}
            {/* Layout cho public route */}
            <Route path="/" element={<PublicLayout />}>
                <Route index element={<Home />} />  {/* tức là / */}
                <Route path="about" element={<About />} />
                <Route path="appointment" element={<Appointment />} />
                <Route path="contact" element={<Contact />} />
                <Route path="price" element={<Price />} />
                <Route path="service" element={<Service />} />
                <Route path="team" element={<Team />} />
                <Route path="testimonial" element={<Testimonial />} />
                <Route path="login" element={<Login />} />
                <Route path="register" element={<Register />} />
            </Route>

            {/* Route riêng cho Unauthorized */}
            <Route path="/unauthorized" element={<Unauthorized />} />

            {/* Patient layout + routes */}
            <Route path="/patient" element={
                <PrivateRoute allowedRoles={["ROLE_PATIENT"]}>
                    <PatientLayout />
                </PrivateRoute> } >
                {/*<Route index element={<PatientDashboard />} />*/}
                {/*<Route path="profile" element={<PatientProfile />} />*/}
                <Route path="/patient/profile" element={<Profile />} />
                <Route path="medicalvisit" element={<MedicalVisit />} />
                <Route path="feedback" element={<PatientFeedback />} />
                <Route path="feedback/submit" element={<SubmitFeedback />} />
                <Route path="invoice" element={<Invoice />} />

            </Route>

            {/* Admin layout + routes */}
            <Route path="/admin" element={
                <PrivateRoute allowedRoles={["ROLE_ADMIN"]}>
                    <AdminLayout />
                </PrivateRoute>}>
                {/*<Route index element={<AdminDashboard />} />*/}
                {/*<Route path="users" element={<UserManagement />} />*/}
            </Route>

            {/* Receptionist layout + routes */}
            <Route path="/receptionist" element={
                <PrivateRoute allowedRoles={["ROLE_RECEPTIONIST"]}>
                    <ReceptionistLayout />
                </PrivateRoute>}>
                {/*<Route index element={<ReceptionistDashboard />} />*/}
                {/*<Route path="appointments" element={<ManageAppointments />} />*/}
            </Route>

            {/* 404 Not Found */}
            <Route path="*" element={<h1>404 Not Found</h1>} />
        </Routes>
        <Footer />
      </Router>
  );
}

export default App;
