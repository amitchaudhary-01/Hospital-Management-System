import express from "express";
import { isAuthenticated } from "../middlewares/auth.middleware.js";
import { authorizeRoles } from "../middlewares/role.middleware.js";
import { getMyAppointments } from "../controllers/patient.controller.js";

const router = express.Router();

router.get("/appointments", isAuthenticated, authorizeRoles("patient"),
    getMyAppointments);

export default router;