// A "slice" is a portion of the application's state and the logic to manage it. 
// An "auth slice" manages authentication-related state
export const createAuthSlice = (set) => ({
    userInfo: undefined,
    setUserInfo: (userInfo) => set({ userInfo }),
});