import axios from "axios";

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
}

export interface GetConversationsDTO {
  conversations: ConversationDTO[];
}

export interface Participant {
  id: string;
  firstName: string;
  lastName: string;
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
