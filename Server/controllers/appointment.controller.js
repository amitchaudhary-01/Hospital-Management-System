import { Appointment } from "../schemas/appointment.Schema.js";
import { User } from "../schemas/user.Schema.js";

export const bookAppointment = async (req, res) => {
    try {

        const { doctor, date, timeSlot, reason , /*specialization*/} = req.body;

        // Validation
        if (!doctor || !date || !timeSlot) {
            return res.status(400).json({
                success: false,
                message: "Please fill all required fields."
            });
        }

        // Check doctor exists
        const doctorExists = await User.findOne({
            _id: doctor,
            role: "doctor"
        });

        if (!doctorExists) {
            return res.status(404).json({
                success: false,
                message: "Doctor not found."
            });
        }

        // Check if doctor is already booked for this slot
        const existingSlot = await Appointment.findOne({
            doctor,
            date,
            timeSlot,
            status: { $ne: "Cancelled" } // Ignore cancelled slots
        });

        if (existingSlot) {
           return res.status(400).json({
           success: false,
           message: "This doctor is already booked for the selected date and time slot."
        });
        }

        // Create appointment
        const appointment = await Appointment.create({
            patient: req.user._id,
            doctor,
            date,
            timeSlot,
            reason
            /*specialization*/
            // status defaults to "Pending"
        });

        return res.status(201).json({
            success: true,
            message: "Appointment booked successfully.",
            appointment
        });

    } catch (error) {

        return res.status(500).json({
            success: false,
            message: error.message
        });

    }
};



export const getMyAppointments = async (req, res) => {
  try {
    // 1. Check if user is attached by auth middleware
    if (!req.user?._id) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized: User information missing.",
      });
    }

    // 2. Fetch and populate appointments
    const appointments = await Appointment.find({ patient: req.user._id })
      .populate("doctor", "name email contactNumber address specialization")
      .sort({ createdAt: -1 })
      .lean(); // Converts Mongoose Documents to plain JS objects (faster performance)

    // 3. Optional: Filter out or handle missing doctor populates safely
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

export const getDoctorAppointments = async (req, res) => {
    try {

        const appointments = await Appointment.find({
            doctor: req.user.id,
        })
            .populate("patient", "name email contactNumber address")
            .sort({ date: 1 });

        return res.status(200).json({
            success: true,
            appointments,
        });

    } catch (error) {

        return res.status(500).json({
            success: false,
            message: error.message,
        });

    }
};



// Keep allowed statuses matching your Mongoose Schema exactly
const ALLOWED_STATUSES = ["Pending", "Confirmed", "Cancelled", "Completed"];

export const updateAppointmentStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const userId = req.user._id;
    const userRole = req.user.role;

    // 1. Validate payload
    if (!status) {
      return res.status(400).json({
        success: false,
        message: "Status is required.",
      });
    }

    // Format input to Title Case (e.g. "confirmed" or "CONFIRMED" -> "Confirmed")
    const formattedStatus =
      status.charAt(0).toUpperCase() + status.slice(1).toLowerCase();

    if (!ALLOWED_STATUSES.includes(formattedStatus)) {
      return res.status(400).json({
        success: false,
        message: `Invalid status. Allowed values: ${ALLOWED_STATUSES.join(", ")}`,
      });
    }

    // 2. Fetch the appointment first to check ownership and state
    const appointment = await Appointment.findById(id);

    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: "Appointment not found.",
      });
    }

    // 3. Ownership Check: If doctor, make sure this appointment belongs to them
    if (
      userRole?.toLowerCase() === "doctor" &&
      appointment.doctor.toString() !== userId.toString()
    ) {
      return res.status(403).json({
        success: false,
        message: "Forbidden. You can only update your own appointments.",
      });
    }

    // 4. State Validation: Prevent modifying already finished/cancelled appointments
    if (["Cancelled", "Completed"].includes(appointment.status)) {
      return res.status(400).json({
        success: false,
        message: `Cannot change status of an appointment that is already ${appointment.status.toLowerCase()}.`,
      });
    }

    // 5. Perform update
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