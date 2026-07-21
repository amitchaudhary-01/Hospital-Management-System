import express from "express";
import {
  // getDoctorAppointments,
  getDoctorDashboard,
  // updateAppointmentStatus,
  // writePrescription,
} from "../controllers/doctor.controller.js";

import { isAuthenticated } from "../middlewares/auth.middleware.js";
import { authorizeRoles } from "../middlewares/role.middleware.js";

const router = express.Router();

// // GET all appointments for logged-in doctor
// router.get("/appointments", isAuthenticated, authorizeRoles("doctor"), getDoctorAppointments);

// // PATCH update status (Changed /appointment/ to /appointments/ to match frontend)
// router.patch("/appointments/:id/status", isAuthenticated, authorizeRoles("doctor"), updateAppointmentStatus);

// // PATCH write prescription (Changed /appointment/ to /appointments/)
// router.patch("/appointments/:id/prescription", isAuthenticated, authorizeRoles("doctor"), writePrescription);

// GET dashboard stats (Added "doctor" role argument)
router.get("/dashboard", isAuthenticated, authorizeRoles("doctor"), getDoctorDashboard);

export default router;