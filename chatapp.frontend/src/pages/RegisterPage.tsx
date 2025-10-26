import React, { useState } from "react";
import { register } from "../api/authApi";
import { useAuth } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";

const RegisterPage = () => {
  const { login: saveToken } = useAuth();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [profilePicture, setProfilePicture] = useState<File | null>(null);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      alert("Hesla se neshodují");
      return;
    }
    try {
      console.log("Registering user...");
      const formData = new FormData();
      formData.append("username", username);
      formData.append("password", password);
      formData.append("firstName", firstName);
      formData.append("lastName", lastName);
      formData.append("email", email);
      if (profilePicture) {
        formData.append("profilePicture", profilePicture);
      }
      const res = await register(formData);
      console.log("Registration response:", res);
      if (res.data.token) {
        console.log("Registration successful");
        saveToken(res.data.token);
        console.log("Redirecting to /chat");
        navigate("/chat");
        console.log("Redirected to /chat");
      }
    } catch (error) {
      console.error("Registration failed", error);
      alert("Registrace se nezdařila");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center w-screen h-screen">
      <div className="flex flex-col items-center bg-gray-800 p-6 w-1/3 h-fit mb-32 justify-center rounded">
        <div className="w-full max-w-md">
          <h2 className="text-2xl font-bold mb-8">Registrace</h2>
          <form className="mb-3" onSubmit={handleSubmit}>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div>
                  <label className="block mb-1">Uživatelské jméno</label>
                  <input
                    type="text"
                    className="w-full p-1 border border-gray-300 rounded bg-gray-800 text-white"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                  />
                </div>
                <div className="mt-4">
                  <label className="block mb-1">Jméno</label>
                  <input
                    type="text"
                    className="w-full p-1 border border-gray-300 rounded bg-gray-800 text-white"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                  />
                </div>
                <div className="mt-4">
                  <label className="block mb-1">Příjmení</label>
                  <input
                    type="text"
                    className="w-full p-1 border border-gray-300 rounded bg-gray-800 text-white"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                  />
                </div>
                <div className="mt-4">
                  <label className="block mb-1">Email</label>
                  <input
                    type="email"
                    className="w-full p-1 border border-gray-300 rounded bg-gray-800 text-white"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </div>
              <div>
                <div>
                  <label className="block mb-1">Heslo</label>
                  <input
                    type="password"
                    className="w-full p-1 border border-gray-300 rounded bg-gray-800 text-white"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
                <div className="mt-4">
                  <label className="block mb-1">Potvrzení hesla</label>
                  <input
                    type="password"
                    className="w-full p-1 border border-gray-300 rounded bg-gray-800 text-white"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                  />
                </div>
                <div className="mt-4">
                  <label className="block mb-1">Profile Picture</label>
                  <input
                    type="file"
                    className="w-full p-1 border border-gray-300 rounded bg-gray-800 text-white"
                    onChange={(e) =>
                      setProfilePicture(
                        e.target.files ? e.target.files[0] : null
                      )
                    }
                  />
                  <img
                    src={
                      profilePicture ? URL.createObjectURL(profilePicture) : ""
                    }
                    alt="Profile Preview"
                    className="mt-2 w-20 h-20 object-cover rounded-full"
                  />
                </div>
              </div>
            </div>
            <button
              type="submit"
              className="w-full bg-white text-gray-800 font-semibold py-2 px-4 rounded hover:bg-primary-dark mt-4"
            >
              Registrovat se
            </button>
          </form>
          <p>
            Již máte účet?{" "}
            <Link to="/login" className="text-primary underline">
              Přihlaste se
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
