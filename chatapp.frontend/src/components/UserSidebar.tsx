import React, { useEffect } from "react";
import type { ConversationDTO, Participant } from "../api/conversationApi";
import UserAvatar from "./UserAvatar";
import type { Message } from "../api/messageApi";

interface UserSidebarProps {
  conversation: ConversationDTO;
  loggedUserId: string;
  messages: Message[];
  token?: string;
}

const UserSidebar = ({
  conversation,
  messages,
  loggedUserId,
  token,
}: UserSidebarProps) => {
  const [lastSeen, setLastSeen] = React.useState<string>("");
  // Find the "other" participant
  const otherUser: Participant | undefined = conversation.participants.find(
    (u) => u.id !== loggedUserId
  );

  useEffect(() => {
    getLastSeen();
  }, [messages, otherUser]);

  const getLastSeen = () => {
    const formatDate = (input: string | Date) => {
      const date = typeof input === "string" ? new Date(input) : input;
      const now = new Date();
      const diffSec = Math.floor((now.getTime() - date.getTime()) / 1000);

      if (diffSec < 10) return "just now";
      if (diffSec < 60) return `${diffSec} seconds ago`;

      const diffMin = Math.floor(diffSec / 60);
      if (diffMin < 60) return `${diffMin} minutes ago`;

      const diffHour = Math.floor(diffMin / 60);
      if (diffHour < 24) return `${diffHour} hours ago`;

      return new Intl.DateTimeFormat(undefined, {
        month: "short",
        day: "numeric",
        year: "numeric",
        hour: "numeric",
        minute: "2-digit",
      }).format(date);
    };
    if (
      conversation.lastMessage &&
      conversation.lastMessage.senderId !== otherUser?.id
    ) {
      if (conversation.lastMessage.isRead) {
        setLastSeen(formatDate(conversation.lastMessage.sentAt));
        return;
      }
    }

    let lastSeen = "";
    messages.forEach((msg) => {
      if (!msg.isRead) return;
      // prefer the other user's read message if available
      if (msg.senderId === otherUser?.id) {
        lastSeen = formatDate(msg.sentAt);
        return;
      }
      // otherwise take the most recent read message encountered
      if (!lastSeen) {
        lastSeen = formatDate(msg.sentAt);
      }
    });
    setLastSeen(lastSeen);
  };

  return (
    <div className="w-72 bg-gray-950 text-gray-200 border-l border-gray-800 flex flex-col p-4">
      <h2 className="text-lg font-semibold mb-4 border-b border-gray-800 pb-2">
        Chat Info
      </h2>

      {otherUser ? (
        <div className="flex flex-col items-center text-center mt-2">
          <UserAvatar userId={otherUser.id} token={token} size={80} />

          <h3 className="text-xl font-medium mt-3">
            {otherUser.firstName} {otherUser.lastName}
          </h3>

          <div className="mt-4 space-y-1 text-sm text-gray-400">
            <p>
              <span className="text-gray-500">Last seen:</span> {lastSeen}
            </p>
          </div>
        </div>
      ) : (
        <div className="text-gray-400 text-center mt-10">
          No user information available
        </div>
      )}
    </div>
  );
};

export default UserSidebar;
