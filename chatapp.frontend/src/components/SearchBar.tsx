import { useState, useEffect } from "react";

interface SearchBarProps {
  onSearch: (query: string) => void;
}

const SearchBar = ({ onSearch }: SearchBarProps) => {
  const [query, setQuery] = useState("");

  useEffect(() => {
    const timeout = setTimeout(() => {
      onSearch(query.trim());
    }, 300);
    return () => clearTimeout(timeout);
  }, [query]);

  return (
    <input
      type="text"
      placeholder="Search users or chats..."
      className="w-full p-2 mb-3 bg-gray-800 text-gray-200 rounded outline-none"
      value={query}
      onChange={(e) => setQuery(e.target.value)}
    />
  );
};

export default SearchBar;
