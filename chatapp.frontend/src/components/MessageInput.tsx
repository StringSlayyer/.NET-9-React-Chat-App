import { useState } from "react";

interface MessageInputProps {
  onSend: (message: string) => void;
}

const MessageInput = ({ onSend }: MessageInputProps) => {
  const [message, setMessage] = useState("");

  const handleSend = () => {
    if (!message.trim()) return;
    console.log("Odesílám zprávu:", message);
    onSend(message);
    setMessage("");
  };

  return (
    <div className="flex space-x-2">
      <input
        type="text"
        className="flex-1 p-2 rounded text-gray-200 bg-gray-700"
        placeholder="Type a message..."
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && handleSend()}
      />
      <button
        onClick={handleSend}
        className="bg-blue-500 px-4 py-2 rounded text-white hover:bg-blue-600"
      >
        Odeslat
      </button>
    </div>
  );
};

export default MessageInput;
