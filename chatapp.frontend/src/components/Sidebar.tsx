import { useState } from "react";
import {
  getOrCreateConversation,
  type ConversationDTO,
} from "../api/conversationApi";
import UserAvatar from "./UserAvatar";
import { search, type SearchDTO } from "../api/searchApi";
import SearchBar from "./SearchBar";
import SearchResults from "./SearchResult";
const Sidebar = ({
  conversations,
  loading,
  loggedUserId,
  token,
  onSelectConversation,
  onAddConversation,
}: {
  conversations: ConversationDTO[];
  loading: boolean;
  loggedUserId: string;
  token: string;
  onSelectConversation: (conversation: ConversationDTO) => void;
  onAddConversation: (conversation: ConversationDTO) => void;
}) => {
  const [searchResults, setSearchResults] = useState<SearchDTO | null>(null);

  const handleSearch = async (query: string) => {
    if (query.length < 2) {
      setSearchResults(null);
      return;
    }

    try {
      const response = await search(query, token);
      console.log("Search results:", response);
      setSearchResults(response);
    } catch (error) {
      console.error("Error searching:", error);
    }
  };

  const handleSelectUser = async (userId: string) => {
    try {
      const conversation = await getOrCreateConversation(
        { user2: userId },
        token
      );

      onAddConversation(conversation);
      onSelectConversation(conversation);
      setSearchResults(null);
    } catch (error) {
      console.error("Error creating conversation:", error);
    }
  };

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
      <SearchBar onSearch={handleSearch} />
      {searchResults ? (
        <SearchResults
          results={searchResults}
          loggedUserId={loggedUserId}
          token={token}
          onSelectConversation={onSelectConversation}
          onSelectUser={handleSelectUser}
        />
      ) : (
        <>
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
                  <div className="flex items-center gap-2">
                    <UserAvatar userId={avatarUrl} token={token} size={40} />
                    <div>
                      <span className="text-gray-200 font-semibold block">
                        {name}
                      </span>
                      <span className="text-gray-400 text-sm truncate w-40 block">
                        {conversation.lastMessage?.content || "No messages yet"}
                      </span>
                    </div>
                  </div>
                  {conversation.lastMessage && (
                    <span className="text-gray-500 text-xs">
                      {new Date(
                        conversation.lastMessage.sentAt
                      ).toLocaleTimeString()}
                    </span>
                  )}
                </div>
              );
            })
          )}
        </>
      )}
    </div>
  );
};

export default Sidebar;
