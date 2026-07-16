import express from "express";
import {
    signup,
    login,
    logout,
    me
} from "../controllers/auth.controller.js";

import { isAuthenticated } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/signup", signup);

router.post("/login", login);

router.post("/logout", logout);

router.get("/me", isAuthenticated, me);

export default router;