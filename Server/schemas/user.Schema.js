import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    name: {
      required: true,
      type: String,
    },
    email: {
      required: true,
      type: String,
    },
    password: {
      required: true,
      type: String,
    },
    role: {
      type: String,
      enum: ['admin', 'doctor', 'patient'],
      default: 'patient',
    },
    specialization: {
      type: String,
      enum: [
        'Cardiologist',
        'Dermatologist',
        'Pediatrician',
        'Neurologist',
        'General Surgeon',
        'Orthopedic Surgeon',
        'OB/GYN',
        'Ophthalmology',
      ],
    },
    contactNumber: {
      type: String,
    },
    address: {
      type: String,
    },
    gender: {
      type: String,
      enum: ['Male', 'Female', 'Other'],
      default: 'N/A',
    },
    age: {
      type: Number,
      min: 0,
    },
    BloodGroup: {
        type: String
    }
  },
  
  {
    timestamps: true,
  }
);

export const User = mongoose.model('User', userSchema);


// import mongoose from 'mongoose';

// const userSchema = new mongoose.Schema(
//   {
//     name: {
//       required: true,
//       type: String,
//     },
//     email: {
//       required: true,
//       type: String,
//     },
//     password: {
//       required: true,
//       type: String,
//     },
//     role: {
//       type: String,
//       enum: ['admin', 'doctor', 'patient'],
//       default: 'patient',
//     },
//     image: {
//       type: String, // Stores the image URL or file path (e.g., from Cloudinary or local storage)
//       default: '',  // Optional: defaults to an empty string if not provided
//     },
//     specialization: {
//       type: String,
//       enum: [
//         'Cardiologist',
//         'Dermatologist',
//         'Pediatrician',
//         'Neurologist',
//         'General Surgeon',
//         'Orthopedic Surgeon',
//         'OB/GYN',
//         'Ophthalmology',
//       ],
//     },
//     contactNumber: {
//       type: String,
//     },
//     address: {
//       type: String,
//     },
//     gender: {
//       type: String,
//       enum: ['Male', 'Female', 'Other'],
//       default: 'N/A',
//     },
//     age: {
//       type: Number,
//       min: 0,
//     },
//     BloodGroup: {
//       type: String,
//     }
//   },
//   {
//     timestamps: true,
//   }
// );

// export const User = mongoose.model('User', userSchema);