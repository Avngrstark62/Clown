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

  const handleUserClick = (username) => {
    navigate(`/profile/${username}`);
  };

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900">Search</h1>
        <p className="text-gray-600 mt-2">Find people to connect with</p>
      </div>

      {/* Search Bar */}
      <div className="flex gap-2">
        <input
          type="text"
          placeholder="Search by name or username..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
          className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
        />
        <button
          onClick={handleSearch}
          className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-medium transition-colors"
        >
          Search
        </button>
      </div>

      {/* User List */}
      {users.length > 0 && (
        <div className="bg-slate-50 rounded-xl shadow-sm border border-emerald-200 overflow-hidden">
          <div className="divide-y divide-gray-200">
            {users.map((user) => (
              <div
                key={user._id}
                className="p-4 hover:bg-emerald-50 cursor-pointer transition-colors"
                onClick={() => handleUserClick(user.username)}
              >
                <h3 className="font-semibold text-gray-900 text-lg">
                  @{user.username}
                </h3>
                <p className="text-gray-600 text-sm mt-1">{user.name}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {query && users.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">No users found</p>
          <p className="text-gray-400 text-sm mt-2">Try searching with a different term</p>
        </div>
      )}

      {!query && (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <p className="text-gray-500 text-lg">Start searching to find people</p>
        </div>
      )}
    </div>
  );
};

export default Search;