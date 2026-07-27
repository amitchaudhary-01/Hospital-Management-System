import express from "express";
import {
  getPrescriptionPDF,
  createPrescription,
  getPrescriptionById,
  getPrescriptionsByAppointmentId,
  getPrescriptions, // <--- 1. Import your controller for fetching all prescriptions
} from "../controllers/prescription.controller.js";
import { isAuthenticated } from "../middlewares/auth.middleware.js";
import { authorizeRoles } from "../middlewares/role.middleware.js";

const router = express.Router();

/**
 * @route   POST /api/prescriptions
 * @desc    Create a new prescription
 * @access  Private (Doctor)
 */
router.post("/", isAuthenticated, authorizeRoles("doctor"), createPrescription);

/**
 * @route   GET /api/prescriptions
 * @desc    Get all prescriptions (paginated) for the logged-in user
 * @access  Private (Doctor, Patient)
 */
router.get("/", isAuthenticated, authorizeRoles("doctor", "patient"), getPrescriptions);

/**
 * @route   GET /api/prescriptions/appointment/:appointmentId
 * @desc    Get prescription details by appointment ID
 * @access  Private (Doctor, Patient)
 */
router.get("/appointment/:appointmentId", isAuthenticated, authorizeRoles("doctor", "patient"), getPrescriptionsByAppointmentId);

/**
 * @route   GET /api/prescriptions/:id
 * @desc    Get prescription details (JSON)
 * @access  Private (Doctor, Patient)
 */
router.get("/:id", isAuthenticated, authorizeRoles("doctor", "patient"), getPrescriptionById);

/**
 * @route   GET /api/prescriptions/:id/download
 * @desc    Download prescription as a PDF file
 * @access  Private (Doctor, Patient)
 */
router.get("/:id/download", isAuthenticated, authorizeRoles("doctor", "patient"), getPrescriptionPDF);

export default router;