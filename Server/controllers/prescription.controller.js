import { Prescription } from "../schemas/prescription.Schema.js";
import { Appointment } from "../schemas/appointment.Schema.js";
import { generatePDFBuffer } from "../utils/pdfGenerator.js";

// Create Prescription
export const createPrescription = async (req, res) => {
  try {
    const {
      appointment,
      diagnosis,
      medicines,
      advice,
      followUpDate,
    } = req.body;

    // Logged-in doctor
    const doctor = req.user._id;

    // 1. CHECK APPOINTMENT ID
    if (!appointment) {
      return res.status(400).json({
        success: false,
        message: "Appointment ID is required.",
      });
    }

    // 2. CHECK MEDICINES
    if (!medicines || medicines.length === 0) {
      return res.status(400).json({
        success: false,
        message: "At least one medicine is required.",
      });
    }

    // 3. FIND APPOINTMENT
    const appointmentData = await Appointment.findById(appointment);

    if (!appointmentData) {
      return res.status(404).json({
        success: false,
        message: "Appointment not found.",
      });
    }

    // 4. GET PATIENT FROM APPOINTMENT
    const patient = appointmentData.patient;

    if (!patient) {
      return res.status(400).json({
        success: false,
        message: "Patient not found in appointment.",
      });
    }

    // 5. VERIFY DOCTOR
    if (appointmentData.doctor.toString() !== doctor.toString()) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to prescribe for this appointment.",
      });
    }

    // 6. CREATE PRESCRIPTION
    const prescription = await Prescription.create({
      appointment: appointmentData._id,
      doctor,
      patient,
      diagnosis,
      medicines,
      advice,
      followUpDate,
    });

    // 7. UPDATE APPOINTMENT STATUS
    appointmentData.status = "Completed";
    await appointmentData.save();

    // 8. SEND RESPONSE
    return res.status(201).json({
      success: true,
      message: "Prescription created successfully.",
      prescription,
    });
  } catch (error) {
    console.error("Create Prescription Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to create prescription.",
    });
  }
};

// Get Prescription JSON Details By ID
export const getPrescriptionById = async (req, res) => {
  try {
    const { id } = req.params;

    const prescription = await Prescription.findById(id)
      .populate("doctor", "name specialization contactNumber email")
      .populate("patient", "name gender contactNumber age email");

    if (!prescription) {
      return res.status(404).json({
        success: false,
        message: "Prescription not found",
      });
    }

    return res.status(200).json({
      success: true,
      prescription,
    });
  } catch (error) {
    console.error("Fetch Prescription Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch prescription",
    });
  }
};

// Get Prescriptions By Appointment ID (Paginated)
export const getPrescriptionsByAppointmentId = async (req, res) => {
  try {
    const { appointmentId } = req.params;
    const page = Math.max(1, parseInt(req.query.page) || 1);
    const limit = Math.max(1, parseInt(req.query.limit) || 10);
    const skip = (page - 1) * limit;

    const filter = { appointment: appointmentId };

    const [prescriptions, totalCount] = await Promise.all([
      Prescription.find(filter)
        .populate("doctor", "name specialization contactNumber")
        .populate("patient", "name gender contactNumber age")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      Prescription.countDocuments(filter),
    ]);

    const totalPages = Math.ceil(totalCount / limit);

    return res.status(200).json({
      success: true,
      prescriptions,
      pagination: {
        totalCount,
        totalPages,
        currentPage: page,
        pageSize: limit,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1,
      },
    });
  } catch (error) {
    console.error("Fetch Prescriptions Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch prescriptions",
    });
  }
};

// Get All Prescriptions (Paginated - Patient/Doctor/Admin)
export const getAllPrescriptions = async (req, res) => {
  try {
    const page = Math.max(1, parseInt(req.query.page) || 1);
    const limit = Math.max(1, parseInt(req.query.limit) || 10);
    const skip = (page - 1) * limit;

    const filter = {};

    // Filter by role or query parameter
    if (req.user?.role?.toLowerCase() === "patient") {
      filter.patient = req.user._id;
    } else if (req.user?.role?.toLowerCase() === "doctor") {
      filter.doctor = req.user._id;
    } else {
      // Optional explicit query filters for admins
      if (req.query.patientId) filter.patient = req.query.patientId;
      if (req.query.doctorId) filter.doctor = req.query.doctorId;
    }

    const [prescriptions, totalCount] = await Promise.all([
      Prescription.find(filter)
        .populate("doctor", "name specialization contactNumber")
        .populate("patient", "name gender contactNumber age")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      Prescription.countDocuments(filter),
    ]);

    const totalPages = Math.ceil(totalCount / limit);

    return res.status(200).json({
      success: true,
      prescriptions,
      pagination: {
        totalCount,
        totalPages,
        currentPage: page,
        pageSize: limit,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1,
      },
    });
  } catch (error) {
    console.error("Fetch All Prescriptions Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch prescriptions list",
    });
  }
};

// Download Prescription PDF
export const getPrescriptionPDF = async (req, res) => {
  try {
    const prescription = await Prescription.findById(req.params.id)
      .populate("doctor", "name specialization contactNumber")
      .populate("patient", "name gender contactNumber age");

    if (!prescription) {
      return res.status(404).json({ message: "Prescription not found" });
    }

    const pdfBuffer = await generatePDFBuffer(prescription);

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename=prescription-${prescription._id}.pdf`
    );

    return res.send(pdfBuffer);
  } catch (err) {
    console.error("PDF Generation Error:", err);
    return res.status(500).json({ message: "Error generating PDF" });
  }
};


// Check your backend controller query filter:
export const getPrescriptions = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 5;
    const skip = (page - 1) * limit;

    // IMPORTANT: Verify whether your schema uses 'doctor' or 'doctorId'
    const filter = req.user.role === "doctor" 
      ? { doctor: req.user._id } // OR { doctorId: req.user._id }
      : { patient: req.user._id }; // OR { patientId: req.user._id }

    const totalCount = await Prescription.countDocuments(filter);
    const prescriptions = await Prescription.find(filter)
      .populate("patient", "name age gender") // adjust populate path if needed
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    res.status(200).json({
      success: true,
      prescriptions,
      pagination: {
        totalCount,
        totalPages: Math.ceil(totalCount / limit),
        currentPage: page,
        pageSize: limit,
        hasNextPage: page < Math.ceil(totalCount / limit),
        hasPrevPage: page > 1,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};