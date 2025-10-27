import Message from "../models/MessagesModel.js";
import { mkdirSync, renameSync } from 'fs';

export const getMessages = async (request, response, next) => {
    try {
        // IDs of the two users involved in the conversation
        const user1 = request.userId;
        const user2 = request.body.id;

        if (!user1 || !user2) {
            return response.status(400).send("Both user IDs are required.");
        }

        // Fetch messages between the two users
        const messages = await Message.find({
            $or: [
                { sender: user1, recipient: user2 },
                { sender: user2, recipient: user1 }
            ]
        }).sort({ timestamp: 1 }); // Sort messages by timestamp in ascending order
        return response.status(200).json({ messages });
    } catch (error) {
        console.log({ error });
        return response.status(500).send("Internal Server Error");
    }
};

/**
 * @method uploadFile
 * @description
 * Handles file uploads from authenticated users.
 * 
 * This method:
 * 1. Verifies that a file has been uploaded.
 * 2. Creates a new timestamped folder inside `uploads/files/`.
 * 3. Moves the uploaded file from Multer’s temporary directory to that folder,
 *    preserving the original file name.
 * 4. Returns the final file path in the response.
 * 
 * @param {Object} request - Express request object (contains `file` from Multer middleware).
 * @param {Object} response - Express response object for sending responses.
 * @param {Function} next - Express next middleware function (not used here, but included for convention).
 * 
 * @returns {Object} JSON response with the uploaded file’s path, or an error message.
 * 
 * @example
 * // Request:
 * // POST /upload/file
 * // FormData: { file: <selectedFile> }
 * 
 * // Response:
 * // { "filePath": "uploads/files/1730047600000/photo.jpg" }
 */
export const uploadFile = async (request, response, next) => {
    try {
        if (!request.file) {
            return response.send(400).send("File is required.");
        }
        const date = Date.now();
        let fileDir = `uploads/files/${date}`;
        let fileName = `${fileDir}/${request.file.originalname}`;

        // Creates the folder if it doesn’t already exist.
        // The { recursive: true } option ensures that all needed parent directories are created automatically.
        mkdirSync(fileDir, { recursive: true });

        // Moves (renames) the temporary file created by Multer to the final path
        renameSync(request.file.path, fileName);

        return response.status(200).json({ filePath: fileName });
    } catch (error) {
        console.log({ error });
        return response.status(500).send("Internal Server Error");
    }
};