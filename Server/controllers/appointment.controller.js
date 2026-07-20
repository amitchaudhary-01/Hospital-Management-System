import { Appointment } from "../schemas/appointment.Schema.js";
import { User } from "../schemas/user.Schema.js";

export const bookAppointment = async (req, res) => {
    try {

        const { doctor, date, timeSlot, reason , specialization} = req.body;

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

        // Create appointment
        const appointment = await Appointment.create({
            patient: req.user._id,
            doctor,
            date,
            timeSlot,
            reason,
            specialization
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

export const getDoctorAppointments = async (req, res) => {};

export const updateAppointmentStatus = async (req, res) => {};

export const addPrescription = async (req, res) => {};

export const getAllAppointments = async (req, res) => {};

export const deleteAppointment = async (req, res) => {};