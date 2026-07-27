import bcrypt from "bcrypt";
import { User } from "../schemas/user.Schema.js";
import { Appointment } from "../schemas/appointment.Schema.js";

// Helper utility for clean pagination metadata parsing
const getPaginationParams = (query) => {
    const page = Math.max(1, parseInt(query.page, 10) || 1);
    const limit = Math.max(1, parseInt(query.limit, 10) || 10);
    const skip = (page - 1) * limit;
    return { page, limit, skip };
};

// ==========================================
// CREATE DOCTOR
// ==========================================
export const createDoctor = async (req, res) => {
    try {
        const { name, email, password, specialization, contactNumber, address } = req.body;

        if (!name || !email || !password || !specialization || !contactNumber || !address) {
            return res.status(400).json({
                success: false,
                message: "Please fill all required fields.",
            });
        }

        const normalizedEmail = email.toLowerCase().trim();

        // Check existing email
        const existingUser = await User.findOne({ email: normalizedEmail });
        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: "Email already exists.",
            });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        const doctor = await User.create({
            name,
            email: normalizedEmail,
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
// GET ALL DOCTORS (Paginated)
// ==========================================
export const getAllDoctors = async (req, res) => {
    try {
        const { page, limit, skip } = getPaginationParams(req.query);

        const filter = { role: "doctor" };

        const [doctors, totalItems] = await Promise.all([
            User.find(filter)
                .select("-password")
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit)
                .lean(),
            User.countDocuments(filter),
        ]);

        const totalPages = Math.ceil(totalItems / limit) || 1;

        return res.status(200).json({
            success: true,
            doctors,
            pagination: {
                totalItems,
                totalPages,
                currentPage: page,
                limit,
                hasNextPage: page < totalPages,
                hasPrevPage: page > 1,
            },
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
// GET ALL PATIENTS (Paginated)
// ==========================================
export const getAllPatients = async (req, res) => {
    try {
        const { page, limit, skip } = getPaginationParams(req.query);

        const filter = { role: "patient" };

        const [patients, totalItems] = await Promise.all([
            User.find(filter)
                .select("-password")
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit)
                .lean(),
            User.countDocuments(filter),
        ]);

        const totalPages = Math.ceil(totalItems / limit) || 1;

        return res.status(200).json({
            success: true,
            patients,
            pagination: {
                totalItems,
                totalPages,
                currentPage: page,
                limit,
                hasNextPage: page < totalPages,
                hasPrevPage: page > 1,
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
// UPDATE DOCTOR
// ==========================================
export const updateDoctor = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, specialization, contactNumber, address, password } = req.body;

        const updateData = {};
        if (name) updateData.name = name;
        if (specialization) updateData.specialization = specialization;
        if (contactNumber) updateData.contactNumber = contactNumber;
        if (address) updateData.address = address;

        if (password) {
            updateData.password = await bcrypt.hash(password, 10);
        }

        const doctor = await User.findOneAndUpdate(
            { _id: id, role: "doctor" },
            { $set: updateData },
            { new: true, runValidators: true }
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

        const doctor = await User.findOne({ _id: id, role: "doctor" }).select("-password");

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

        const doctor = await User.findOneAndDelete({ _id: id, role: "doctor" });

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
        const [
            totalDoctors,
            totalPatients,
            totalAppointments,
            pendingAppointments,
            confirmedAppointments,
            completedAppointments,
            cancelledAppointments,
        ] = await Promise.all([
            User.countDocuments({ role: "doctor" }),
            User.countDocuments({ role: "patient" }),
            Appointment.countDocuments(),
            Appointment.countDocuments({ status: "Pending" }),
            Appointment.countDocuments({ status: "Confirmed" }),
            Appointment.countDocuments({ status: "Completed" }),
            Appointment.countDocuments({ status: "Cancelled" }),
        ]);

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

// ==========================================
// GET ALL APPOINTMENTS (Paginated)
// ==========================================
export const getAllAppointments = async (req, res) => {
    try {
        const { page, limit, skip } = getPaginationParams(req.query);

        const [appointments, totalItems] = await Promise.all([
            Appointment.find()
                .populate("patient", "name email contactNumber")
                .populate("doctor", "name email specialization contactNumber")
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit)
                .lean(),
            Appointment.countDocuments(),
        ]);

        const totalPages = Math.ceil(totalItems / limit) || 1;

        return res.status(200).json({
            success: true,
            appointments,
            pagination: {
                totalItems,
                totalPages,
                currentPage: page,
                limit,
                hasNextPage: page < totalPages,
                hasPrevPage: page > 1,
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
// GET PENDING APPOINTMENTS (Paginated)
// ==========================================
export const getPendingAppointments = async (req, res) => {
    try {
        const { page, limit, skip } = getPaginationParams(req.query);
        const filter = { status: "Pending" };

        const [appointments, totalItems] = await Promise.all([
            Appointment.find(filter)
                .populate("patient", "name email contactNumber")
                .populate("doctor", "name email specialization contactNumber")
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit)
                .lean(),
            Appointment.countDocuments(filter),
        ]);

        const totalPages = Math.ceil(totalItems / limit) || 1;

        return res.status(200).json({
            success: true,
            appointments,
            pagination: {
                totalItems,
                totalPages,
                currentPage: page,
                limit,
                hasNextPage: page < totalPages,
                hasPrevPage: page > 1,
            },
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
            { status: "Cancelled" },
            { new: true, runValidators: true }
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

// ==========================================
// UPDATE PATIENT BY ADMIN
// ==========================================
export const updatePatient = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, contactNumber, address, password } = req.body;

        const updateData = {};
        if (name) updateData.name = name;
        if (contactNumber) updateData.contactNumber = contactNumber;
        if (address) updateData.address = address;

        if (password) {
            updateData.password = await bcrypt.hash(password, 10);
        }

        const patient = await User.findOneAndUpdate(
            { _id: id, role: "patient" },
            { $set: updateData },
            { new: true, runValidators: true }
        ).select("-password");

        if (!patient) {
            return res.status(404).json({
                success: false,
                message: "Patient not found.",
            });
        }

        return res.status(200).json({
            success: true,
            message: "Patient updated successfully.",
            patient,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

// ==========================================
// DELETE PATIENT BY ADMIN
// ==========================================
export const deletePatient = async (req, res) => {
    try {
        const { id } = req.params;

        const patient = await User.findOneAndDelete({ _id: id, role: "patient" });

        if (!patient) {
            return res.status(404).json({
                success: false,
                message: "Patient not found.",
            });
        }

        return res.status(200).json({
            success: true,
            message: "Patient deleted successfully.",
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

// ==========================================
// UPDATE APPOINTMENT STATUS BY ADMIN
// ==========================================
export const updateAppointmentStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        const validStatuses = ["Pending", "Confirmed", "Completed", "Cancelled"];
        if (!status || !validStatuses.includes(status)) {
            return res.status(400).json({
                success: false,
                message: `Invalid status. Valid values are: ${validStatuses.join(", ")}`,
            });
        }

        const appointment = await Appointment.findByIdAndUpdate(
            id,
            { status },
            { new: true, runValidators: true }
        )
            .populate("patient", "name email contactNumber")
            .populate("doctor", "name email specialization contactNumber");

        if (!appointment) {
            return res.status(404).json({
                success: false,
                message: "Appointment not found.",
            });
        }

        return res.status(200).json({
            success: true,
            message: `Appointment status updated to ${status}.`,
            appointment,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

// ==========================================
// DELETE APPOINTMENT BY ADMIN
// ==========================================
export const deleteAppointment = async (req, res) => {
    try {
        const { id } = req.params;

        const appointment = await Appointment.findByIdAndDelete(id);

        if (!appointment) {
            return res.status(404).json({
                success: false,
                message: "Appointment not found.",
            });
        }

        return res.status(200).json({
            success: true,
            message: "Appointment deleted successfully.",
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};