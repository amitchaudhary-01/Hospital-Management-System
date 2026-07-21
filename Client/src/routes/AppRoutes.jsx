import { Routes, Route } from "react-router-dom";
import Login from "../pages/auth/Login";
import SignUp from "../pages/auth/SignUp";

import PatientRoutes from "./PatientRoutes";
import DoctorRoutes from "./DoctorRoutes";

const AppRoutes = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<SignUp />} />

      {/* Nested Patient Routes */}
      {PatientRoutes}

      {DoctorRoutes}

      {/* Catch-all fallback if someone types a broken URL */}
      <Route path="*" element={<div>Page Not Found</div>} />
    </Routes>
  );
};

export default AppRoutes;