import { Router } from "express";
import { verifyToken } from "../middlewares/AuthMiddleware.js";
import { getMessages, uploadFile } from "../controllers/MessagesController.js";
import multer from "multer";

const messagesRoutes = Router();
// Configures Multer (a middleware for handling file uploads)
const upload = multer({ dest: "uploads/files" });
// Get chat messages, but only for authenticated users.
messagesRoutes.post("/get-messages", verifyToken, getMessages);
// To upload a file (e.g., image, document) to the server, but only if the user is authenticated
messagesRoutes.post("/upload/file", verifyToken, upload.single("file"), uploadFile)

export default messagesRoutes;
