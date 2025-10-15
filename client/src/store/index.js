import { create } from 'zustand';
import { createAuthSlice } from './slices/auth-slice';

// Combining all the slices to create the global store
export const useAppStore = create()((...a) => ({
    ...createAuthSlice(...a),
}));