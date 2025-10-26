import { useState, useRef, useEffect } from "react";
import type { UserDTO } from "../api/userApi";
import UserAvatar from "./UserAvatar";

interface LoggedUserProps {
  token: string;
  userDTO?: UserDTO | null;
  onLogout?: () => void;
  onEditProfile?: () => void;
}

const LoggedUser = ({
  token,
  userDTO,
  onLogout,
  onEditProfile,
}: LoggedUserProps) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative mb-4 pb-4 border-b border-gray-800" ref={menuRef}>
      <div className="flex items-center justify-between">
        {/* Left side: avatar + name */}
        <div className="flex items-center gap-3">
          <UserAvatar userId={userDTO?.id} token={token} size={45} />
          <div>
            <p className="text-gray-100 font-medium leading-tight">
              {userDTO?.firstName} {userDTO?.lastName}
            </p>
            <p className="text-gray-500 text-sm">{userDTO?.email}</p>
          </div>
        </div>

        {/* Right side: three dots */}
        <button
          className="text-gray-400 hover:text-gray-200 p-2 rounded"
          onClick={() => setMenuOpen((prev) => !prev)}
        >
          {/* simple SVG for three dots */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="currentColor"
          >
            <circle cx="5" cy="12" r="2" />
            <circle cx="12" cy="12" r="2" />
            <circle cx="19" cy="12" r="2" />
          </svg>
        </button>
      </div>

      {/* Dropdown menu */}
      {menuOpen && (
        <div className="absolute right-0 mt-2 w-40 bg-gray-800 rounded-lg shadow-lg z-10 overflow-hidden border border-gray-700">
          <button
            onClick={() => {
              setMenuOpen(false);
              onEditProfile?.();
            }}
            className="w-full flex items-center gap-2 px-3 py-2 hover:bg-gray-700 text-gray-200 text-sm"
          >
            {/* small user SVG */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M12 12c2.7 0 5-2.3 5-5s-2.3-5-5-5-5 2.3-5 5 2.3 5 5 5zm0 2c-3.3 0-10 1.7-10 5v3h20v-3c0-3.3-6.7-5-10-5z" />
            </svg>
            Edit profile
          </button>

          <button
            onClick={() => {
              setMenuOpen(false);
              onLogout?.();
            }}
            className="w-full flex items-center gap-2 px-3 py-2 hover:bg-red-600 text-gray-200 text-sm"
          >
            {/* small logout SVG */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M16 13v-2H7V8l-5 4 5 4v-3zM20 3h-8v2h8v14h-8v2h8c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2z" />
            </svg>
            Log out
          </button>
        </div>
      )}
    </div>
  );
};

export default LoggedUser;
