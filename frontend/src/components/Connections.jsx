import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getFollowersList, getFollowingList } from '../api/api';
import { useNavigate } from 'react-router-dom';
import default_avatar from '../images/default-avatar.png';

const Connections = () => {
  const { username, type } = useParams();
  const [activeTab, setActiveTab] = useState(type === 'following' ? 'following' : 'followers');
  const [users, setUsers] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchFollowers = async () => {
      try {
        const response = await getFollowersList(username);
        setUsers(response.data.followers);
      } catch (error) {
        console.error(error);
      }
    };

    const fetchFollowing = async () => {
      try {
        const response = await getFollowingList(username);
        setUsers(response.data.following);
      } catch (error) {
        console.error(error);
      }
    };

    if (activeTab === 'followers') fetchFollowers();
    else fetchFollowing();
  }, [activeTab, username]);

  const handleUserClick = (e) => {
    const username = e.currentTarget.querySelector('h3').textContent;
    navigate(`/profile/${username}`);
  };

  return (
    <div className="min-h-screen bg-transparent py-8 px-4 sm:px-6 lg:px-8 pt-16">
      <div className="max-w-3xl mx-auto bg-white dark:bg-gray-900 rounded-lg shadow-lg p-6">
        {/* Tab Header */}
        <div className="flex justify-center space-x-8 border-b border-gray-200 dark:border-gray-800 mb-6">
          <button
            className={`pb-2 text-lg font-semibold ${
              activeTab === 'followers'
                ? 'text-blue-500 border-b-2 border-blue-500'
                : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
            }`}
            onClick={() => setActiveTab('followers')}
          >
            Followers
          </button>
          <button
            className={`pb-2 text-lg font-semibold ${
              activeTab === 'following'
                ? 'text-blue-500 border-b-2 border-blue-500'
                : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
            }`}
            onClick={() => setActiveTab('following')}
          >
            Following
          </button>
        </div>

        {/* User List */}
        <div className="space-y-4">
          {users.length > 0 ? (
            users.map((user) => (
              <div
                key={user._id}
                onClick={handleUserClick}
                className="flex items-center p-4 bg-gray-50 dark:bg-gray-800 rounded-lg cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 transition"
              >
                <div className="flex-shrink-0">
                  <img
                    src={user.profilePic || default_avatar}
                    alt="Profile"
                    className="w-12 h-12 rounded-full object-cover"
                  />
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">{user.username}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{user.name}</p>
                </div>
              </div>
            ))
          ) : (
            <p className="text-center text-gray-500 dark:text-gray-400">No users found</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Connections;