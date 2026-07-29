import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

import connectDB from "./config/db.js";

// Routes
import appointmentRoutes from "./routes/appointment.routes.js";
import authRoutes from "./routes/auth.routes.js";
import adminRoutes from "./routes/admin.routes.js";
import doctorRoutes from "./routes/doctor.routes.js";
import patientRoutes from "./routes/patient.routes.js";
import prescriptionRoutes from "./routes/prescription.routes.js";
import contactRoutes from "./routes/contact.routes.js";

const app = express();

// Database Connection
connectDB();

// CORS Configuration
const allowedOrigins = [
  "http://localhost:5173",
  "https://hospital-management-system-r7w7.onrender.com",
  process.env.CLIENT_URL, // Optional: add via backend environment variables
].filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps, curl, or Postman)
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error(`Origin ${origin} blocked by CORS`));
      }
    },
    credentials: true,
  })
);

app.set("trust proxy", 1);
app.use(express.json());
app.use(cookieParser());

// Base Route
app.get("/", (req, res) => {
  res.send("API Running and Connected DB");
});

// API Routes
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/admin", adminRoutes);
app.use("/api/v1/doctor", doctorRoutes);
app.use("/api/v1/patient", patientRoutes);
app.use("/api/v1/appointments", appointmentRoutes);
app.use("/api/v1/prescription", prescriptionRoutes);
app.use("/api/v1", contactRoutes); // Serves /api/v1/send-inquiry

// 404 Handler for undefined routes
app.use((req, res) => {
  res.status(404).json({ success: false, message: "Route not found" });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error("Server Error:", err.stack);
  res.status(500).json({
    success: false,
    message: err.message || "Internal Server Error",
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});