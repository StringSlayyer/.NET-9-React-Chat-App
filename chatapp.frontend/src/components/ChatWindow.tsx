import MessageList from "./MessageList";
import MessageInput from "./MessageInput";
import { useEffect, useState } from "react";
import { getMessagesPaged, Message } from "../api/messageApi";
import { useAuth } from "../context/AuthContext";

interface ChatWindowProps {
  conversationId: string;
}
const ChatWindow = ({ conversationId }: ChatWindowProps) => {
  const { token } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchMessage = async () => {
      if (!token) return;
      try {
        const res = await getMessagesPaged(
          {
            conversationId,
            pageNumber: 1,
            pageSize: 50,
          },
          token
        );
        setMessages(res);
      } catch (error) {
        console.error("Failed to fetch messages", error);
      } finally {
        setLoading(false);
      }
    };
    fetchMessage();
  }, [conversationId, token]);

  return (
    <div className="min-h-screen w-full flex flex-col">
      <div className="flex-1 overflow-y-auto p-4">
        <MessageList messages={messages} loading={loading} />
      </div>
      <div className="p-4 border-t border-gray-700">
        <MessageInput />
      </div>
    </div>
  );
};

export default ChatWindow;
