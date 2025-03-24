import { useState, useEffect } from "react";
import { searchUsers } from "../api/api";
import { useNavigate } from "react-router-dom";

const Search = () => {
  const [query, setQuery] = useState("");
  const [users, setUsers] = useState([]);
  const navigate = useNavigate();

  // Function to fetch users from backend
  const fetchUsers = async (searchQuery) => {
    if (searchQuery.trim()) {
      try {
        const formData = { query: searchQuery };
        const response = await searchUsers(formData);
        setUsers(response.data.users.slice(0, 5));
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    } else {
      setUsers([]); // Clear results if search box is empty
    }
  };

  // Fetch users when query changes (debounced)
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (query) {
        fetchUsers(query);
      }
    }, 500); // Delay API call to avoid too many requests

    return () => clearTimeout(delayDebounceFn);
  }, [query]);

  // Manually trigger search on button click
  const handleSearch = () => {
    fetchUsers(query);
  };

  const handleUserClick = (e) => {
    const username = e.currentTarget.querySelector("h3").textContent;
    navigate(`/profile/${username}`);
  };

  return (
    <div className="flex flex-col items-center p-4 min-h-screen bg-gray-100 pt-16">
      {/* Search Bar */}
      <div className="w-full max-w-lg flex gap-2 bg-white p-3 rounded-lg shadow-md">
        <input
          type="text"
          placeholder="Search using name or username"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="flex-1 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          onClick={handleSearch}
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition"
        >
          Search
        </button>
      </div>

      {/* User List */}
      <div className="mt-6 w-full max-w-lg bg-white p-4 rounded-lg shadow-md">
        {users.length > 0 ? (
          users.map((user) => (
            <div
              key={user._id}
              className="p-3 border-b last:border-none cursor-pointer hover:bg-gray-100 rounded-md transition"
              onClick={handleUserClick}
            >
              <h3 className="text-lg font-semibold">{user.username}</h3>
              <p className="text-gray-600">{user.name}</p>
            </div>
          ))
        ) : (
          <p className="text-center text-gray-500">No users found</p>
        )}
      </div>
    </div>
  );
};

export default Search;