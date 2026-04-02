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
    <div className="space-y-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900">Connections</h1>
        <p className="text-gray-600 mt-2">Manage your followers and following</p>
      </div>

      {/* Tab Navigation */}
      <div className="bg-slate-50 rounded-xl shadow-sm border border-emerald-200 overflow-hidden">
        <div className="flex">
          <button
            onClick={() => setActiveTab('followers')}
            className={`flex-1 py-4 font-semibold text-center border-b-2 transition-colors ${
              activeTab === 'followers'
                ? 'text-emerald-600 border-emerald-600 bg-emerald-50'
                : 'text-gray-600 border-emerald-200 hover:text-gray-900'
            }`}
          >
            Followers
          </button>
          <button
            onClick={() => setActiveTab('following')}
            className={`flex-1 py-4 font-semibold text-center border-b-2 transition-colors ${
              activeTab === 'following'
                ? 'text-emerald-600 border-emerald-600 bg-emerald-50'
                : 'text-gray-600 border-emerald-200 hover:text-gray-900'
            }`}
          >
            Following
          </button>
        </div>

        {/* User List */}
        <div className="divide-y divide-gray-200">
          {users.length > 0 ? (
            users.map((user) => (
              <div
                key={user._id}
                onClick={handleUserClick}
                className="flex items-center gap-4 p-4 hover:bg-emerald-50 cursor-pointer transition-colors"
              >
                <img
                  src={user.profilePic || default_avatar}
                  alt="Profile"
                  className="w-14 h-14 rounded-full object-cover flex-shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-gray-900 text-lg">
                    @{user.username}
                  </h3>
                  <p className="text-gray-600 text-sm">{user.name}</p>
                </div>
                <div className="text-2xl text-gray-400">→</div>
              </div>
            ))
          ) : (
            <div className="p-12 text-center">
              <p className="text-gray-500 text-lg">No {activeTab === 'followers' ? 'followers' : 'following'} yet</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Connections;