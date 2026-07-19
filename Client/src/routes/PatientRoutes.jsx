import { Route } from "react-router-dom";
import PatientLayout from "../layouts/PatientLayout";
import PatientHome from "../pages/patient/PatientHome";
import Appointment from "../pages/patient/Appointment"; // Using your existing file seen in image

// Inside your main route declaration layout:
<Route path="/patient" element={<PatientLayout />}>
  <Route index element={<PatientHome />} />
  <Route path="home" element={<PatientHome />} />
  <Route path="appointments" element={<Appointment />} />
</Route>