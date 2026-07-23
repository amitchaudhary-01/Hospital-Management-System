import { Route } from "react-router-dom";
import AdminLayout from "../layouts/AdminLayout";
import AdminDashboard from "../pages/admin/AdminDashboard";

const AdminRoutes = (
  <Route path="/admin" element={<AdminLayout />}>
    <Route index element={<AdminDashboard />} />
    <Route path="dashboard" element={<AdminDashboard />} />

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