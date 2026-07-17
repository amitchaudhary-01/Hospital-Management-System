import express from "express";
import {
  createDoctor,
  getAllDoctors,
  getAllPatients,
  updateDoctor,
  deleteDoctor,
  getDoctorById,
  adminDashboard,
} from "../controllers/admin.controller.js";

import { isAuthenticated } from "../middlewares/auth.middleware.js";
import { authorizeRoles } from "../middlewares/role.middleware.js";

const router = express.Router();

// Only admin can access these routes
router.post("/doctor", isAuthenticated, authorizeRoles("admin"), createDoctor);

router.get("/doctors", isAuthenticated, authorizeRoles("admin"), getAllDoctors);

router.get("/doctor/:id",isAuthenticated, authorizeRoles("admin"),getDoctorById)

router.get("/patients", isAuthenticated, authorizeRoles("admin"), getAllPatients);

router.put("/doctor/:id", isAuthenticated, authorizeRoles("admin"), updateDoctor);

router.delete( "/doctor/:id", isAuthenticated, authorizeRoles("admin"), deleteDoctor);

router.get("/dashboard", isAuthenticated, authorizeRoles("admin"), adminDashboard);

import { getDashboardStats } from "../controllers/admin.controller.js";

router.get( "/dashboard", isAuthenticated, authorizeRoles("admin"),
    getDashboardStats);

export default router;