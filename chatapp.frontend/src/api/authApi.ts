import axios from "axios";
import type { Result } from "./types";

const API_URL = "http://localhost:8080/api/Auth";

export interface LoginDTO {
  username: string;
  password: string;
}

export interface RegistrationDTO {
  username: string;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  profilePicture?: File;
}

export interface UserIdResponse {
  userId: string;
}

export interface TokenResponse {
  token: string;
}

export const login = async (data: LoginDTO): Promise<Result<TokenResponse>> => {
  const response = await axios.post(`${API_URL}/login`, data);
  return response.data as Result<TokenResponse>;
};

export const register = async (
  formData: FormData
): Promise<Result<RegistrationDTO>> => {
  const response = await axios.post(`${API_URL}/register`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data as Result<RegistrationDTO>;
};

export const getUserId = async (token: string): Promise<UserIdResponse> => {
  const response = await axios.get(`${API_URL}/getUserId`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data as UserIdResponse;
};
