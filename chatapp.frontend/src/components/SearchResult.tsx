import UserAvatar from "./UserAvatar";
import { type ConversationDTO } from "../api/conversationApi";
import type { SearchDTO } from "../api/searchApi";

interface SearchResultProps {
  results: SearchDTO;
  loggedUserId: string | undefined;
  token: string;
  onSelectConversation: (conversation: ConversationDTO) => void;
  onSelectUser: (userId: string) => void;
}

const SearchResults = ({
  results,
  loggedUserId,
  token,
  onSelectConversation,
  onSelectUser,
}: SearchResultProps) => {
  const getConversationDisplay = (conversation: ConversationDTO) => {
    if (conversation.isGroup) {
      return {
        name: conversation.name || "Unnamed Group",
        avatarUrl: conversation.groupAvatarId || "",
      };
    }
    const other = conversation.participants.find((p) => p.id !== loggedUserId);
    return {
      name: other ? `${other.firstName} ${other.lastName}` : "Unknown User",
      avatarUrl: other?.id,
    };
  };

  return (
    <div>
      <h3 className="text-sm text-gray-400 mt-2 mb-1">Conversations</h3>
      {results.conversations.length > 0 ? (
        results.conversations.map((conv) => {
          const { name, avatarUrl } = getConversationDisplay(conv);
          return (
            <div
              key={conv.id}
              className="flex items-center gap-3 p-2 hover:bg-gray-800 rounded cursor-pointer"
              onClick={() => onSelectConversation(conv)}
            >
              <UserAvatar userId={avatarUrl} token={token} size={40} />
              <span className="text-gray-300 hover:text-white">{name}</span>
            </div>
          );
        })
      ) : (
        <p className="text-gray-600 text-sm">No matching conversations</p>
      )}

      <h3 className="text-sm text-gray-400 mt-4 mb-1">Users</h3>
      {results.users.length > 0 ? (
        results.users.map((user) => (
          <div
            key={user.id}
            className="flex items-center gap-3 p-2 hover:bg-gray-800 rounded cursor-pointer"
            onClick={() => onSelectUser(user.id)}
          >
            <UserAvatar userId={user.id} token={token} size={40} />
            <span className="text-gray-300 hover:text-white">
              {`${user.firstName} ${user.lastName}`}{" "}
              <span className="text-gray-500">(@{user.username})</span>
            </span>
          </div>
        ))
      ) : (
        <p className="text-gray-600 text-sm">No matching users</p>
      )}
    </div>
  );
};

export default SearchResults;
