// import { success } from "zod";
// import { User } from "../schemas/user.Schema.js";
// import bcrypt from 'bcrypt'

// const createUser = async(req,res)=>{
//     try {
//         ////Core fields required for EVERYONE
//         const {name, email , password, role, specialization, contactNumber, address } = req.body

//         if(!name || !email || !password || !contactNumber || !address){
//             return res.status(400).json({
//                 success:false,
//                 message:"Please Fill All Required Fileds"
//             })
//         }
//          //  Conditional Validation based on Role
//         if (role === "doctor" && !specialization) {
//             return res.status(400).json({
//                 success:false, 
//                 message:"Specialization is required for doctors." });
//         }

//         //  Check if user already exists
//         const existingUser = await User.findOne({email})
        
//         if(existingUser){
//             return res.status(400).json({
//                 success:false,
//                 message:"Email is Already Registered"
//             })
//         }

//         ////hash password////////
//         const hashedPassword = await bcrypt.hash(password, 10);

//         /////Save to Database

//         const newUser = await User.create({
//             name,
//             email,
//             password:hashedPassword,
//             role:role || "patient",
//             specialization:role === 'doctor' ? specialization:undefined,
//             contactNumber,
//             address
//         })

//         return res.status(201).json({
//             success:true,
//             message:"User Created Successfully",
//             user:{
//                 id:newUser._id,
//                 name:newUser.name,
//                 email:newUser.email,
//                 role:newUser.role
//             }
//         })

        
//     } catch (error) {
//         return res.status(500).json({
//             success:false,
//             message:"Internal Server Error",
//             error:error.message
//         })
//     }
// }

// export default createUser


// /////////get users////

// export const getAllUsers = async(req,res)=>{
//     try {
//         const users = await User.find().select('-password')

//         return res.status(200).json({
//             success:true,
//             count:users.length,users
//         })
        
//     } catch (error) {
//         return res.status(500).json({
//             message:"Internal Server Error",
//             success:false,
//             error:error.message
//         })
//     }
// }

// //////////delete user//

// export const deleteUser = async(req,res)=>{
//     try {

//         const{id}=req.params
//         const user = await User.findByIdAndDelete(id)

//         if(!user){
//             return res.status(444).json({
//                 message:'User Not Found',
//                 success:false
//             })
//         }

//         return res.status(200).json({
//             message:"Successfully Deleted",
//             success:true
//         })
//     } catch (error) {
//         return res.status(500).json({
//             success:false,
//             message:"Internal Server Error",
//             error:error.message
//         })
//     }
// }

// /////////update/////

// export const updateUser = async (req, res) => {
//     try {
//         const { id } = req.params;

//         // 1. Pass req.body (the new data) and { new: true } (returns the updated doc)
//         const updatedUser = await User.findByIdAndUpdate(id, req.body, 
//             { 
//                 // new: true,
//                 returnDocument: 'after',
//                 runValidators: true } 
//             // runValidators ensures it checks enum rules like roles
//         ).select("-password"); // Hide the password from the response

//         // 2. Handle the edge case where the user ID doesn't exist
//         if (!updatedUser) {
//             return res.status(404).json({
//                 success: false,
//                 message: "User not found."
//             });
//         }

//         return res.status(200).json({
//             success: true,
//             message: "User Updated Successfully",
//             user: updatedUser
//         });
        
//     } catch (error) {
//         return res.status(500).json({
//             success: false,
//             message: "Internal Server Error",
//             error: error.message
//         });
//     }
// };



// //////login////

// export const login = async(req,res)=>{
//     try {
//         const{email, password} = req.body

//         if(!email || !password){
//             return res.status(400).json({
//                 message:"Please Fill All Requirement",
//                 success:false
//             })
//         }

//         const Existemail = await User.findOne(email)

//         if(!Existemail){
//             return res.status(400).json({
//                 message:"Email Doesn't Exist",
//                 success:false
//             })
//         }

        

//         const data = await User.login()
//     } catch (error) {
//        return res.status(500).json({
//         message:"Internal Server Error",
//         success:false
//        }) 
//     }
// }
 