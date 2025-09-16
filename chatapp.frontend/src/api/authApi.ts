import axios from "axios";

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
}

export const login = async (data: LoginDTO) => {
  const response = await axios.post(`${API_URL}/login`, data);
  return response.data;
};

export const register = async (data: RegistrationDTO) => {
  const response = await axios.post(`${API_URL}/register`, data);
  return response.data;
};
