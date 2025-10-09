import axios from "axios";

const API_URL = "http://localhost:8080/api/User";

export interface UserDTO {
  id: string;
  username: string;
  firstName: string;
  lastName: string;
  email: string;
  profilePictureUrl?: string;
}

export const getUser = async (token: string): Promise<UserDTO> => {
  const response = await axios.get<UserDTO>(`${API_URL}/getUser`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};
