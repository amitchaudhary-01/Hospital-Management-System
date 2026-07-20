import express from "express";
import { isAuthenticated } from "../middlewares/auth.middleware.js";
import { authorizeRoles } from "../middlewares/role.middleware.js";
import {
  getAllDoctors,
  // getMyAppointments,
} from "../controllers/patient.controller.js";

const router = express.Router();

// router.get(
//   "/appointments",
//   isAuthenticated,
//   authorizeRoles("patient"),
//   getMyAppointments
// );

router.get(
  "/doctors",
  isAuthenticated,
  authorizeRoles("patient"),
  getAllDoctors
);

export default router;