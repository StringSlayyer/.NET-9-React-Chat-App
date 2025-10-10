import { useEffect, useState } from "react";
import { getUserAvatar } from "../api/userApi";

interface UserAvatarProps {
  userId?: string;
  token?: string;
  size?: number;
  className?: string;
}

const UserAvatar = ({
  userId,
  token,
  size = 40,
  className = "",
}: UserAvatarProps) => {
  const [avatarUrl, setAvatarUrl] = useState<string>("");

  useEffect(() => {
    console.log("UserAvatar props - userId:", userId, "token:", token);
    if (!userId || !token) {
      console.log("No userId or token provided, using default avatar.");
      setAvatarUrl("/user.png");
      return;
    }

    let objectUrl: string | null = null;

    const loadAvatar = async () => {
      try {
        console.log("Loading avatar...");
        const response = await getUserAvatar(userId, token);
        console.log("Avatar blob URL loaded:", response);
        if (avatarUrl && avatarUrl.startsWith("blob:")) {
          URL.revokeObjectURL(avatarUrl);
        }
        objectUrl = response;
        setAvatarUrl(response);
      } catch (error) {
        console.error("Failed to load avatar", error);
        setAvatarUrl("/user.png");
      }
    };

    loadAvatar();
    return () => {
      if (objectUrl) {
        console.log("Revoking object URL", objectUrl);
        URL.revokeObjectURL(objectUrl);
      }
    };
  }, [userId, token]);

  return (
    <img
      src={avatarUrl}
      alt="User Avatar"
      className={`rounded-full ${className}`}
      style={{ width: size, height: size }}
    />
  );
};

export default UserAvatar;
