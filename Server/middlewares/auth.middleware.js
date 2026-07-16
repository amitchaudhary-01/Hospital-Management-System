// import jwt from "jsonwebtoken";
// import { User } from "../schemas/user.Schema.js";

// export const isAuthenticated = async (req, res, next) => {
//   try {
//     // 1. Safe extraction in case req.cookies is undefined
//     const token = req.cookies?.token;

//     if (!token) {
//       return res.status(401).json({
//         success: false,
//         message: "Please login first.",
//       });
//     }

//     // 2. Verify the token
//     const decoded = jwt.verify(token, process.env.JWT_SECRET);

//     // 3. Handle the edge case where the user was deleted from the DB but has a valid token
//     const user = await User.findById(decoded.id);
//     if (!user) {
//       return res.status(401).json({
//         success: false,
//         message: "User no longer exists.",
//       });
//     }

//     req.user = user;
//     next();
//   } catch (error) {
//     return res.status(401).json({
//       success: false,
//       message: "Invalid or expired token.",
//     });
//   }
// };


import jwt from "jsonwebtoken";
import { User } from "../schemas/user.Schema.js"; // change if you renamed schemas to models

export const isAuthenticated = async (req, res, next) => {
    try {

        // Get token from cookie or Authorization header
        const token =
            req.cookies?.token ||
            req.headers.authorization?.split(" ")[1];

        // If token not found
        if (!token) {
            return res.status(401).json({
                success: false,
                message: "Please login first."
            });
        }

        // Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Find user
        const user = await User.findById(decoded.id).select("-password");

        if (!user) {
            return res.status(401).json({
                success: false,
                message: "User not found."
            });
        }

        // Attach user to request
        req.user = user;

        next();

    } catch (error) {
        return res.status(401).json({
            success: false,
            message: "Invalid or expired token."
        });
    }
};