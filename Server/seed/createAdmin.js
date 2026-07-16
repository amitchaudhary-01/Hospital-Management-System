import mongoose from "mongoose";
import dotenv from "dotenv";
import bcrypt from "bcrypt";
import { User } from "../schemas/user.Schema.js";
import connectDB from "../config/db.js";

dotenv.config();

const createAdmin = async () => {
    try {
        await connectDB();

        // Check if admin already exists
        const adminExists = await User.findOne({
            email: "amitchaudhary@gmail.com",
        });

        if (adminExists) {
            console.log("Admin already exists.");
            process.exit();
        }

        // Hash password
        const hashedPassword = await bcrypt.hash("amitchaudharyproject", 10);

        // Create admin
        await User.create({
            name: "Adminamit",
            email: "amitchaudhary@gmail.com",
            password: hashedPassword,
            role: "admin",
            contactNumber: "9821005569",
            address: "Nawalparasi",
        });

        console.log("Admin created successfully.");
        process.exit();

    } catch (error) {
        console.error(error);
        process.exit(1);
    }
};

createAdmin();