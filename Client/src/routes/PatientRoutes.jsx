import { Route } from "react-router-dom";
import PatientLayout from "../layouts/PatientLayout";
import PatientHome from "../pages/patient/PatientHome";
import Appointment from "../pages/patient/Appointment";
import PatientProfile from "../pages/patient/PatientProfile";
import BookAppointment from "../pages/patient/BookAppointment";

const PatientRoutes = (
  <Route path="/patient" element={<PatientLayout />}>
    <Route index element={<PatientHome />} />
    <Route path="home" element={<PatientHome />} />
    <Route path="appointments" element={<Appointment />} />
    <Route path="book/:doctorId" element={<BookAppointment />} />
    <Route path="profile" element={<PatientProfile />} />
  </Route>
);

export default PatientRoutes;