import mongoose from "mongoose";

const prescriptionSchema = new mongoose.Schema(
  {
    appointment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Appointment",
      required: [true, "Appointment reference is required"],
    },

    patient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    doctor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    diagnosis: {
      type: String,
      trim: true,
      default: "",
    },

    medicines: [
      {
        name: {
          type: String,
          required: [true, "Medicine name is required"],
          trim: true,
        },

        dosage: {
          type: String,
          required: [true, "Dosage is required"],
          trim: true,
        },

        frequency: {
          type: String,
          required: [true, "Frequency is required"],
          trim: true,
        },

        duration: {
          type: String,
          required: [true, "Duration is required"],
          trim: true,
        },

        instructions: {
          type: String,
          default: "",
          trim: true,
        },
      },
    ],

    advice: {
      type: String,
      default: "",
      trim: true,
    },

    followUpDate: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

export const Prescription = mongoose.model("Prescription",prescriptionSchema);