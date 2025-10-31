import axios from "axios";
import type { Result } from "./types";

const API_URL = "http://localhost:8080/api/User";

export interface UserDTO {
  id: string;
  username: string;
  firstName: string;
  lastName: string;
  email: string;
  profilePictureUrl?: string;
}

export interface UpdateUserDTO {
  firstName?: string;
  lastName?: string;
  email?: string;
  profilePicture?: File | null;
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

export const updateUser = async (
  updatedUser: UpdateUserDTO,
  token: string
): Promise<Result> => {
  const formData = new FormData();
  if (updatedUser.firstName) {
    formData.append("firstName", updatedUser.firstName);
  }
  if (updatedUser.lastName) {
    formData.append("lastName", updatedUser.lastName);
  }
  if (updatedUser.email) {
    formData.append("email", updatedUser.email);
  }
  if (updatedUser.profilePicture) {
    formData.append("profilePicture", updatedUser.profilePicture);
  }
  const response = await axios.put<Result>(
    `${API_URL}/updateProfile`,
    formData,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
      },
    }
  );
  return response.data;
};
