export const createChatSlice = (set, get) => ({
    selectedChatType: undefined,
    selectedChatData: undefined,
    selectedChatMessages: [],
    directMessagesContacts: [],
    isUploading: false,
    isDownloading: false,
    fileUploadProgress: 0,
    fileDownloadProgress: 0,
    channels: [],
    setChannels: (channels) => set({ channels }),
    setIsUploading: (isUploading) => set({ isUploading }),
    setIsDownloading: (isDownloading) => set({ isDownloading }),
    setFileUploadProgress: (fileUploadProgress) => set({ fileUploadProgress }),
    setFileDownloadProgress: (fileDownloadProgress) => set({ fileDownloadProgress }),
    setSelectedChatType: (selectedChatType) => set({ selectedChatType }),
    setSelectedChatData: (selectedChatData) => set({ selectedChatData }),
    setSelectedChatMessages: (selectedChatMessages) => set({ selectedChatMessages }),
    setDirectMessagesContacts: (directMessagesContacts) => set({ directMessagesContacts }),
    addChannel: (channel) => {
        const channels = get().channels;
        set({ channels: [channel, ...channels] })
    },
    closeChat: () =>
        set({
            selectedChatType: undefined,
            selectedChatData: undefined,
            selectedChatMessages: [],
        }),
    addMessage: (message) => {
        const selectedChatMessages = get().selectedChatMessages;
        const selectedChatType = get().selectedChatType;
        set({
            selectedChatMessages: [
                ...selectedChatMessages, {
                    ...message,
                    recipient:
                        selectedChatType === "channel"
                            ? message.recipient // Keep full recipient data for channel chats
                            : message.recipient._id, // Store only ID for user chats
                    sender:
                        selectedChatType === "channel"
                            ? message.sender // Keep full recipient data for channel chats
                            : message.sender._id, // Store only ID for user chats
                }
            ],
        });
    },
    addChannelInChannelList: (message) => {
        // Retrieve all channels from state
        const channels = get().channels;
        // Get the channel by the sent message channeld
        const data = channels.find((channel) => channel._id === message.channelId);
        // Get position of that channel in the list
        const index = channels.findIndex((channel) => channel._id === message.channelId);
        // Remove and reinsert it at the top of the list
        if (index !== -1 && index !== undefined) {
            channels.splice(index, 1);
            channels.unshift(data);
        }
    },
    addContactsInDMContacts: (message) => {
        // Get the current user's ID from the stored user information
        const userId = get().userInfo.id;

        // Determine the ID of the "other" user in the conversation.
        // If the current user is the sender, use the recipient's ID.
        // Otherwise, use the sender's ID.
        const fromId =
            message.sender._id === userId
                ? message.recipient._id
                : message.sender._id;

        // Get the "other" user's full data object (name, avatar, etc.)
        // Same logic as above — if the current user sent the message,
        // the other participant is the recipient, otherwise it’s the sender.
        const fromData =
            message.sender._id === userId ? message.recipient : message.sender;

        // Retrieve the current list of DM contacts from state
        const dmContacts = get().directMessagesContacts;

        // Try to find an existing contact in the list that matches this user
        const data = dmContacts.find((contact) => contact._id === fromId);

        // Get the index (position) of that contact in the array, if it exists
        const index = dmContacts.findIndex((contact) => contact._id === fromId);

        // If the contact already exists in the list
        if (index !== -1 && index !== undefined) {
            // Remove the contact from its current position
            dmContacts.splice(index, 1);
            // Add the contact to the top of the list (most recent contact)
            dmContacts.unshift(data);
        } else {
            // If the contact does not exist, add it as a new entry at the top
            dmContacts.unshift(fromData);
        }

        // Update the application state with the modified DM contacts list
        set({ directMessagesContacts: dmContacts });
    },
});