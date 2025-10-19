import { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import ChatWindow from "../components/ChatWindow";
import { getConversations, type ConversationDTO } from "../api/conversationApi";
import { useAuth } from "../context/AuthContext";
import { getUserId } from "../api/authApi";

const ChatPage = () => {
  const { token } = useAuth();
  const [conversations, setConversations] = useState<ConversationDTO[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedConversation, setSelectedConversation] =
    useState<ConversationDTO | null>(null);

  const [loggedUserId, setLoggedUserId] = useState<string>("");
  useEffect(() => {
    const fetchUserId = async () => {
      if (!token) return;
      try {
        const res = await getUserId(token);
        console.log("Logged user ID:", res);
        setLoggedUserId(res.userId);
      } catch (error) {
        console.error("Failed to fetch user id", error);
      }
    };
    fetchUserId();
    const fetchConversations = async () => {
      try {
        if (!token) return;
        const res = await getConversations(token);
        console.log(res);
        setConversations(res);
      } catch (error) {
        console.error("Failed to fetch conversations", error);
      } finally {
        setLoading(false);
      }
    };
    fetchConversations();
  }, [token]);

  const addOrUpdateConversation = (conversation: ConversationDTO) => {
    setConversations((prev) => {
      const exists = prev.find((c) => c.id === conversation.id);
      if (exists) {
        const update = prev.map((c) =>
          c.id === conversation.id ? conversation : c
        );
        return [
          conversation,
          ...update.filter((c) => c.id !== conversation.id),
        ];
      } else {
        return [conversation, ...prev];
      }
    });
  };
  return (
    <div className="h-full w-screen flex">
      <div className="w-1/4 bg-gray-800 text-white py-1">
        {loading ? <p>Loading chats...</p> : null}
        <Sidebar
          conversations={conversations}
          loading={loading}
          token={token!}
          onSelectConversation={setSelectedConversation}
          onAddConversation={addOrUpdateConversation}
          loggedUserId={loggedUserId}
        />
      </div>
      <div className="flex-1 py-1 bg-gray-800">
        <ChatWindow
          conversation={selectedConversation}
          loggedUserId={loggedUserId}
        />
      </div>
    </div>
  );
};

export default ChatPage;
