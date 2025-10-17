import axios from "axios";
import type { UserDTO } from "./userApi";
import type { ConversationDTO } from "./conversationApi";

const API_URL = "http://localhost:8080/api/Search"; // Replace with your backend API URL

export interface SearchDTO {
  users: UserDTO[];
  conversations: ConversationDTO[];
}

export const search = async (
  query: string,
  token: string
): Promise<SearchDTO> => {
  const response = await axios.get(
    `${API_URL}?query=${encodeURIComponent(query)}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return response.data; // Assuming the response data contains the search results
};
