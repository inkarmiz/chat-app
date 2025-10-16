import { Router } from "express";
import { signup, login, getUserInfo, updateProfile, addProfileImage, removeProfileImage } from "../controllers/AuthController.js";
import { verifyToken } from "../middlewares/AuthMiddleware.js";
import multer from "multer";

// Setting up the router
const authRoutes = Router();
// Multer configuration for file uploads
const upload = multer({ dest: "uploads/profiles/" });

// Defining routes
authRoutes.post("/signup", signup);
authRoutes.post("/login", login);
authRoutes.get("/user-info", verifyToken, getUserInfo);
authRoutes.post("/update-profile", verifyToken, updateProfile);
authRoutes.post(
    "/add-profile-image",
    verifyToken,
    // single file upload with field name 'profile-image'
    upload.single("profile-image"),
    addProfileImage
);
authRoutes.delete("/remove-profile-image", verifyToken, removeProfileImage);

export default authRoutes;