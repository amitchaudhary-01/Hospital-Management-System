import { Routes, Route } from "react-router-dom";
import Login from "../pages/auth/Login";
import SignUp from "../pages/auth/SignUp";
import PatientLayout from "../layouts/PatientLayout";
import PatientHome from "../pages/patient/PatientHome";
import Appointment from "../pages/patient/Appointment"; // Using your file from earlier steps
import BookAppointment from "../pages/patient/BookAppointment";
import PatientProfile from "../pages/patient/PatientProfile";

const AppRoutes = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<SignUp />} />

      {/* Nested Patient Routes */}
      <Route path="/patient" element={<PatientLayout />}>
        {/* This handles the base "/patient" path */}
        <Route index element={<PatientHome />} /> 
        
        {/* This explicitly maps the "/patient/home" path */}
        <Route path="home" element={<PatientHome />} /> 
        
        {/* This maps the "/patient/appointments" path */}
        <Route path="appointments" element={<Appointment />} />
       
        <Route path="/patient/book/:doctorId" element={<BookAppointment />} />

        <Route path="profile" element={<PatientProfile />} /> 

        
      </Route>

      {/* Catch-all fallback if someone types a broken URL */}
      <Route path="*" element={<div>Page Not Found</div>} />
    </Routes>
  );
};

export default AppRoutes;