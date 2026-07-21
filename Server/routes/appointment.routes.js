import express from "express";
import {
    bookAppointment,
    getMyAppointments,
    getDoctorAppointments,
    updateAppointmentStatus,
    addPrescription,
    getAllAppointments,
    deleteAppointment
} from "../controllers/appointment.controller.js";

import { isAuthenticated } from "../middlewares/auth.middleware.js";
import { authorizeRoles } from "../middlewares/role.middleware.js";

const router = express.Router();

/* ---------- Patient ---------- */
router.post( "/", isAuthenticated, authorizeRoles("patient"), bookAppointment);

router.get("/my", isAuthenticated, authorizeRoles("patient"), getMyAppointments);

/* ---------- Doctor ---------- */
router.get("/doctor", isAuthenticated, authorizeRoles("doctor"), getDoctorAppointments);

router.put("/:id/status", isAuthenticated, authorizeRoles("doctor","admin"), updateAppointmentStatus);

router.put("/:id/prescription", isAuthenticated, authorizeRoles("doctor"),
    addPrescription);

/* ---------- Admin ---------- */
router.get("/", isAuthenticated, authorizeRoles("admin"),
    getAllAppointments);

router.delete( "/:id", isAuthenticated, authorizeRoles("admin"), deleteAppointment);

export default router;