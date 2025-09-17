import type { Message } from "../api/messageApi";

const MessageList = ({
  messages,
  loading,
  loggedUserId,
}: {
  messages: Message[];
  loading: boolean;
  loggedUserId: string;
}) => {
  if (loading) {
    return <div>Loading messages...</div>;
  }

  return (
    <div className="space-y-2">
      {messages.map((msg) => (
        <div
          key={msg.id}
          className={`p-2 rounded max-w-xs ${
            msg.senderId == loggedUserId
              ? "bg-blue-500 mr-auto ml-auto"
              : "bg-gray-600"
          }`}
        >
          <p className="text-sm">{msg.content}</p>
        </div>
      ))}
    </div>
  );
};

export default MessageList;
