export const createChatSlice = (set, get) => ({
    selectedChatType: undefined,
    selectedChatData: undefined,
    selectedChatMessages: [],
    setSelectedChatType: (selectedChatType) => set({ selectedChatType }),
    setSelectedChatData: (selectedChatData) => set({ selectedChatData }),
    setSelectedChatMessages: (selectedChatMessages) => set({ selectedChatMessages }),
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
    }
});