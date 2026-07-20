import { Appointment } from "../schemas/appointment.Schema.js";
import { User } from "../schemas/user.Schema.js";



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