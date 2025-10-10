import { type ConversationDTO } from "../api/conversationApi";
import UserAvatar from "./UserAvatar";
const Sidebar = ({
  conversations,
  loading,
  loggedUserId,
  token,
  onSelectConversation,
}: {
  conversations: ConversationDTO[];
  loading: boolean;
  loggedUserId: string;
  token: string;
  onSelectConversation: (conversation: ConversationDTO) => void;
}) => {
  const getConversationDisplay = (conversation: ConversationDTO) => {
    if (conversation.isGroup) {
      return {
        name: conversation.name || "Unnamed Group",
        avatarUrl: conversation.groupAvatarId || "",
      };
    }
    console.log("Participants:", conversation.participants);
    console.log("Logged User ID:", loggedUserId);
    const otherParticipant = conversation.participants.find(
      (p) => p.id !== loggedUserId
    );
    console.log("Other Participant:", otherParticipant);
    return {
      name: otherParticipant
        ? `${otherParticipant.firstName} ${otherParticipant.lastName}`
        : "Unknown User",
      avatarUrl: otherParticipant?.id,
    };
  };
  if (loading) {
    return <div>Loading conversations...</div>;
  }
  return (
    <div className="h-full p-4 overflow-y-auto bg-gray-950">
      <h2 className="text-lg font-bold mb-4">Chats</h2>
      {conversations.length === 0 ? (
        <p className="text-gray-400">No chats to display.</p>
      ) : (
        conversations.map((conversation) => {
          const { name, avatarUrl } = getConversationDisplay(conversation);
          return (
            <div
              key={conversation.id}
              className="p-2 hover:bg-gray-700 rounded cursor-pointer"
              onClick={() => onSelectConversation(conversation)}
            >
              <UserAvatar userId={avatarUrl} token={token} size={40} />
              <span className="text-gray-400 hover:text-white">{name}</span>
            </div>
          );
        })
      )}
    </div>
  );
};

export default Sidebar;
