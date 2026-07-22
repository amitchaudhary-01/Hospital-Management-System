import { Appointment } from "../schemas/appointment.Schema.js";

// export const getDoctorAppointments = async (req, res) => {
//     try {

//         const appointments = await Appointment.find({
//             doctor: req.user.id,
//         })
//             .populate("patient", "name email contactNumber address")
//             .sort({ date: 1 });

//         return res.status(200).json({
//             success: true,
//             appointments,
//         });

//     } catch (error) {

//         return res.status(500).json({
//             success: false,
//             message: error.message,
//         });

//     }
// };

// export const updateAppointmentStatus = async (req, res) => {
//     try {
//         const { id } = req.params;
//         let { status } = req.body;

//         status = status.charAt(0).toUpperCase() + status.slice(1).toLowerCase();
//         //////////for confirm and Confirm all work in both

//         const appointment = await Appointment.findById(id);

//         if (!appointment) {
//             return res.status(404).json({
//                 success: false,
//                 message: "Appointment not found",
//             });
//         }

//         appointment.status = status;
//         await appointment.save();

//         return res.status(200).json({
//             success: true,
//             message: "Status updated successfully",
//             appointment,
//         });

//     } catch (error) {
//         return res.status(500).json({
//             success: false,
//             message: error.message,
//         });
//     }
// };


// export const writePrescription = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const { medicines, notes } = req.body;

//     // 1. Validate payload
//     if (!medicines || !Array.isArray(medicines) || medicines.length === 0) {
//       return res.status(400).json({
//         success: false,
//         message: "At least one medicine is required.",
//       });
//     }

//     // 2. Fetch appointment
//     const appointment = await Appointment.findById(id);

//     if (!appointment) {
//       return res.status(404).json({
//         success: false,
//         message: "Appointment not found",
//       });
//     }

//     // 3. Authorization check (Defensive string conversion)
//     const doctorId = appointment.doctor?.toString();
//     const currentUserId = req.user?._id?.toString();

//     if (!doctorId || !currentUserId || doctorId !== currentUserId) {
//       return res.status(403).json({
//         success: false,
//         message: "Unauthorized: Only the assigned doctor can write a prescription.",
//       });
//     }

//     // 4. Update prescription & optionally update status
//     appointment.prescription = {
//       medicines,
//       notes: notes || "",
//     };

//     // Auto-complete appointment upon prescribing medicine
//     appointment.status = "Completed";

//     await appointment.save();

//     return res.status(200).json({
//       success: true,
//       message: "Prescription added successfully",
//       appointment,
//     });
//   } catch (error) {
//     return res.status(500).json({
//       success: false,
//       message: error.message || "Internal server error",
//     });
//   }
// };

export const getDoctorDashboard = async (req, res) => {
  try {
    const doctorId = req.user._id;

    // Start & end of today
    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);

    const endOfToday = new Date();
    endOfToday.setHours(23, 59, 59, 999);

    // 1. Fetch today's appointments assigned to this doctor
    const todayAppointments = await Appointment.find({
      doctor: doctorId,
      createdAt: { $gte: startOfToday, $lte: endOfToday },
    })
      .populate("patient", "name contactNumber gender email")
      .sort({ createdAt: -1 });

    // 2. Calculate summary stats
    const todayCount = todayAppointments.length;
    const pendingCount = await Appointment.countDocuments({
      doctor: doctorId,
      status: "Pending",
    });
    const completedCount = await Appointment.countDocuments({
      doctor: doctorId,
      status: "Completed",
    });

    // 3. Return response
    return res.status(200).json({
      success: true,
      doctorName: req.user.name,
      stats: {
        todayCount,
        pendingCount,
        completedCount,
      },
      todayAppointments,
    });
  } catch (error) {
    console.error("Error fetching doctor dashboard:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to load dashboard data",
    });
  }
};

