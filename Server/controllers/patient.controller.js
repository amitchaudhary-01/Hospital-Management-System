import { Appointment } from "../schemas/appointment.Schema.js";
import { User } from "../schemas/user.Schema.js";

export const getMyAppointments = async (req, res) => {
    try {

        const appointments = await Appointment.find({
            patient: req.user._id
        })
        .populate("doctor", "name email contactNumber address")
        .sort({ createdAt: -1 });

        return res.status(200).json({
            success: true,
            appointments
        });

    } catch (error) {

        return res.status(500).json({
            success: false,
            message: error.message
        });

    }
};

export const getAllDoctors = async (req, res) => {
  try {
    const doctors = await User.find(
      { role: "doctor" },
      "-password"
    );

    res.status(200).json({
      success: true,
      doctors,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};