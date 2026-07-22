import { Prescription } from "../schemas/prescription.Schema.js";
import { Appointment } from "../schemas/appointment.Schema.js";
import { generatePDFBuffer } from "../utils/pdfGenerator.js";

// Create Prescription
export const createPrescription = async (req,res) => {
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

    // =================================
    // 1. CHECK APPOINTMENT ID
    // =================================
    if (!appointment) {
      return res.status(400).json({
        success: false,
        message:
          "Appointment ID is required.",
      });
    }

    // =================================
    // 2. CHECK MEDICINES
    // =================================
    if (
      !medicines ||
      medicines.length === 0
    ) {
      return res.status(400).json({
        success: false,
        message:
          "At least one medicine is required.",
      });
    }

    // =================================
    // 3. FIND APPOINTMENT
    // =================================
    const appointmentData =
      await Appointment.findById(
        appointment
      );

    if (!appointmentData) {
      return res.status(404).json({
        success: false,
        message:
          "Appointment not found.",
      });
    }

    // =================================
    // 4. GET PATIENT FROM APPOINTMENT
    // =================================
    const patient =
      appointmentData.patient;

    if (!patient) {
      return res.status(400).json({
        success: false,
        message:
          "Patient not found in appointment.",
      });
    }

    // =================================
    // 5. VERIFY DOCTOR
    // =================================
    if (
      appointmentData.doctor.toString() !==
      doctor.toString()
    ) {
      return res.status(403).json({
        success: false,
        message:
          "You are not authorized to prescribe for this appointment.",
      });
    }

    // =================================
    // 6. CREATE PRESCRIPTION
    // =================================
    const prescription =
      await Prescription.create({
        appointment:
          appointmentData._id,

        doctor,

        patient,

        diagnosis,

        medicines,

        advice,

        followUpDate,
      });

    // =================================
    // 7. UPDATE APPOINTMENT STATUS
    // =================================
    appointmentData.status =
      "Completed";

    await appointmentData.save();

    // =================================
    // 8. SEND RESPONSE
    // =================================
    return res.status(201).json({
      success: true,

      message:
        "Prescription created successfully.",

      prescription,
    });
  } catch (error) {
    console.error(
      "Create Prescription Error:",
      error
    );

    return res.status(500).json({
      success: false,

      message:
        "Failed to create prescription.",
    });
  }
};

// Get Prescription JSON Details
export const getPrescriptionById = async (req, res) => {
  try {
    const { id } = req.params;

    const prescription = await Prescription.findById(id)
      .populate("doctor", "name specialization contactNumber")
      .populate("patient", "name gender contactNumber age");

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
    console.error(
      "Fetch Prescription Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Failed to fetch prescription",
    });
  }
};


export const getPrescriptionsByAppointmentId = async (req, res) => {
  try {
    const { appointmentId } = req.params;

    const prescriptions = await Prescription.find({
      appointment: appointmentId,
    })
      .populate("doctor", "name specialization contactNumber")
      .populate("patient", "name gender contactNumber age");

    return res.status(200).json({
      success: true,
      prescriptions,
    });
  } catch (error) {
    console.error("Fetch Prescriptions Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch prescriptions",
    });
  }
};



// Download Prescription PDF
export const getPrescriptionPDF = async (req, res) => {
  try {
    const prescription = await Prescription.findById(req.params.id)
      .populate("doctor", "name specialty contactNumber")
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