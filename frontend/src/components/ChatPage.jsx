import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { getFollowingList } from "../api/api";
import { useNavigate } from "react-router-dom";

const ChatPage = () => {
  const [followingUsers, setFollowingUsers] = useState([]);
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    const fetchFollowingUsers = async () => {
      try {
        if (user) {
          const response = await getFollowingList(user);
          setFollowingUsers(response.data.following);
        }
      } catch (error) {
        console.error("Error fetching following users:", error);
      }
    };

    fetchFollowingUsers();
  }, [user]);

  const navigate = useNavigate();

  const handleUserClick = (user) => {
    navigate("/chat/" + user._id.toString());
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900">Messages</h1>
        <p className="text-gray-600 mt-2">Chat with people you follow</p>
      </div>

      {/* User List Container */}
      <div className="bg-slate-50 rounded-xl shadow-sm border border-emerald-200 overflow-hidden">
        {followingUsers.length > 0 ? (
          <div className="divide-y divide-gray-200">
            {followingUsers.map((user) => (
              <div
                key={user._id}
                className="flex items-center justify-between p-4 hover:bg-emerald-50 cursor-pointer transition-colors"
                onClick={() => handleUserClick(user)}
              >
                <div>
                  <h3 className="font-semibold text-gray-900 text-lg">
                    {user.username}
                  </h3>
                  <p className="text-gray-600 text-sm mt-1">{user.name}</p>
                </div>
                <div className="text-2xl">→</div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-12 text-center">
            <p className="text-gray-500 text-lg">No users to chat with yet</p>
            <p className="text-gray-400 text-sm mt-2">Follow people to start messaging</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatPage;