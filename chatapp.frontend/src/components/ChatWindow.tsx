import MessageList from "./MessageList";
import MessageInput from "./MessageInput";
import { useEffect, useState } from "react";
import { getMessagesPaged, type Message } from "../api/messageApi";
import { useAuth } from "../context/AuthContext";
import type { ConversationDTO } from "../api/conversationApi";
import { startConnection, getConnection } from "../api/signalService";

interface ChatWindowProps {
  conversation?: ConversationDTO | null;
  loggedUserId: string;
}
const ChatWindow = ({ conversation, loggedUserId }: ChatWindowProps) => {
  const { token } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchMessage = async (conversationId: string) => {
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
        console.log(res);
        setMessages(res);
      } catch (error) {
        console.error("Failed to fetch messages", error);
      } finally {
        setLoading(false);
      }
    };

    if (conversation) fetchMessage(conversation.id);
  }, [conversation, token]);

  useEffect(() => {
    if (!token) return;

    const init = async () => {
      const conn = await startConnection(token);

      conn?.on("ReceiveMessage", (msg: Message) => {
        if (msg.conversationId === conversation?.id) {
          setMessages((prevMessages) => [...prevMessages, msg]);
        }
      });
    };
    init();

    return () => {
      const conn = getConnection();
      conn?.off("ReceiveMessage");
    };
  }, [conversation?.id, token]);

  const handleSendMessage = async (content: string) => {
    const conn = getConnection();
    console.log(conn);
    if (conn && conversation) {
      try {
        console.log("Odesílám zprávu přes SignalR:", content);
        await conn.invoke("SendMessage", {
          conversationId: conversation.id,
          content,
        });
      } catch (error) {
        console.error("Failed to send message", error);
      }
    }
  };

  if (!conversation) {
    return (
      <div className="h-full flex items-center justify-center">
        Vyber konverzaci
      </div>
    );
  }

  return (
    <div className="min-h-[90vh] w-full flex flex-col justify-around">
      <div className="flex-1 h-4/6 overflow-y-auto p-4">
        <MessageList
          messages={messages}
          loading={loading}
          loggedUserId={loggedUserId}
        />
      </div>
      <div className=" p-4 h-2/6 border-t border-gray-700">
        <MessageInput onSend={handleSendMessage} />
      </div>
    </div>
  );
};

export default ChatWindow;
