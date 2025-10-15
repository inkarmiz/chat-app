import React, { useEffect, useState } from "react";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import Auth from "./pages/auth";
import Chat from "./pages/chat";
import Profile from "./pages/profile";
import { useAppStore } from "@/store";
import { apiClient } from "@/lib/api-client";
import { GET_USER_INFO } from "@/utils/constants";

// If user is not logged in, redirect to /auth
const PrivateRoute = ({ children }) => {
  const { userInfo } = useAppStore();
  const isAuthenticated = !!userInfo;
  return isAuthenticated ? children : <Navigate to="/auth" />;
};

// If user is logged in, redirect to /chat
const AuthRoute = ({ children }) => {
  const { userInfo } = useAppStore();
  const isAuthenticated = !!userInfo;
  return isAuthenticated ? <Navigate to="/chat" /> : children;
};

const App = () => {
  // Gets the current user info and a function to update it from the global store.
  const { userInfo, setUserInfo } = useAppStore();

  // Local state to track if the app is still loading user data.
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getUserData = async () => {
      try {
        // Make a GET request to fetch user info
        const response = await apiClient.get(GET_USER_INFO, {
          withCredentials: true,
        });
        if (response.status === 200 && response.data.id) {
          // If successful, update the global store with the user info
          setUserInfo(response.data);
        } else {
          // If not successful, clear the user info in the global store
          setUserInfo(undefined);
        }
        console.log({ response });
      } catch {
        setUserInfo(undefined);
      } finally {
        // After the request completes (success or failure), set loading to false
        setLoading(false);
      }
    };
    // If userInfo is not already set, fetch the user data
    if (!userInfo) {
      getUserData();
    } else {
      setLoading(false);
    }
  }, [userInfo, setUserInfo]);

  if (loading) return <div>Loading...</div>;

  // /auth: Shows the Auth page if not logged in, otherwise redirects to /chat.
  // /chat and /profile: Protected routes; only accessible if logged in, otherwise redirect to /auth.
  // Any other path redirects to /auth.
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/auth"
          element={
            <AuthRoute>
              <Auth />
            </AuthRoute>
          }
        />
        <Route
          path="/chat"
          element={
            <PrivateRoute>
              <Chat />
            </PrivateRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <PrivateRoute>
              <Profile />
            </PrivateRoute>
          }
        />
        <Route path="*" element={<Navigate to="/auth" />} />
      </Routes>
    </BrowserRouter>
  );
};
export default App;
