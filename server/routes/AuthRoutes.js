import { Router } from "express";
import { signup, login, getUserInfo } from "../controllers/AuthController.js";
import { verifyToken } from "../middlewares/AuthMiddleware.js";

// Setting up the router
const authRoutes = Router();

// Defining routes
authRoutes.post("/signup", signup);
authRoutes.post("/login", login);
authRoutes.get("/user-info", verifyToken, getUserInfo);

export default authRoutes;