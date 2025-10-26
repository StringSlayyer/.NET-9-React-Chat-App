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
    if (!userId || !token) {
      setAvatarUrl("/user.png");
      return;
    }

    let cancelled = false;
    let prevObjectUrl: string | null = null;

    const loadAvatar = async () => {
      try {
        const response = await getUserAvatar(userId, token);
        if (!cancelled) {
          if (prevObjectUrl) URL.revokeObjectURL(prevObjectUrl);
          prevObjectUrl = response;
          setAvatarUrl(response);
        }
      } catch (error) {
        console.error("Failed to load user avatar", error);
        if (!cancelled) setAvatarUrl("/user.png");
      }
    };

    loadAvatar();

    return () => {
      cancelled = true;
      if (prevObjectUrl) {
        URL.revokeObjectURL(prevObjectUrl);
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
