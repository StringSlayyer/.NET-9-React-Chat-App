import { useEffect, useState } from "react";
import { Navigate } from "react-router";
import { useAuth } from "../context/AuthContext";
import { getUserId } from "../api/authApi";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { token } = useAuth();
  const [isValid, setIsValid] = useState<boolean | null>(null); // null = loading

  useEffect(() => {
    if (!token) {
      setIsValid(false);
      return;
    }

    const checkToken = async () => {
      try {
        await getUserId(token);
        setIsValid(true);
      } catch (error) {
        console.warn("Token validation failed:", error);
        setIsValid(false);
      }
    };

    checkToken();
  }, [token]);

  // While checking
  if (isValid === null) return <div>Loading...</div>;

  if (!isValid) return <Navigate to="/login" replace />;

  return <>{children}</>;
};

export default ProtectedRoute;

const UnprotectedRoute = ({ children }: ProtectedRouteProps) => {
  const { token } = useAuth();
  const [isValid, setIsValid] = useState<boolean | null>(null);

  useEffect(() => {
    if (!token) {
      setIsValid(false);
      return;
    }

    const checkToken = async () => {
      try {
        await getUserId(token);
        setIsValid(true);
      } catch {
        setIsValid(false);
      }
    };

    checkToken();
  }, [token]);

  if (isValid === null) return <div>Loading...</div>;

  if (isValid) return <Navigate to="/chat" replace />;

  return <>{children}</>;
};
export { UnprotectedRoute };
