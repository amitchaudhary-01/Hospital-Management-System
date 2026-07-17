import express from "express";
import {
  getDoctorAppointments,
  updateAppointmentStatus,
  writePrescription,
} from "../controllers/doctor.controller.js";

import { isAuthenticated } from "../middlewares/auth.middleware.js";
import { authorizeRoles } from "../middlewares/role.middleware.js";

const router = express.Router();

router.get("/appointments", isAuthenticated, authorizeRoles("doctor"), getDoctorAppointments);

router.patch("/appointment/:id/status", isAuthenticated, authorizeRoles("doctor"), updateAppointmentStatus);

router.patch("/appointment/:id/prescription", isAuthenticated, authorizeRoles("doctor"), writePrescription);

export default router;