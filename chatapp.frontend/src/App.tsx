import { Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import ChatPage from "./pages/ChatPage";
import MainLayout from "./layouts/MainLayout";
import ProtectedRoute, { UnprotectedRoute } from "./pages/ProtectedRoute";
function App() {
  return (
    <div>
      <Routes>
        <Route element={<MainLayout />}>
          <Route
            path="/login"
            element={
              <UnprotectedRoute>
                <LoginPage />
              </UnprotectedRoute>
            }
          />
          <Route
            path="/register"
            element={
              <UnprotectedRoute>
                <RegisterPage />
              </UnprotectedRoute>
            }
          />
          <Route
            path="/chat"
            element={
              <ProtectedRoute>
                <ChatPage />
              </ProtectedRoute>
            }
          />
        </Route>
        <Route path="/" element={<Navigate to="/login" replace />} />
      </Routes>
    </div>
  );
}

export default App;
