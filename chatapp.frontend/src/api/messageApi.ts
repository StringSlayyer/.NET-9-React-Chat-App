import axios from "axios";

const API_URL = "http://localhost:8080/api";
export interface GetMessagesPagedDTO {
  conversationId: string;
  pageNumber: number;
  pageSize: number;
}

export interface SendMessageDTO {
  conversationId: string;
  content: string;
}

export interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  content: string;
  sentAt: string;
  isRead: boolean;
}

export const getMessagesPaged = async (
  data: GetMessagesPagedDTO,
  token: string
): Promise<Message[]> => {
  const response = await axios.get(
    `${API_URL}/Conversation/getMessagesPaged?conversationId=${data.conversationId}&pageNumber=${data.pageNumber}&pageSize=${data.pageSize}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return response.data;
};

export const sendMessage = async (
  data: SendMessageDTO,
  token: string
): Promise<Message> => {
  const response = await axios.post(`${API_URL}/Messages`, data, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};
