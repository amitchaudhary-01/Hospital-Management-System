import { Appointment } from "../schemas/appointment.Schema.js";
import { User } from "../schemas/user.Schema.js";

// Book Appointment (Patient)
export const bookAppointment = async (req, res) => {
  try {
    const { doctor, date, timeSlot, reason } = req.body;

    // Validation
    if (!doctor || !date || !timeSlot) {
      return res.status(400).json({
        success: false,
        message: "Please fill all required fields.",
      });
    }

    // Check doctor exists (case-insensitive role check)
    const doctorExists = await User.findOne({
      _id: doctor,
      role: { $regex: /^doctor$/i },
    });

    if (!doctorExists) {
      return res.status(404).json({
        success: false,
        message: "Doctor not found.",
      });
    }

    // Check if doctor is already booked for this slot
    const existingSlot = await Appointment.findOne({
      doctor,
      date,
      timeSlot,
      status: { $ne: "Cancelled" }, // Ignore cancelled slots
    });

    if (existingSlot) {
      return res.status(400).json({
        success: false,
        message:
          "This doctor is already booked for the selected date and time slot.",
      });
    }

    // Create appointment
    const appointment = await Appointment.create({
      patient: req.user._id,
      doctor,
      date,
      timeSlot,
      reason,
    });

    return res.status(201).json({
      success: true,
      message: "Appointment booked successfully.",
      appointment,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get My Appointments (Patient)
export const getMyAppointments = async (req, res) => {
  try {
    if (!req.user?._id) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized: User information missing.",
      });
    }

    const appointments = await Appointment.find({ patient: req.user._id })
      .populate("doctor", "name email contactNumber address specialization")
      .sort({ createdAt: -1 })
      .lean();

    return res.status(200).json({
      success: true,
      count: appointments.length,
      appointments,
    });
  } catch (error) {
    console.error("Error in getMyAppointments:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to retrieve appointments.",
    });
  }
};

// Get Doctor Appointments (Doctor)
export const getDoctorAppointments = async (req, res) => {
  try {
    // FIXED: Changed req.user.id to req.user._id
    const doctorId = req.user._id || req.user.id;

    const appointments = await Appointment.find({ doctor: doctorId })
      .populate("patient", "name email contactNumber address")
      .sort({ date: 1 });

    return res.status(200).json({
      success: true,
      count: appointments.length,
      appointments,
    });
  } catch (error) {
    console.error("Error in getDoctorAppointments:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to retrieve doctor appointments.",
    });
  }
};

// Update Status (Doctor / Patient / Admin)
const ALLOWED_STATUSES = ["Pending", "Confirmed", "Cancelled", "Completed"];

export const updateAppointmentStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const userId = req.user._id;
    const userRole = req.user.role;

    if (!status) {
      return res.status(400).json({
        success: false,
        message: "Status is required.",
      });
    }

    const formattedStatus =
      status.charAt(0).toUpperCase() + status.slice(1).toLowerCase();

    if (!ALLOWED_STATUSES.includes(formattedStatus)) {
      return res.status(400).json({
        success: false,
        message: `Invalid status. Allowed values: ${ALLOWED_STATUSES.join(", ")}`,
      });
    }

    const appointment = await Appointment.findById(id);

    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: "Appointment not found.",
      });
    }

    if (
      userRole?.toLowerCase() === "doctor" &&
      appointment.doctor.toString() !== userId.toString()
    ) {
      return res.status(403).json({
        success: false,
        message: "Forbidden. You can only update your own appointments.",
      });
    }

    if (["Cancelled", "Completed"].includes(appointment.status)) {
      return res.status(400).json({
        success: false,
        message: `Cannot change status of an appointment that is already ${appointment.status.toLowerCase()}.`,
      });
    }

    appointment.status = formattedStatus;
    await appointment.save();

    return res.status(200).json({
      success: true,
      message: `Appointment status updated to ${formattedStatus}.`,
      data: appointment,
    });
  } catch (error) {
    console.error("Error updating appointment status:", error);

    if (error.name === "CastError" || error.kind === "ObjectId") {
      return res.status(400).json({
        success: false,
        message: "Invalid appointment ID format.",
      });
    }

    return res.status(500).json({
      success: false,
      message: "Internal server error while updating appointment status.",
    });
  }
};

export const addPrescription = async (req, res) => {};
export const getAllAppointments = async (req, res) => {};
export const deleteAppointment = async (req, res) => {};