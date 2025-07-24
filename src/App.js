
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
// import PatientDashboard from "./pages/patient/PatientDashboard";

import ReceptionistDashboard from './pages/receptionist/ReceptionistDashboard';
import RoomList from "./pages/receptionist/RoomList";
import PatientList from "./pages/receptionist/PatientList";
import PatientHistory from "./pages/receptionist/PatientHistory";
import DoctorList from "./pages/receptionist/DoctorList";

import AppointmentReceptionist from "./pages/receptionist/AppointmentReceptionist";
import MedicalVisit from "./pages/patient/MedicalVisit";
import PrivateRoute from "./components/PrivateRoute";
import PatientFeedback from "./pages/patient/PatientFeedback";
import SubmitFeedback from "./pages/patient/SubmitFeedback";
import Profile from "./pages/patient/Profile";
import BookingForm from "./pages/patient/BookingForm";
import BookingSuccess from "./pages/patient/BookingSuccess";
import HistoryAppointment from"./pages/patient/HistoryAppointment";
import UserAccountPage from "./pages/admin/UserAccountPage";
import UserPatientPage from "./pages/admin/UserPatientPage";
import UserReceptionistPage from "./pages/admin/UserReceptionistPage";
import UserActivityLogPage from "./pages/admin/UserActivityLogPage";
import ChangePassword from "./pages/patient/ChangePassword";

import DoctorDetail from "./pages/DoctorDetail";
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
                <Route path="doctor/:id" element={<DoctorDetail />} />
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
                    </PrivateRoute>
                }>
                    {/* <Route index element={<PatientDashboard />} /> */}
                    {/*<Route path="profile" element={<PatientProfile />} />*/}
                    <Route path="booking" element={<BookingForm />} />
                    <Route path="booking-success" element={<BookingSuccess />} />
                    <Route path="appointments/history" element={<HistoryAppointment />} />
                    <Route path="profile" element={<Profile />} />
                    <Route path="medicalvisit" element={<MedicalVisit />} />
                    <Route path="feedback" element={<PatientFeedback />} />
                    <Route path="feedback/submit" element={<SubmitFeedback />} />
                    <Route path="change-password" element={<ChangePassword />} />
                </Route>
                

                {/* Admin layout + routes */}
                <Route path="/admin" element={
                    <PrivateRoute allowedRoles={["ROLE_ADMIN"]}>
                        <AdminLayout />
                    </PrivateRoute>}>
                    <Route path="usersAccount" element={<UserAccountPage />} />
                    <Route path="usersPatient" element={<UserPatientPage />} />
                    <Route path="usersReceptionist" element={<UserReceptionistPage />} />
                    <Route path="usersActivityLog" element={<UserActivityLogPage />} />
                    {/*<Route index element={<AdminDashboard />} />*/}
                    {/*<Route path="users" element={<UserManagement />} />*/}
                </Route>

            {/* Receptionist layout + routes */}
            <Route path="/receptionist" element={
                <PrivateRoute allowedRoles={["ROLE_RECEPTIONIST"]}>
                    <ReceptionistLayout />
                </PrivateRoute>}>
                {/*<Route index element={<ReceptionistDashboard />} />*/} 
                    <Route index element={<ReceptionistDashboard />} />   
                    <Route path="patients" element={<PatientList />} />
                    <Route path="rooms" element={<RoomList />} />
                    <Route path="/receptionist/patient-history/:id" element={<PatientHistory />} />
                    <Route path="/receptionist/doctors" element={<DoctorList />} />
                    <Route path="appointments" element={<AppointmentReceptionist />} />
                    
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
