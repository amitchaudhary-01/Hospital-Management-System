import mongoose from 'mongoose'

const userSchema = new mongoose.Schema({
    name:{
        required:true,
        type:String
    },
    email:{
        required:true,
        type:String
    },
    password:{
        required:true,
        type:String
    },
    role:{
        type:String,
        enum:['admin', 'doctor', 'patient'],
        default:'patient'
    },
    specialization:{
        type:String,
        enum:['Cardiologist', 
        'Dermatologist', 
        'Pediatrician', 
        'Neurologist', 
        'General Surgeon', 
        'Orthopedic Surgeon', 
        'OB/GYN',
        'Ophthalmology']
    },
    contactNumber:{
        type:String
    },
    address:{
        type:String
    },
},{
    timestamps:true
})

export const User = mongoose.model('User',userSchema)