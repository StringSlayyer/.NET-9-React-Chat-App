import React, {
  createContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { getUser, type UserDTO } from "../api/userApi";

interface AuthContextType {
  token: string | null;
  login: (token: string) => void;
  logout: () => void;
  user: UserDTO | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [token, setToken] = useState<string | null>(
    localStorage.getItem("token")
  );

  const [user, setUser] = useState<UserDTO | null>(null);

  const login = (newToken: string) => {
    logout();
    setToken(newToken);
    localStorage.setItem("token", newToken);
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem("token");
  };

  const refreshUser = async () => {
    if (token) {
      try {
        const profile = await getUser(token);
        setUser(profile);
        console.log("Fetched user profile:", profile);
      } catch (error) {
        console.error("Failed to fetch user profile", error);
      }
    }
  };

  useEffect(() => {
    refreshUser();
  }, [token]);

  return (
    <AuthContext.Provider value={{ token, login, logout, user }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = React.useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
