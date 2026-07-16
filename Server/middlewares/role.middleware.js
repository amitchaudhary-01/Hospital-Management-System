export const authorizeRoles = (...roles) => {
    return (req, res, next) => {

        // req.user is added by isAuthenticated middleware
        if (!req.user) {
            return res.status(401).json({
                success: false,
                message: "Please login first."
            });
        }

        // Check if user's role is allowed
        if (!roles.includes(req.user.role)) {
            return res.status(403).json({
                success: false,
                message: "Access Denied. You are not authorized."
            });
        }

        next();
    };
};