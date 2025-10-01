import { type ConversationDTO } from "../api/conversationApi";
const Sidebar = ({
  conversations,
  loading,
  loggedUserId,
  onSelectConversation,
}: {
  conversations: ConversationDTO[];
  loading: boolean;
  loggedUserId: string;
  onSelectConversation: (conversation: ConversationDTO) => void;
}) => {
  const getConversationName = (conversation: ConversationDTO) => {
    if (conversation.isGroup) {
      return conversation.name || "Unnamed Group";
    }
    console.log("Participants:", conversation.participants);
    console.log("Logged User ID:", loggedUserId);
    const otherParticipant = conversation.participants.find(
      (p) => p.id !== loggedUserId
    );
    console.log("Other Participant:", otherParticipant);
    return otherParticipant
      ? `${otherParticipant.firstName} ${otherParticipant.lastName}`
      : "Unknown User";
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
        conversations.map((conversation) => (
          <div
            key={conversation.id}
            className="p-2 hover:bg-gray-700 rounded cursor-pointer"
            onClick={() => onSelectConversation(conversation)}
          >
            <span className="text-gray-400 hover:text-white">
              {getConversationName(conversation)}
            </span>
          </div>
        ))
      )}
    </div>
  );
};

export default Sidebar;
