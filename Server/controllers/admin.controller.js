import bcrypt from "bcrypt";
import { User } from "../schemas/user.Schema.js";
import { Appointment } from "../schemas/appointment.Schema.js";
import { success } from "zod";

export const createDoctor = async (req, res) => {
    try {

        const { name, email, password, specialization, contactNumber, address} = req.body;

        // Validation
        if ( !name || !email || !password || !specialization || !contactNumber || !address) {
            return res.status(400).json({
                success: false,
                message: "Please fill all required fields."
            });
        }

        // Check existing doctor
        const existingUser = await User.findOne({ email });

        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: "Email already exists."
            });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create doctor
        const doctor = await User.create({
            name,
            email,
            password: hashedPassword,
            role: "doctor", // Always doctor
            specialization,
            contactNumber,
            address
        });

        return res.status(201).json({
            success: true,
            message: "Doctor created successfully.",
            doctor: {
                id: doctor._id,
                name: doctor.name,
                email: doctor.email,
                role: doctor.role,
                specialization: doctor.specialization
            }
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// export const createDoctor = async (req, res) => {
//     return res.status(200).json({
//         message:"Route Works"
//     })
// };

export const getAllDoctors = async (req, res) => {
    try {

        const doctors = await User.find({ role: "doctor" })
            .select("-password");

        return res.status(200).json({
            success: true,
            count: doctors.length,
            doctors
        });

    } catch (error) {

        return res.status(500).json({
            success: false,
            message: error.message
        });

    }
};

export const getAllPatients = async (req, res) => {
    try {
        
        const patient = await User.findOne({role:"patient"},select('-password'))

        if(!patient){
            return res.status(404).json({
                success:false,
                message:"Patient Not Found"
            })
        }
        return res.status(200).json({
            success:true,
            message : patient.length, patients
        })
    } catch (error) {
        return res.status(500).json({
            success:false,
            message:"Internal Server Error"
        })
    }
};

export const updateDoctor = async (req, res) => {
    try {
        const {id} = req.params

        const newdoctor = await User.findByIdAndUpdate(
            {
            id:_id, 
            role:"doctor"}, 
            req.body ,
            { new : true,
            runValidators:true},select("-password"))

            if(!newdoctor){
                return res.status(404).json({
                    success:false,
                    message:"Doctor Not Found"
                })
            }

            return res.status(200).json({
                success:true,
                message:"Doctor Updated Successfully"
            })
    } catch (error) {
        return res.status(500).json({
            success:false,
            message:"Internal Server Error"
        })
        
    }
};

export const getDoctorById = async (req, res) => {
    try {

        const { id } = req.params;

        const doctor = await User.findOne({
            _id: id,
            role: "doctor"
        }).select("-password");

        if (!doctor) {
            return res.status(404).json({
                success: false,
                message: "Doctor not found."
            });
        }

        return res.status(200).json({
            success: true,
            doctor
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};


export const deleteDoctor = async (req, res) => {
    try {
        
        const { id } = req.params

        const doctor = await User.findByIdAndDelete({_id: id , role:"doctor"})

        if(!doctor){
            return res.status(404).json({
                success:false,
                message: "Doctor Not Found"
            })
        }

        return res.status(200).json({
            success:true,
            message:"Doctor Deleted Successfully"
        })
    } catch (error) {
        return res.status(500).json({
            success:false,
            message:"Internal Server Error"
        })
        
    }
};



export const adminDashboard = async (req, res) => {
    try {

        const totalDoctors = await User.countDocuments({
            role: "doctor"
        });

        const totalPatients = await User.countDocuments({
            role: "patient"
        });

        const totalAppointments = await Appointment.countDocuments();

        const pendingAppointments = await Appointment.countDocuments({
            status: "pending"
        });

        const completedAppointments = await Appointment.countDocuments({
            status: "completed"
        });

        const cancelledAppointments = await Appointment.countDocuments({
            status: "cancelled"
        });

        return res.status(200).json({
            success: true,
            stats: {
                totalDoctors,
                totalPatients,
                totalAppointments,
                pendingAppointments,
                completedAppointments,
                cancelledAppointments
            }
        });

    } catch (error) {

        return res.status(500).json({
            success: false,
            message: error.message
        });

    }
};


export const getDashboardStats = async (req, res) => {
    try {

        const totalDoctors = await User.countDocuments({ role: "doctor" });

        const totalPatients = await User.countDocuments({ role: "patient" });

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

        res.status(200).json({
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

        res.status(500).json({
            success: false,
            message: error.message,
        });

    }
};