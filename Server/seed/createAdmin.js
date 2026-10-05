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
            email: process.env.ADMIN_EMAIL,
        });

        if (adminExists) {
            console.log("Admin already exists.");
            process.exit();
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(process.env.ADMIN_PASSWORD, 10);

        // Create admin
        await User.create({
            name: "Adminamit",
            email: process.env.ADMIN_EMAIL,
            password: hashedPassword,
            role: "admin",
            contactNumber: process.env.ADMIN_NUMBER,
            address: process.env.ADMIN_ADDRESS,
        });

        console.log("Admin created successfully.");
        process.exit();

    } catch (error) {
        console.error(error);
        process.exit(1);
    }
};

createAdmin();