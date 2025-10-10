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

export const getUserAvatar = async (
  userId: string,
  token: string
): Promise<string> => {
  const response = await axios.get(
    `${API_URL}/getProfilePicture?userId=${userId}`,
    {
      responseType: "blob",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  console.log("Avatar response:", response);
  return URL.createObjectURL(response.data);
};
