import { Routes, Route } from "react-router-dom";
import Login from "../pages/auth/Login";
import SignUp from "../pages/auth/SignUp";

import PatientRoutes from "./PatientRoutes";
import DoctorRoutes from "./DoctorRoutes";
import AdminRoutes from "./AdminRoutes";

const AppRoutes = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<SignUp />} />

      {/* Patient Routes */}
      {PatientRoutes}

      {/* Doctor Routes */}
      {DoctorRoutes}

      {/* Admin Routes */}
      {AdminRoutes}

      {/* Catch-all fallback */}
      <Route path="*" element={<div>Page Not Found</div>} />
    </Routes>
  );
};

export default AppRoutes;