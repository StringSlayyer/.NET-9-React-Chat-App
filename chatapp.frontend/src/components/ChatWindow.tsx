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

  /*useEffect(() => {
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

      conn?.on("ReceiveMessage", async (msg: Message) => {
        if (msg.conversationId === conversation?.id) {
          console.log("Received message:", msg);
          setMessages((prevMessages) => [...prevMessages, msg]);
          await conn.invoke("MarkMessageAsRead", conversation.id);
        }
      });

      conn?.on(
        "MessagesMarkedAsRead",
        (data: { conversationId: string; senderId: string }) => {
          console.log("Messages marked as read:", data);
          console.log("Logged userId:", loggedUserId);
          console.log("Reader userId:", data.senderId);

          if (data.conversationId === conversation?.id) {
            setMessages((prev) =>
              prev.map((msg) =>
                msg.senderId === loggedUserId ? msg : { ...msg, isRead: true }
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
      conn?.off("MessagesMarkedAsRead");
    };
  }, [conversation, token, loggedUserId]);*/

  useEffect(() => {
    console.log("Token in ChatWindow useEffect:", token);
    if (!token || !conversation) return;

    const setupConenction = async () => {
      const conn = getConnection();
      if (!conn || conn.state !== "Connected") {
        console.log("Starting SignalR connection in ChatWindow");
        await startConnection(token);
      }

      const activeConn = getConnection();

      await activeConn?.invoke("JoinConversation", conversation.id);
      await activeConn?.invoke("MarkMessageAsRead", conversation.id);
      console.log("Joined conversation and ran mark as read:", conversation.id);

      activeConn?.on("ReceiveMessage", async (msg: Message) => {
        if (msg.conversationId === conversation?.id) {
          console.log("Received message:", msg);
          setMessages((prevMessages) => [...prevMessages, msg]);

          const isConversationActive = document.visibilityState === "visible";
          if (isConversationActive) {
            await activeConn.invoke("MarkMessageAsRead", conversation.id);
          }
        }
      });

      activeConn?.on(
        "MessagesMarkedAsRead",
        (data: { conversationId: string; senderId: string }) => {
          console.log("Messages marked as read:", data);
          console.log("Logged userId:", loggedUserId);
          console.log("Reader userId:", data.senderId);

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
    setupConenction();
    return () => {
      const cleanupConn = getConnection();
      if (cleanupConn && conversation) {
        console.log("Leaving conversation:", conversation.id);
        cleanupConn.invoke("LeaveConversation", conversation.id);
        cleanupConn.off("ReceiveMessage");
        cleanupConn.off("MessagesMarkedAsRead");
      }
    };
  }, [conversation, token, loggedUserId]);

  const handleSendMessage = async (content: string) => {
    const conn = getConnection();
    console.log(conn);
    if (conn && conversation) {
      try {
        console.log("Odesílám zprávu přes SignalR:", content);
        console.log(conn);
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
