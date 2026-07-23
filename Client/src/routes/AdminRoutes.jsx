import { Route } from "react-router-dom";
import AdminLayout from "../layouts/AdminLayout";
import AdminDashboard from "../pages/admin/AdminDashboard";
import AllDoctors from "../pages/admin/AllDoctors";
import AllPatients from "../pages/admin/AllPatients";
import AllAppointment from "../pages/admin/AllAppointment";
import CreateDoctor from "../pages/admin/CreateDoctor";

const AdminRoutes = (
  <Route path="/admin" element={<AdminLayout />}>
    <Route index element={<AdminDashboard />} />
    <Route path="dashboard" element={<AdminDashboard />} />
    <Route path="doctors" element={<AllDoctors/>}/>
    <Route path="patients" element={<AllPatients/>}/>
    <Route path="appointments" element={<AllAppointment/>}/>
    <Route path="doctor" element={<CreateDoctor/>}/>

    {/* Doctors */}
    <Route
      path="doctors"
      element={
        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
          <h2 className="text-2xl font-bold text-slate-800">All Doctors</h2>
        </div>
      }
    />

    {/* Patients */}
    <Route
      path="patients"
      element={
        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
          <h2 className="text-2xl font-bold text-slate-800">All Patients</h2>
        </div>
      }
    />

    {/* All Appointments */}
    <Route
      path="appointments"
      element={
        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
          <h2 className="text-2xl font-bold text-slate-800">All Appointments</h2>
        </div>
      }
    />

    {/* Pending Appointments */}
    <Route
      path="appointments/pending"
      element={
        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
          <h2 className="text-2xl font-bold text-slate-800">Pending Appointments</h2>
        </div>
      }
    />
  </Route>
);

export default AdminRoutes;