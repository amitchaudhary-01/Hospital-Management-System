import { Appointment } from "../schemas/appointment.Schema.js";

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

export const updateAppointmentStatus = async (req, res) => {
    try {
        const { id } = req.params;
        let { status } = req.body;

        status = status.charAt(0).toUpperCase() + status.slice(1).toLowerCase();
        //////////for confirm and Confirm all work in both

        const appointment = await Appointment.findById(id);

        if (!appointment) {
            return res.status(404).json({
                success: false,
                message: "Appointment not found",
            });
        }

        appointment.status = status;
        await appointment.save();

        return res.status(200).json({
            success: true,
            message: "Status updated successfully",
            appointment,
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};


export const writePrescription = async (req, res) => {
    try {

        const { id } = req.params;
        const { medicines, notes } = req.body;

        const appointment = await Appointment.findById(id);

        if (!appointment) {
            return res.status(404).json({
                success: false,
                message: "Appointment not found"
            });
        }

        // Only assigned doctor can write prescription
        if (appointment.doctor.toString() !== req.user._id.toString()) {
            return res.status(403).json({
                success: false,
                message: "Unauthorized"
            });
        }

        appointment.prescription = {
            medicines,
            notes
        };

        await appointment.save();

        return res.status(200).json({
            success: true,
            message: "Prescription added successfully",
            appointment
        });

    } catch (error) {

        return res.status(500).json({
            success: false,
            message: error.message
        });

    }
};