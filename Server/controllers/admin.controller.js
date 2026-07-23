import bcrypt from "bcrypt";
import { User } from "../schemas/user.Schema.js";
import { Appointment } from "../schemas/appointment.Schema.js";

// ==========================================
// CREATE DOCTOR
// ==========================================
export const createDoctor = async (req, res) => {
    try {
        const {
            name,
            email,
            password,
            specialization,
            contactNumber,
            address,
        } = req.body;

        // Validation
        if (
            !name ||
            !email ||
            !password ||
            !specialization ||
            !contactNumber ||
            !address
        ) {
            return res.status(400).json({
                success: false,
                message: "Please fill all required fields.",
            });
        }

        // Check if email already exists
        const existingUser = await User.findOne({ email });

        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: "Email already exists.",
            });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create doctor
        const doctor = await User.create({
            name,
            email,
            password: hashedPassword,
            role: "doctor",
            specialization,
            contactNumber,
            address,
        });

        return res.status(201).json({
            success: true,
            message: "Doctor created successfully.",
            doctor: {
                id: doctor._id,
                name: doctor.name,
                email: doctor.email,
                role: doctor.role,
                specialization: doctor.specialization,
                contactNumber: doctor.contactNumber,
                address: doctor.address,
            },
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

// ==========================================
// GET ALL DOCTORS
// ==========================================

export const getAllDoctors = async (req, res) => {
  try {
    const doctors = await User.find({ role: "doctor" })
      .select("-password")
      .sort({ createdAt: -1 })
      .lean();

    return res.status(200).json({
      success: true,
      count: doctors.length,
      doctors,
    });
  } catch (error) {
    console.error("Get All Doctors Error:", error);

    return res.status(500).json({
      success: false,
      message: error.message || "Failed to fetch doctors list.",
    });
  }
};

// ==========================================
// GET ALL PATIENTS
// ==========================================
export const getAllPatients = async (req, res) => {
    try {
        const patients = await User.find({
            role: "patient",
        }).select("-password");

        if (patients.length === 0) {
            return res.status(404).json({
                success: false,
                message: "No patients found.",
            });
        }

        return res.status(200).json({
            success: true,
            count: patients.length,
            patients,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

// ==========================================
// UPDATE DOCTOR
// ==========================================
export const updateDoctor = async (req, res) => {
    try {
        const { id } = req.params;

        const doctor = await User.findOneAndUpdate(
            {
                _id: id,
                role: "doctor",
            },
            req.body,
            {
                new: true,
                runValidators: true,
            }
        ).select("-password");

        if (!doctor) {
            return res.status(404).json({
                success: false,
                message: "Doctor not found.",
            });
        }

        return res.status(200).json({
            success: true,
            message: "Doctor updated successfully.",
            doctor,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

// ==========================================
// GET DOCTOR BY ID
// ==========================================
export const getDoctorById = async (req, res) => {
    try {
        const { id } = req.params;

        const doctor = await User.findOne({
            _id: id,
            role: "doctor",
        }).select("-password");

        if (!doctor) {
            return res.status(404).json({
                success: false,
                message: "Doctor not found.",
            });
        }

        return res.status(200).json({
            success: true,
            doctor,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

// ==========================================
// DELETE DOCTOR
// ==========================================
export const deleteDoctor = async (req, res) => {
    try {
        const { id } = req.params;

        const doctor = await User.findOneAndDelete({
            _id: id,
            role: "doctor",
        });

        if (!doctor) {
            return res.status(404).json({
                success: false,
                message: "Doctor not found.",
            });
        }

        return res.status(200).json({
            success: true,
            message: "Doctor deleted successfully.",
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

// ==========================================
// ADMIN DASHBOARD STATS
// ==========================================
export const getDashboardStats = async (req, res) => {
    try {
        const totalDoctors = await User.countDocuments({
            role: "doctor",
        });

        const totalPatients = await User.countDocuments({
            role: "patient",
        });

        const totalAppointments = await Appointment.countDocuments();

        const pendingAppointments = await Appointment.countDocuments({
            status: "Pending",
        });

        const confirmedAppointments = await Appointment.countDocuments({
            status: "Confirmed",
        });

        const completedAppointments = await Appointment.countDocuments({
            status: "Completed",
        });

        const cancelledAppointments = await Appointment.countDocuments({
            status: "Cancelled",
        });

        return res.status(200).json({
            success: true,
            stats: {
                totalDoctors,
                totalPatients,
                totalAppointments,
                pendingAppointments,
                confirmedAppointments,
                completedAppointments,
                cancelledAppointments,
            },
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

export const getAllAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.find()
      .populate("patient", "name email contactNumber")
      .populate(
        "doctor",
        "name email specialization contactNumber"
      )
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: appointments.length,
      appointments,
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getPendingAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.find({
      status: "Pending",
    })
      .populate("patient", "name email contactNumber")
      .populate(
        "doctor",
        "name email specialization contactNumber"
      )
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: appointments.length,
      appointments,
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const cancelAppointmentByAdmin = async (req, res) => {
  try {
    const { id } = req.params;

    const appointment = await Appointment.findByIdAndUpdate(
      id,
      {
        status: "Cancelled",
      },
      {
        new: true,
        runValidators: true,
      }
    );

    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: "Appointment not found.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Appointment cancelled successfully.",
      appointment,
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};