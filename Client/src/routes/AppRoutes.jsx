import { Routes, Route } from "react-router-dom";
import Login from "../pages/auth/Login";
import SignUp from "../pages/auth/SignUp";

import PatientRoutes from "./PatientRoutes";
import DoctorRoutes from "./DoctorRoutes";
import AdminRoutes from "./AdminRoutes";
import LandingPage from "../layouts/LandingPage";
import ContactUs from "../components/common/ContactUs";
import Doctor from "../components/common/Doctor";
import HowItWork from "../components/common/HowItWork";
import Main from "../MainLayout/Main";
import About from "../components/common/About";

const AppRoutes = () => {
  return (
    <Routes>
      {/* Layout wrapper with Navbar and Footer */}
      <Route path="/" element={<Main />}>
        <Route index element={<LandingPage />} />
        <Route path="contact" element={<ContactUs />} />
        <Route path="doctors" element={<Doctor />} />
        <Route path="process" element={<HowItWork />} />
        <Route path="about" element={<About />} />
      </Route>

      {/* Public Auth Routes */}
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