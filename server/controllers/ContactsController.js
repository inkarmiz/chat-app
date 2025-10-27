import mongoose from "mongoose";
import User from "../models/UserModel.js";
import Message from "../models/MessagesModel.js"

/**
 * Search for users (excluding the requesting user) that match the provided search term.
 *
 * - Validates that `searchTerm` is provided in the request body.
 * - Escapes RegExp special characters in the search term and performs a
 *   case-insensitive search against `firstName`, `lastName`, and `email`.
 * - Excludes the requester from results.
 *
 * @param {import('express').Request} request
 * @param {import('express').Response} response
 * @param {import('express').NextFunction} next
 * @returns {Promise<import('express').Response>}
 */
export const searchContacts = async (request, response, next) => {
    try {
        const { searchTerm } = request.body;
        if (searchTerm === undefined || searchTerm === null) {
            return response.status(400).send("Search term is required.");
        }

        const sanitizedSearchTerm = searchTerm.replace(
            /[.*+?^${}()|[\]\\]/g,
            '\\$&'); // Escape special characters
        const regex = new RegExp(sanitizedSearchTerm, 'i'); // Case-insensitive search

        const contacts = await User.find({
            $and: [
                { _id: { $ne: request.userId } }, // Exclude the requesting user
                {
                    $or: [
                        { firstName: regex },
                        { lastName: regex },
                        { email: regex }
                    ]
                }
            ]
        });
        return response.status(200).json({ contacts });
    } catch (error) {
        console.log({ error });
        return response.status(500).send("Internal Server Error");
    }
};

/**
 * Retrieve contacts for the direct-messages list, ordered by most recent conversation.
 *
 * - Finds messages where the requester is either sender or recipient.
 * - Sorts messages by timestamp (newest first), groups by the other participant,
 *   and keeps the latest timestamp per contact.
 * - Performs a lookup to fetch contact user details and returns a list of
 *   contact metadata (email, names, image, color) along with `lastMessageTime`.
 *
 * @param {import('express').Request} request - expects `request.userId` (set by auth middleware)
 * @param {import('express').Response} response
 * @param {import('express').NextFunction} next
 * @returns {Promise<import('express').Response>}
 */
export const getContactsForDMList = async (request, response, next) => {
    try {
        let { userId } = request;
        userId = new mongoose.Types.ObjectId(userId);
        const contacts = await Message.aggregate([
            {
                $match: {
                    $or: [{ sender: userId }, { recipient: userId }]
                },
            },
            {
                $sort: { timestamp: -1 }
            },
            {
                $group: {
                    _id: {
                        $cond: {
                            if: { $eq: ["$sender", userId] },
                            then: "$recipient",
                            else: "$sender",
                        },
                    },
                    lastMessageTime: { $first: "$timestamp" }
                }
            },
            {
                $lookup: {
                    from: "users",
                    localField: "_id",
                    foreignField: "_id",
                    as: "contactInfo",
                }
            },
            {
                $unwind: "$contactInfo",
            },
            {
                $project: {
                    _id: 1,
                    lastMessageTime: 1,
                    email: "$contactInfo.email",
                    firstName: "$contactInfo.firstName",
                    lastName: "$contactInfo.lastName",
                    image: "$contactInfo.image",
                    color: "$contactInfo.color",
                },
            },
            {
                $sort: { lastMessageTime: -1 },
            },
        ]);

        return response.status(200).json({ contacts });
    } catch (error) {
        console.log({ error });
        return response.status(500).send("Internal Server Error");
    }
};

export const getAllContacts = async (request, response, next) => {
    try {
        const users = await User.find(
            { _id: { $ne: request.userId } },
            "firstName lastName _id"
        );
        const contacts = users.map((user) => ({
            label: user.firstName ? `${user.firstName} ${user.lastName}` : user.email,
            value: user._id
        }))
        return response.status(200).json({ contacts });
    } catch (error) {
        console.log({ error });
        return response.status(500).send("Internal Server Error");
    }
};