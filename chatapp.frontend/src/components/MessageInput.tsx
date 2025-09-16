import { useState } from "react";

const MessageInput = () => {
  const [message, setMessage] = useState("");

  const handleSend = () => {
    if (!message.trim()) return;
    console.log("Odesílám zprávu:", message);
    setMessage("");
  };

  return (
    <div className="flex space-x-2">
      <input
        type="text"
        className="flex-1 p-2 rounded bg-gray-700 text-white"
        placeholder="Napiš zprávu..."
        value={message}
        onChange={(e) => setMessage(e.target.value)}
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
