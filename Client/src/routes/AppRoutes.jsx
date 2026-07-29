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

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Main/>}/>
      <Route path="/contact" element={<ContactUs/>}/>
      <Route path="/doctors" element={<Doctor/>}/>
      <Route path="/process" element={<HowItWork/>}/>



      {/* <Route path="/" element={<LandingPage/>}/>

      <Route path="/contact" element={<ContactUs/>}/>
      <Route path="/doctors" element={<Doctor/>}/>
      <Route path="/process" element={<HowItWork/>}/>*/}
      {/* Public Routes */}
      {/* <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<SignUp />} />  */}

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