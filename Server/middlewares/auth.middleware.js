import jwt from "jsonwebtoken";
import { User } from "../schemas/user.Schema.js";

export const isAuthenticated = async (req, res, next) => {
  try {
    // 1. Extract token from Cookie or Bearer Header
    let token = req.cookies?.token;

    if (!token && req.headers.authorization?.startsWith("Bearer ")) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Authentication required. Please log in.",
      });
    }

    // 2. Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 3. Retrieve user (exclude password hash)
    const user = await User.findById(decoded.id).select("-password");

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User account no longer exists.",
      });
    }

    // 4. Attach user to request & proceed
    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Invalid or expired token.",
    });
  }
};