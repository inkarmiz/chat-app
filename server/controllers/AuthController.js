import { compare } from "bcrypt";
import User from "../models/UserModel.js";
import jwt from "jsonwebtoken"
import { renameSync, unlinkSync } from "fs"

// Token max age set to 3 days
const maxAge = 3 * 24 * 60 * 60 * 1000;

// Function to create JWT token
const createToken = (email, userId) => {
    return jwt.sign({ email, userId }, process.env.JWT_KEY, { expiresIn: maxAge })
};

// Signup controller
export const signup = async (request, response, next) => {
    try {
        const { email, password } = request.body;
        if (!email || !password) {
            return response.status(400).send("Email and Password are required.");
        }
        const user = await User.create({ email, password });
        response.cookie("jwt", createToken(email, user.id), {
            maxAge,
            secure: true,
            sameSite: "None",
        });
        return response.status(201).json({
            user: {
                id: user.id,
                email: user.email,
                profileSetup: user.profileSetup
            }
        });
    } catch (error) {
        console.log({ error });
        return response.status(500).send("Internal Server Error");
    }
};

// Login controller
export const login = async (request, response, next) => {
    try {
        const { email, password } = request.body;
        if (!email || !password) {
            return response.status(400).send("Email and Password are required.");
        }
        const user = await User.findOne({ email });
        if (!user) {
            return response.status(404).send("User with this email does not exist.");
        }
        // Compare the password with hashed password
        const auth = await compare(password, user.password);
        if (!auth) {
            return response.status(400).send("Incorrect Password.");
        }
        // Sets JWT token and sends it to the client, usually stored in a cookie or local storage
        response.cookie("jwt", createToken(email, user.id), {
            maxAge,
            secure: true,
            sameSite: "None",
        });
        return response.status(200).json({
            user: {
                id: user.id,
                email: user.email,
                profileSetup: user.profileSetup,
                firstName: user.firstName,
                lastName: user.lastName,
                image: user.image,
                color: user.color,
            }
        });
    } catch (error) {
        console.log({ error });
        return response.status(500).send("Internal Server Error");
    }
};

// User info retrieval controller
export const getUserInfo = async (request, response, next) => {
    try {
        const userData = await User.findById(request.userId);
        if (!userData) {
            return response.status(404).send("User with the given email is not found.");
        }

        return response.status(200).json({
            id: userData.id,
            email: userData.email,
            profileSetup: userData.profileSetup,
            firstName: userData.firstName,
            lastName: userData.lastName,
            image: userData.image,
            color: userData.color,
        });
    } catch (error) {
        console.log({ error });
        return response.status(500).send("Internal Server Error");
    }
};

// Update profile controller
export const updateProfile = async (request, response, next) => {
    try {
        const { userId } = request;
        const { firstName, lastName, color } = request.body;
        if (!firstName || !lastName || color === undefined) {
            return response.status(400).send("First name, last name and color are required.");
        }
        const userData = await User.findByIdAndUpdate(
            userId,
            {
                firstName,
                lastName,
                color,
                profileSetup: true
            },
            { new: true, runValidators: true }
        );

        return response.status(200).json({
            id: userData.id,
            email: userData.email,
            profileSetup: userData.profileSetup,
            firstName: userData.firstName,
            lastName: userData.lastName,
            image: userData.image,
            color: userData.color,
        });
    } catch (error) {
        console.log({ error });
        return response.status(500).send("Internal Server Error");
    }
};

// Add profile image controller
export const addProfileImage = async (request, response, next) => {
    try {
        if (!request.file) {
            return response.status(400).send("Profile image is required.");
        }
        const date = Date.now();
        let fileName = "uploads/profiles/" + date + request.file.originalname;
        renameSync(request.file.path, fileName);
        const updatedUser = await User.findByIdAndUpdate(
            request.userId,
            { image: fileName },
            { new: true, runValidators: true }
        );

        return response.status(200).json({
            image: updatedUser.image,
        });
    } catch (error) {
        console.log({ error });
        return response.status(500).send("Internal Server Error");
    }
};

// Remove profile image controller
export const removeProfileImage = async (request, response, next) => {
    try {
        const { userId } = request;
        const user = await User.findById(userId);
        if (!user) {
            return response.status(404).send("User not found.");
        }

        // If user has a profile image, delete the file from the directory
        if (user.image) {
            unlinkSync(user.image)
        }

        user.image = null;
        await user.save();

        return response.status(200).send("Profile image removed successfully.");
    } catch (error) {
        console.log({ error });
        return response.status(500).send("Internal Server Error");
    }
};

// Logout controller
export const logout = async (request, response, next) => {
    try {
        // Clear the JWT cookie
        response.cookie("jwt", "", { maxAge: 1, secure: true, sameSite: "None" });
        return response.status(200).send("Logged out successfully.");
    } catch (error) {
        console.log({ error });
        return response.status(500).send("Internal Server Error");
    }
};

