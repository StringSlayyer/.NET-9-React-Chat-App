import { useState, useEffect } from "react";
import {
  getOrCreateConversation,
  type ConversationDTO,
} from "../api/conversationApi";
import UserAvatar from "./UserAvatar";
import { search, type SearchDTO } from "../api/searchApi";
import SearchBar from "./SearchBar";
import SearchResults from "./SearchResult";
import { getConnection, startConnection } from "../api/signalService";
import LoggedUser from "./LoggedUser";
import type { UserDTO } from "../api/userApi";

const Sidebar = ({
  conversations,
  setConversations,
  loading,
  loggedUser,
  token,
  onSelectConversation,
  onAddConversation,
  onEditProfile,
  onLogout,
}: {
  conversations: ConversationDTO[];
  setConversations: React.Dispatch<React.SetStateAction<ConversationDTO[]>>;
  loading: boolean;
  loggedUser: UserDTO | null;
  token: string;
  onSelectConversation: (conversation: ConversationDTO) => void;
  onAddConversation: (conversation: ConversationDTO) => void;
  onEditProfile: () => void;
  onLogout: () => void;
}) => {
  const [searchResults, setSearchResults] = useState<SearchDTO | null>(null);

  useEffect(() => {
    if (!token) return;

    const setupSignalR = async () => {
      let conn = getConnection();
      if (!conn || conn.state !== "Connected") {
        await startConnection(token);
        conn = getConnection();
      }
      console.log(conn);

      conn?.on(
        "ConversationUpdated",
        (updatedConversation: ConversationDTO) => {
          console.log("conversation updated received:", updatedConversation);

          setConversations((prev) => {
            const existing = prev.find((c) => c.id === updatedConversation.id);
            if (existing) {
              const updated = prev.map((c) =>
                c.id === updatedConversation.id ? updatedConversation : c
              );
              return [
                updatedConversation,
                ...updated.filter((c) => c.id !== updatedConversation.id),
              ];
            } else {
              return [updatedConversation, ...prev];
            }
          });
        }
      );
    };

    setupSignalR();

    return () => {
      const conn = getConnection();
      conn?.off("ConversationUpdated");
    };
  }, [token]);

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
    console.log("Logged User ID:", loggedUser?.id);
    const otherParticipant = conversation.participants.find(
      (p) => p.id !== loggedUser?.id
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
      <LoggedUser
        token={token}
        userDTO={loggedUser}
        onEditProfile={onEditProfile}
        onLogout={onLogout}
      />
      <SearchBar onSearch={handleSearch} />
      {searchResults ? (
        <SearchResults
          results={searchResults}
          loggedUserId={loggedUser?.id}
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
              console.log("Rendering conversation:", conversation);
              console.log("Current name and url" + name + ", " + avatarUrl);
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
                      <div className="flex">
                        <span className="text-gray-400 text-sm truncate w-40 block">
                          {conversation.lastMessage?.content ||
                            "No messages yet"}
                        </span>
                        {conversation.unreadMessagesCount > 0 && (
                          <span className="bg-blue-600 text-white text-xs rounded-full px-2 py-0.5">
                            {conversation.unreadMessagesCount}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
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
