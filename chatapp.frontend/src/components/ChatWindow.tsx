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
    console.log("Token in ChatWindow useEffect:", token);
    if (!token) return;

    const init = async () => {
      console.log("Starting SignalR connection in ChatWindow");
      const conn = await startConnection(token);
      console.log("SignalR connection started in ChatWindow:", conn);

      if (conversation) {
        await conn.invoke("JoinConversation", conversation.id);

        await conn.invoke("MarkMessageAsRead", conversation.id);
        console.log(
          "Joined conversation and ran mark as read:",
          conversation.id
        );
      }

      conn?.on("ReceiveMessage", (msg: Message) => {
        if (msg.conversationId === conversation?.id) {
          setMessages((prevMessages) => [...prevMessages, msg]);
        }
      });

      conn?.on(
        "MessagesMarkedAsRead",
        (data: { conversationId: string; readerId: string }) => {
          if (data.conversationId === conversation?.id) {
            setMessages((prev) =>
              prev.map((msg) =>
                msg.senderId === loggedUserId ? { ...msg, isRead: true } : msg
              )
            );
          }
        }
      );
    };
    init();

    return () => {
      const conn = getConnection();
      if (conn && conversation) {
        conn.invoke("LeaveConversation", conversation.id);
      }
      conn?.off("ReceiveMessage");
    };
  }, [conversation, token, loggedUserId]);

  const handleSendMessage = async (content: string) => {
    const conn = getConnection();
    console.log(conn);
    if (conn && conversation) {
      try {
        console.log("Odesílám zprávu přes SignalR:", content);
        await conn.invoke("SendMessage", conversation.id, content);
      } catch (error) {
        console.error("Failed to send message", error);
      }
    }
  };

  if (!conversation) {
    return (
      <div className="h-screen flex items-center justify-center">
        Vyber konverzaci
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      <div className="flex-1 min-h-0">
        <MessageList
          messages={messages}
          loading={loading}
          loggedUserId={loggedUserId}
        />
      </div>
      <div className=" p-4  border-t border-gray-700">
        <MessageInput onSend={handleSendMessage} />
      </div>
    </div>
  );
};

export default ChatWindow;
