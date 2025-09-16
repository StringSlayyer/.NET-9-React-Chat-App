import Sidebar from "../components/Sidebar";
import ChatWindow from "../components/ChatWindow";

const ChatPage = () => {
  return (
    <div className="h-full w-screen flex">
      <div className="w-1/4 bg-gray-800 text-white p-4">
        <Sidebar />
      </div>
      <div className="flex-1 bg-gray-800">
        <ChatWindow />
      </div>
    </div>
  );
};

export default ChatPage;
