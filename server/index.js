import express from "express";
import dotenv from "dotenv"
import cors from "cors"
import cookieParser from "cookie-parser"
import mongoose from "mongoose";
import authRoutes from "./routes/AuthRoutes.js";
import contactsRoutes from "./routes/ContactRoutes.js";
import setupSocket from "./socket.js";

// Load environment variables
dotenv.config();

// Initialize Express app
const app = express();

// Server configuration
const port = process.env.PORT || 3001;
const databaseURL = process.env.DATABASE_URL;

// CORS (Cross-Origin Resource Sharing) - HTTP-header based mechanism implemented by the browser 
// which allows a server or an API to indicate any origins (different in terms of protocol, hostname, or port) other than its origin
// from which the unknown origin gets permission to access and load resources. 
app.use(cors({
    origin: [process.env.ORIGIN],
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    credentials: true,
}));

// Serves files from a folder so they can be requested over HTTP
app.use("/uploads/profiles", express.static("uploads/profiles"));

// Parsing middleware
app.use(cookieParser());
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/contacts", contactsRoutes);

// Start the server
const server = app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
})

// Setup WebSocket
setupSocket(server);

// Connect to MongoDB
mongoose.connect(databaseURL).then(() => console.log("DB Connection Successful")).catch(err => console.log(err.message));