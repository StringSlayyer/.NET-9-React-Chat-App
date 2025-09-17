import { Outlet } from "react-router-dom";

const MainLayout = () => {
  return (
    <div className="flex flex-col max-h-screen bg-gray-900 text-white">
      {/* Header */}
      <header className="bg-primary p-4 flex items-center justify-center shadow-md">
        <h1 className="text-xl font-bold">ChatApp</h1>
      </header>

      {/* Main content (vyplní zbytek výšky) */}
      <main className="flex-1 flex overflow-hidden">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="bg-gray-800 h-[4vh] text-center text-sm">
        © 2025 ChatApp
      </footer>
    </div>
  );
};
export default MainLayout;
