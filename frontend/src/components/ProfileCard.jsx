import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { followUser, getUserData, unfollowUser } from '../api/api';
import default_avatar from '../images/default-avatar.png';

const ProfileCard = ({ username }) => {
  const [profileType, setProfileType] = useState('');
  const navigate = useNavigate();
  const { loading } = useSelector((state) => state.auth);
  const [userData, setUserData] = useState(null);
  const [buttonClicked, setButtonClicked] = useState(0);

  useEffect(() => {
    const fetchUserData = async () => {
      const response = await getUserData(username);
      setUserData(response.data.user);
      setProfileType(response.data.profileType);
    };

    fetchUserData();
  }, [username, buttonClicked]);

  const handleEditProfile = () => {
    navigate('/edit-profile');
  };

  const handleFollow = async () => {
    try {
      await followUser({ username });
      setButtonClicked(buttonClicked + 1);
    } catch (error) {
      console.log(error);
    }
  };

  const handleUnfollow = async () => {
    try {
      await unfollowUser({ username });
      setButtonClicked(buttonClicked + 1);
    } catch (error) {
      console.log(error);
    }
  };

  const handleViewFollowers = () => {
    navigate(`/profile/${username}/connections/followers`);
  };

  const handleViewFollowing = () => {
    navigate(`/profile/${username}/connections/following`);
  };

  if (loading || !userData) return (
    <div className="flex justify-center items-center py-12">
      <div className="animate-spin rounded-full h-12 w-12 border-2 border-emerald-600 border-t-transparent"></div>
    </div>
  );

  return (
    <div className="bg-slate-50 rounded-xl shadow-sm border border-emerald-200 p-8">
      {/* Cover Area */}
      <div className="h-32 bg-gradient-to-r from-emerald-600 to-teal-600 rounded-lg mb-6 -m-8 mb-0"></div>

      {/* Profile Content */}
      <div className="relative pt-0">
        {/* Avatar */}
        <div className="flex flex-col items-center -mt-16 mb-6">
          <img
            src={userData.profilePic || default_avatar}
            alt="Profile"
            className="w-32 h-32 rounded-full border-4 border-white shadow-lg mb-4"
          />
          <h2 className="text-3xl font-bold text-gray-900">{userData.name || userData.username || 'Guest'}</h2>
          <h3 className="text-gray-600 text-lg mt-1">@{userData.username || 'guest'}</h3>
        </div>

        {/* Bio */}
        {userData.bio && (
          <p className="text-center text-gray-700 mb-6 text-lg">{userData.bio}</p>
        )}

        {/* Action Button */}
        <div className="flex justify-center mb-8">
          {profileType === 'self' ? (
            <button
              onClick={handleEditProfile}
              className="px-8 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-medium transition-colors"
            >
              Edit Profile
            </button>
          ) : profileType === 'following' ? (
            <button
              onClick={handleUnfollow}
              className="px-8 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors"
            >
              Unfollow
            </button>
          ) : (
            <button
              onClick={handleFollow}
              className="px-8 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-medium transition-colors"
            >
              Follow
            </button>
          )}
        </div>

        {/* Stats */}
        <div className="flex justify-center gap-8 pt-8 border-t border-emerald-200">
          <button
            onClick={handleViewFollowers}
            className="text-center hover:opacity-70 transition-opacity"
          >
            <div className="text-2xl font-bold text-gray-900">{userData.followersCount}</div>
            <div className="text-gray-600 text-sm">Followers</div>
          </button>
          <button
            onClick={handleViewFollowing}
            className="text-center hover:opacity-70 transition-opacity"
          >
            <div className="text-2xl font-bold text-gray-900">{userData.followingCount}</div>
            <div className="text-gray-600 text-sm">Following</div>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfileCard;