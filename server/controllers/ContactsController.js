import User from "../models/UserModel.js";

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