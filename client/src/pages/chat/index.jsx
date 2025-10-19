import { useAppStore } from "@/store";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import ContactsContainer from "./components/contacts-container";
import EmptyChatContainer from "./components/empty-chat-container";
import ChatContainer from "./components/chat-container";

// If profile is not setup, redirect to /profile, else show chat
const Chat = () => {
  // Get userInfo from the global store
  const { userInfo, selectedChatType } = useAppStore();
  // Use navigate function from react-router-dom for redirection
  const navigate = useNavigate();
  // On component mount or when userInfo changes, check if profile is set up
  useEffect(() => {
    if (!userInfo.profileSetup) {
      toast("Please complete your profile first.");
      navigate("/profile");
    }
  }, [userInfo, navigate]);
  return (
    <div className="flex h-[100vh] text-white overflow-hidden">
      <ContactsContainer />
      {selectedChatType === undefined ? (
        <EmptyChatContainer />
      ) : (
        <ChatContainer />
      )}
    </div>
  );
};
export default Chat;
