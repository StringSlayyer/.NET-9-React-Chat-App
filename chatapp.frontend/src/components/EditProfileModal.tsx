import { useState } from "react";
import type { UserDTO } from "../api/userApi";

interface EditProfileModalProps {
  user: UserDTO;
  token: string;
  onClose: () => void;
  onUpdated: (updated: UserDTO) => void;
}

const EditProfileModal = ({
  user,
  token,
  onClose,
  onUpdated,
}: EditProfileModalProps) => {
  const [firstName, setFirstName] = useState(user.firstName);
  const [lastName, setLastName] = useState(user.lastName);
  const [uploading, setUploading] = useState(false);

  const handleSave = async () => {
    try {
      setUploading(true);
      // call your PUT / PATCH user API here
      const updated = { ...user, firstName, lastName };
      // const res = await updateUser(updated, token);
      onUpdated(updated);
      onClose();
    } catch (err) {
      console.error("Update failed", err);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
      <div className="bg-gray-900 rounded-lg p-6 w-96 shadow-lg border border-gray-700">
        <h2 className="text-lg font-semibold text-gray-100 mb-4">
          Edit Profile
        </h2>
        <label className="block mb-2 text-gray-400 text-sm">First name</label>
        <input
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
          className="w-full mb-3 bg-gray-800 text-gray-100 px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-600"
        />
        <label className="block mb-2 text-gray-400 text-sm">Last name</label>
        <input
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
          className="w-full mb-3 bg-gray-800 text-gray-100 px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-600"
        />

        <div className="flex justify-end gap-2 mt-4">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded text-gray-200"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={uploading}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-500 rounded text-white"
          >
            {uploading ? "Saving..." : "Save"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditProfileModal;
