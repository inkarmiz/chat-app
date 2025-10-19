import Message from "../models/MessagesModel.js";

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