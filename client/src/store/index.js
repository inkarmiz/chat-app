import { create } from 'zustand';
import { createAuthSlice } from './slices/auth-slice';
import { createChatSlice } from './slices/chat-slice';

// Combining all the slices to create the global store
export const useAppStore = create()((...a) => ({
    ...createAuthSlice(...a),
    ...createChatSlice(...a),
}));