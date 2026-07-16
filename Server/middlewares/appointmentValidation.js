import { z } from "zod";

const appointmentSchema = z.object({
  patient: z.string().min(1, "Patient is required"),
  doctor: z.string().min(1, "Doctor is required"),
  date: z.string().min(1, "Date is required"),
  timeSlot: z.string().min(1, "Time slot is required"),
  reason: z.string().optional(),
  status: z
    .enum(["Pending", "Confirmed", "Completed", "Cancelled"])
    .optional(),
  prescription: z
    .object({
      medicines: z
        .array(
          z.object({
            name: z.string(),
            dosage: z.string(),
            duration: z.string(),
          })
        )
        .optional(),
      notes: z.string().optional(),
    })
    .optional(),
});

export default appointmentSchema

// Arrow function middleware
export const validateAppointment = (req, res, next) => {
  const result = appointmentSchema.safeParse(req.body);

  if (!result.success) {
    return res.status(400).json({
      success: false,
      errors: result.error.issues,
    });
  }

  next();
};