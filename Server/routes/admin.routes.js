import express from "express";
import {
  createDoctor,
  getAllDoctors,
  getAllPatients,
  updateDoctor,
  deleteDoctor,
  getDoctorById,
  getAllAppointments,
  getPendingAppointments,
  cancelAppointmentByAdmin,
  // adminDashboard,
} from "../controllers/admin.controller.js";
import { getDashboardStats } from "../controllers/admin.controller.js";


import { isAuthenticated } from "../middlewares/auth.middleware.js";
import { authorizeRoles } from "../middlewares/role.middleware.js";

const router = express.Router();


router.get("/dashboard", isAuthenticated, authorizeRoles("admin"),getDashboardStats);


// Only admin can access these routes
router.post("/doctor", isAuthenticated, authorizeRoles("admin"), createDoctor);

router.get("/doctors", isAuthenticated, authorizeRoles("admin"), getAllDoctors);

router.get("/doctor/:id",isAuthenticated, authorizeRoles("admin"),getDoctorById)

router.put("/doctor/:id", isAuthenticated, authorizeRoles("admin"), updateDoctor);

router.delete( "/doctor/:id", isAuthenticated, authorizeRoles("admin"), deleteDoctor);


router.get("/patients", isAuthenticated, authorizeRoles("admin"), getAllPatients);



router.get("/appointments",isAuthenticated , authorizeRoles("admin"),getAllAppointments)

router.get("/appointments/pending", isAuthenticated , authorizeRoles("admin"),getPendingAppointments)

router.put("/appointments/:id/cancel", isAuthenticated , authorizeRoles("admin"),cancelAppointmentByAdmin)

export default router;