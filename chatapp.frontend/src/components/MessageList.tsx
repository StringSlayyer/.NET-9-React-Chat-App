import type { Message } from "../api/messageApi";

const MessageList = ({
  messages,
  loading,
}: {
  messages: Message[];
  loading: boolean;
}) => {
  if (loading) {
    return <div>Loading messages...</div>;
  }

  return (
    <div className="space-y-2">
      {messages.map((msg) => (
        <div
          key={msg.uid}
          className={`p-2 rounded max-w-xs ${
            msg.senderId === "Já" ? "bg-blue-500 ml-auto" : "bg-gray-600"
          }`}
        >
          <p className="text-sm">{msg.content}</p>
        </div>
      ))}
    </div>
  );
};

export default MessageList;
