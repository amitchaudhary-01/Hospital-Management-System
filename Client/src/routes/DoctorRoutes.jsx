import React from 'react';
import { Route } from 'react-router-dom';
import DashboardLayout from '../layouts/DashboardLayout';
import Dashboard from '../pages/doctor/Dashboard';
import Appointments from '../pages/doctor/Appointments';
import Prescriptions from '../pages/doctor/Prescriptions';

const DoctorRoutes = (
  <Route path="/doctor" element={<DashboardLayout />}>
    <Route index element={<Dashboard />} />
    <Route path="dashboard" element={<Dashboard />} />
    <Route path="appointments" element={<Appointments />} />
    <Route path="prescriptions" element={<Prescriptions />} />
  </Route>
);

export default DoctorRoutes;