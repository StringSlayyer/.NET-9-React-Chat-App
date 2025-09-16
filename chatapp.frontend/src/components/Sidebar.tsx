const Sidebar = () => {
  return (
    <div className="h-full p-4 overflow-y-auto bg-gray-950">
      <h2 className="text-lg font-bold mb-4">Konverzace</h2>
      <ul>
        <li className="p-2 hover:bg-gray-700 rounded cursor-pointer">
          <a href="#" className="text-gray-400 hover:text-white">
            Room 1
          </a>
        </li>
        <li className="p-2 hover:bg-gray-700 rounded cursor-pointer">
          <a href="#" className="text-gray-400 hover:text-white">
            Room 2
          </a>
        </li>
        <li className="p-2 hover:bg-gray-700 rounded cursor-pointer">
          <a href="#" className="text-gray-400 hover:text-white">
            Room 3
          </a>
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;
