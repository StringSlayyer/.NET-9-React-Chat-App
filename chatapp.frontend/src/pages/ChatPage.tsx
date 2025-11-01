import { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import ChatWindow from "../components/ChatWindow";
import { getConversations, type ConversationDTO } from "../api/conversationApi";
import { useAuth } from "../context/AuthContext";
import { getUser, type UserDTO } from "../api/userApi";
import EditProfileModal from "../components/EditProfileModal";

const ChatPage = () => {
  const { token, logout } = useAuth();
  const [conversations, setConversations] = useState<ConversationDTO[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedConversation, setSelectedConversation] =
    useState<ConversationDTO | null>(null);

  const [loggedUser, setLoggedUser] = useState<UserDTO | null>(null);
  const [showEditModal, setShowEditModal] = useState<boolean>(false);
  const handleEditProfile = () => setShowEditModal(true);

  useEffect(() => {
    const fetchUser = async () => {
      if (!token) return;
      try {
        const res = await getUser(token);
        console.log("Logged user object:", res);
        setLoggedUser(res);
      } catch (error) {
        console.error("Failed to fetch user id", error);
      }
    };
    fetchUser();
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

  const handleSelectedConversation = (conversation: ConversationDTO) => {
    setSelectedConversation(conversation);
    conversation.unreadMessagesCount = 0;
    setConversations((prev) =>
      prev.map((c) =>
        c.id === conversation.id ? { ...c, unreadMessagesCount: 0 } : c
      )
    );
  };

  const onLogout = () => {
    logout();
    window.location.reload();
  };
  return (
    <div className="h-full w-screen flex">
      <div className="w-1/4 bg-gray-800 text-white">
        {loading ? <p>Loading chats...</p> : null}
        <Sidebar
          conversations={conversations}
          setConversations={setConversations}
          loading={loading}
          token={token!}
          onSelectConversation={handleSelectedConversation}
          onAddConversation={addOrUpdateConversation}
          onEditProfile={handleEditProfile}
          loggedUser={loggedUser}
          onLogout={onLogout}
        />
      </div>
      <div className="flex-1 bg-gray-800">
        <ChatWindow
          conversation={selectedConversation}
          loggedUserId={loggedUser ? loggedUser.id : ""}
        />
      </div>
      {showEditModal && loggedUser && (
        <EditProfileModal
          user={loggedUser}
          token={token!}
          onClose={() => setShowEditModal(false)}
          onUpdated={(updated) => setLoggedUser(updated)}
        />
      )}
    </div>
  );
};

export default ChatPage;
