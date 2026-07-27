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

// Get My Appointments (Patient - Paginated)
export const getMyAppointments = async (req, res) => {
  try {
    if (!req.user?._id) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized: User information missing.",
      });
    }

    const page = Math.max(1, parseInt(req.query.page) || 1);
    const limit = Math.max(1, parseInt(req.query.limit) || 10);
    const skip = (page - 1) * limit;

    const filter = { patient: req.user._id };

    // Fetch paginated data and total count in parallel
    const [appointments, totalCount] = await Promise.all([
      Appointment.find(filter)
        .populate("doctor", "name email contactNumber address specialization")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      Appointment.countDocuments(filter),
    ]);

    const totalPages = Math.ceil(totalCount / limit);

    return res.status(200).json({
      success: true,
      appointments,
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
    console.error("Error in getMyAppointments:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to retrieve appointments.",
    });
  }
};

// Get Doctor Appointments (Doctor - Paginated)
export const getDoctorAppointments = async (req, res) => {
  try {
    const doctorId = req.user._id || req.user.id;

    const page = Math.max(1, parseInt(req.query.page) || 1);
    const limit = Math.max(1, parseInt(req.query.limit) || 10);
    const skip = (page - 1) * limit;

    const filter = { doctor: doctorId };

    const [appointments, totalCount] = await Promise.all([
      Appointment.find(filter)
        .populate("patient", "name email contactNumber address")
        .sort({ date: 1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      Appointment.countDocuments(filter),
    ]);

    const totalPages = Math.ceil(totalCount / limit);

    return res.status(200).json({
      success: true,
      appointments,
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
    console.error("Error in getDoctorAppointments:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to retrieve doctor appointments.",
    });
  }
};

// Get All Appointments (Admin - Paginated)
export const getAllAppointments = async (req, res) => {
  try {
    const page = Math.max(1, parseInt(req.query.page) || 1);
    const limit = Math.max(1, parseInt(req.query.limit) || 10);
    const skip = (page - 1) * limit;

    // Optional status or date filter support from query params
    const filter = {};
    if (req.query.status) {
      filter.status = req.query.status;
    }

    const [appointments, totalCount] = await Promise.all([
      Appointment.find(filter)
        .populate("patient", "name email contactNumber")
        .populate("doctor", "name email specialization")
        .sort({ date: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      Appointment.countDocuments(filter),
    ]);

    const totalPages = Math.ceil(totalCount / limit);

    return res.status(200).json({
      success: true,
      appointments,
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
    console.error("Error in getAllAppointments:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to retrieve all appointments.",
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

// Add Prescription (Doctor)
export const addPrescription = async (req, res) => {
  try {
    const { id } = req.params;
    const { prescription } = req.body;

    if (!prescription) {
      return res.status(400).json({
        success: false,
        message: "Prescription content is required.",
      });
    }

    const appointment = await Appointment.findById(id);

    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: "Appointment not found.",
      });
    }

    // Check if the current user is the doctor for this appointment
    if (appointment.doctor.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "Forbidden. You can only attach prescriptions to your own appointments.",
      });
    }

    appointment.prescription = prescription;
    await appointment.save();

    return res.status(200).json({
      success: true,
      message: "Prescription attached successfully.",
      appointment,
    });
  } catch (error) {
    console.error("Error adding prescription:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to add prescription.",
    });
  }
};

// Delete Appointment (Admin or Patient)
export const deleteAppointment = async (req, res) => {
  try {
    const { id } = req.params;

    const appointment = await Appointment.findById(id);

    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: "Appointment not found.",
      });
    }

    await appointment.deleteOne();

    return res.status(200).json({
      success: true,
      message: "Appointment deleted successfully.",
    });
  } catch (error) {
    console.error("Error deleting appointment:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to delete appointment.",
    });
  }
};