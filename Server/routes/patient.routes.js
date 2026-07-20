import express from "express";
import { isAuthenticated } from "../middlewares/auth.middleware.js";
import { authorizeRoles } from "../middlewares/role.middleware.js";
import {
  getAllDoctors,
  getPatientProfile,
  updatePatientProfile,
  // getMyAppointments,
} from "../controllers/patient.controller.js";

const router = express.Router();

// router.get(
//   "/appointments",
//   isAuthenticated,
//   authorizeRoles("patient"),
//   getMyAppointments
// );

router.get("/doctors", isAuthenticated, authorizeRoles("patient"), getAllDoctors);

router.route("/profile").get(isAuthenticated, getPatientProfile).put(isAuthenticated, updatePatientProfile);

export default router;