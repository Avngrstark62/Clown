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
    <div className="min-h-screen flex flex-col items-center bg-gray-100 p-4 pt-16">
      {/* Header */}
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Messages(Only the users you follow will appear here)</h2>

      {/* User List Container */}
      <div className="w-full max-w-md bg-white shadow-md rounded-lg p-4">
        {followingUsers.length > 0 ? (
          followingUsers.map((user) => (
            <div
              key={user._id}
              className="flex items-center justify-between p-3 border-b last:border-none hover:bg-gray-100 cursor-pointer rounded-md transition"
              onClick={() => handleUserClick(user)}
            >
              <div>
                <h3 className="text-lg font-semibold text-gray-800">
                  {user.username}
                </h3>
                <p className="text-gray-600">{user.name}</p>
              </div>
            </div>
          ))
        ) : (
          <p className="text-center text-gray-500">No users found</p>
        )}
      </div>
    </div>
  );
};

export default ChatPage;