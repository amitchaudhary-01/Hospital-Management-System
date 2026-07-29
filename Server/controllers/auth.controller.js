import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { User } from '../schemas/user.Schema.js';

// Configuration for cross-origin cookies on HTTPS (Render)
const cookieOptions = {
    httpOnly: true,
    secure: true,      // Required for cross-site cookies over HTTPS on Render
    sameSite: "none",  // Required for cross-site requests (Frontend domain -> Backend domain)
    maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
};

// =============================
// Patient Signup
// =============================
export const signup = async (req, res) => {
    try {
        const {
            name,
            email,
            password,
            gender,
            age,
            BloodGroup,
            contactNumber,
            address
        } = req.body;

        // Validation
        if (!name || !email || !password || !age || !contactNumber || !address || !gender || !BloodGroup) {
            return res.status(400).json({
                success: false,
                message: "Please fill all required fields."
            });
        }

        // Check existing user
        const existingUser = await User.findOne({ email });

        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: "Email already exists."
            });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create patient
        const newUser = await User.create({
            name,
            email,
            password: hashedPassword,
            role: "patient",
            gender,
            age,
            BloodGroup,
            contactNumber,
            address
        });

        return res.status(201).json({
            success: true,
            message: "Patient registered successfully.",
            user: {
                id: newUser._id,
                name: newUser.name,
                email: newUser.email,
                role: newUser.role,
                gender: newUser.gender,
                age: newUser.age,
                BloodGroup: newUser.BloodGroup
            }
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// =============================
// Login
// =============================
export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "Email and password are required."
            });
        }

        // Find user
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(401).json({
                success: false,
                message: "User Doesn't Exist"
            });
        }

        // Compare password
        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(401).json({
                success: false,
                message: "Invalid email or password."
            });
        }

        // Generate JWT
        const token = jwt.sign(
            { id: user._id },
            process.env.JWT_SECRET,
            { expiresIn: "7d" }
        );

        // Store token in cookie with cross-origin options
        res.cookie("token", token, cookieOptions);

        return res.status(200).json({
            success: true,
            message: "Login successful.",
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// =============================
// Logout
// =============================
export const logout = async (req, res) => {
    // Clear cookie with matching sameSite & secure flags
    res.clearCookie("token", {
        httpOnly: true,
        secure: true,
        sameSite: "none"
    });

    return res.status(200).json({
        success: true,
        message: "Logout successful."
    });
};

// =============================
// Current User
// =============================
export const me = async (req, res) => {
    return res.status(200).json({
        success: true,
        user: req.user
    });
};