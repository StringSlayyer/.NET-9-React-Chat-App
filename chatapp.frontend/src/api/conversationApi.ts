import axios from "axios";
import type { Message } from "./messageApi";

export interface CreateConversationDTO {
  participantIds: string[];
  adminId: string;
  name?: string;
}

export interface ConversationDTO {
  id: string;
  name?: string;
  participants: Participant[];
  isGroup: boolean;
  groupAvatarId?: string;
  avatarId?: string;
  lastMessage?: Message;
  unreadMessagesCount: number;
}

export interface GetConversationsDTO {
  conversations: ConversationDTO[];
}

export interface Participant {
  id: string;
  firstName: string;
  lastName: string;
}

export interface GetOrCreateConversationDTO {
  user2: string;
}

const API_URL = "http://localhost:8080/api";

export const getConversations = async (token: string) => {
  const response = await axios.get(
    `${API_URL}/Conversation/getUserConversations`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return response.data as ConversationDTO[];
};

export const getOrCreateConversation = async (
  data: GetOrCreateConversationDTO,
  token: string
): Promise<ConversationDTO> => {
  const response = await axios.post(
    `${API_URL}/Conversation/getOrCreateConversation`,
    data,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return response.data as ConversationDTO;
};
