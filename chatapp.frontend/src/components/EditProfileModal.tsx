import { useState } from "react";
import type { UserDTO } from "../api/userApi";
import { updateUser, type UpdateUserDTO } from "../api/userApi";
import { type ChangePasswordDTO, updatePassword } from "../api/authApi";

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
  const [email, setEmail] = useState(user.email);
  const [profilePicture, setProfilePicture] = useState<File | null>(null);

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [uploading, setUploading] = useState(false);

  const handleSave = async () => {
    try {
      setUploading(true);

      const updatedUser: UpdateUserDTO = {
        firstName,
        lastName,
        email,
        profilePicture,
      };
      console.log("Updating user with data:", updatedUser);
      const res = await updateUser(updatedUser, token);
      console.log("Update response:", res);

      const updated = { ...user, firstName, lastName, email };
      onUpdated(updated);

      if (currentPassword && newPassword === confirmPassword) {
        const passwordData: ChangePasswordDTO = {
          currentPassword,
          newPassword,
        };
        console.log("Updating password with data:", passwordData);
        const passRes = await updatePassword(passwordData, token);
        console.log("Password update response:", passRes);
        if (!passRes.isSuccess) {
          alert("Password change failed: " + passRes.errorMessage);
          return;
        }
        console.log("Password change requested");
      }
      onClose();
    } catch (err) {
      console.error("Update failed", err);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
      <div className="bg-gray-900 rounded-lg p-6 w-[500px] shadow-lg border border-gray-700">
        <h2 className="text-xl font-bold text-gray-100 mb-4">Edit Profile</h2>

        {/* --- Profile Info --- */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-gray-400 text-sm mb-1">
              First name
            </label>
            <input
              className="w-full p-2 bg-gray-800 rounded text-gray-100 border border-gray-700 focus:ring-2 focus:ring-blue-600"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-gray-400 text-sm mb-1">
              Last name
            </label>
            <input
              className="w-full p-2 bg-gray-800 rounded text-gray-100 border border-gray-700 focus:ring-2 focus:ring-blue-600"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
            />
          </div>
        </div>

        {/* --- Email --- */}
        <div className="mb-4">
          <label className="block text-gray-400 text-sm mb-1">Email</label>
          <input
            type="email"
            className="w-full p-2 bg-gray-800 rounded text-gray-100 border border-gray-700 focus:ring-2 focus:ring-blue-600"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        {/* --- Profile Picture --- */}
        <div className="mb-4">
          <label className="block text-gray-400 text-sm mb-1">
            Profile picture
          </label>
          <input
            type="file"
            onChange={(e) =>
              setProfilePicture(e.target.files ? e.target.files[0] : null)
            }
            className="w-full text-gray-300 text-sm"
          />
          {profilePicture && (
            <img
              src={URL.createObjectURL(profilePicture)}
              alt="Preview"
              className="mt-2 w-20 h-20 rounded-full object-cover"
            />
          )}
        </div>

        {/* --- Password Section --- */}
        <div className="border-t border-gray-700 mt-4 pt-4">
          <h3 className="text-gray-300 font-semibold mb-2 text-sm">
            Change Password
          </h3>
          <div className="space-y-2">
            <input
              type="password"
              placeholder="Old password"
              className="w-full p-2 bg-gray-800 rounded text-gray-100 border border-gray-700"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
            />
            <input
              type="password"
              placeholder="New password"
              className="w-full p-2 bg-gray-800 rounded text-gray-100 border border-gray-700"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
            <input
              type="password"
              placeholder="Confirm new password"
              className="w-full p-2 bg-gray-800 rounded text-gray-100 border border-gray-700"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </div>
        </div>

        {/* --- Actions --- */}
        <div className="flex justify-end gap-3 mt-6">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-gray-200 rounded"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={uploading}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded"
          >
            {uploading ? "Saving..." : "Save"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditProfileModal;
