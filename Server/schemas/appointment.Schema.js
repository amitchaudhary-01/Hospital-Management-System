import mongoose, { mongo } from "mongoose";

const appointmentSchema = new mongoose.Schema({
    patient:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:true
    },
    doctor:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:true
    },
    date:{
        type:Date,
        required:true
    },
    timeSlot:{
        required:true,
        type:String
    },
    reason:{
        type:String
    },
    status: { 
    type: String, 
    enum: ['Pending', 'Confirmed', 'Completed', 'Cancelled'], 
    default: 'Pending' 
  },
  prescription: {
    medicines: [{ name: String, dosage: String, duration: String }],
    notes: String
  }
}, { timestamps: true });

export const Appointment = mongoose.model('Appointment',appointmentSchema)