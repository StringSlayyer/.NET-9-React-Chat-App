import { useState } from "react";
import { login } from "../api/authApi";
import { useAuth } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";

const LoginPage = () => {
  const { login: saveToken } = useAuth();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    console.log("Submitting form with:", { username, password });
    e.preventDefault();
    try {
      console.log("Logging in...");
      const res = await login({ username, password });
      console.log("Login response:", res);
      if (res.token) {
        console.log("Login successful");
        saveToken(res.token);
        console.log("Redirecting to /chat");
        navigate("/chat");
        console.log("Redirected to /chat");
      }
    } catch (error) {
      console.error("Login failed", error);
    }
  };
  return (
    <div className="flex flex-col items-center justify-center w-screen h-screen">
      <div className="flex flex-col items-center bg-gray-800 p-12 mb-32 w-1/3 justify-center rounded">
        <div className="w-full max-w-md">
          <h2 className="text-2xl font-bold mb-8">Přihlášení</h2>
          <form className="mb-6" onSubmit={handleSubmit}>
            <div>
              <label className="block mb-2">Uživatelské jméno</label>
              <input
                type="text"
                className="w-full p-2 border border-gray-300 rounded bg-gray-800 text-white"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
            <div className="mt-4">
              <label className="block mb-2">Heslo</label>
              <input
                type="password"
                className="w-full p-2 border border-gray-300 rounded bg-gray-800 text-white"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <button
              type="submit"
              className="w-full bg-white text-gray-800 font-semibold py-2 px-4 rounded hover:bg-primary-dark mt-8"
            >
              Přihlásit se
            </button>
          </form>
          <p>
            Nemáte účet?{" "}
            <Link to="/register" className="text-primary underline">
              Zaregistrujte se
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
