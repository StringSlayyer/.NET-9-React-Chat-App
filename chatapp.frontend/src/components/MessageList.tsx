import type { Message } from "../api/messageApi";
import { useEffect, useRef } from "react";

const MessageList = ({
  messages,
  loading,
  loggedUserId,
}: {
  messages: Message[];
  loading: boolean;
  loggedUserId: string;
}) => {
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  if (loading) {
    return <div className="space-y-2">Loading messages...</div>;
  }

  return (
    <div className="h-full overflow-y-auto p-4">
      <div className="space-y-3">
        {messages.map((msg) => {
          const isMine = msg.senderId === loggedUserId;
          const time = new Date(msg.sentAt).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
            hour12: false,
          });

          return (
            <div
              key={msg.id}
              className={`p-2 rounded max-w-xs break-words ${
                isMine
                  ? "bg-blue-500 ml-auto text-white"
                  : "bg-gray-600 text-white"
              }`}
            >
              <p className="text-sm">{msg.content}</p>
              <div className="flex justify-end items-center gap-2 mt-1 text-xs opacity-80">
                <span>{time}</span>
                {isMine && <span>{msg.isRead ? "✅ Read" : "🕓 Sent"}</span>}
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef}></div>
      </div>
    </div>
  );
};

export default MessageList;
