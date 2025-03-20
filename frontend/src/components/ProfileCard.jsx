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

  if (loading || !userData) return <p className="text-center py-4">Loading...</p>;

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <div className="text-center">
        <img
          src={userData.profilePic || default_avatar}
          alt="Profile"
          className="w-24 h-24 rounded-full mx-auto mb-4"
        />
        <h2 className="text-xl font-bold">{userData.name || userData.username || 'Guest'}</h2>
        <h3 className="text-gray-500">{'@' + userData.username || 'Guest'}</h3>
      </div>

      <div className="flex justify-center mt-4">
        {profileType === 'self' ? (
          <button
            onClick={handleEditProfile}
            className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition"
          >
            Edit Profile
          </button>
        ) : profileType === 'following' ? (
          <button
            onClick={handleUnfollow}
            className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition"
          >
            Unfollow
          </button>
        ) : (
          <button
            onClick={handleFollow}
            className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition"
          >
            Follow
          </button>
        )}
      </div>

      <div className="mt-4 text-center">
        <p className="text-gray-700">{userData.bio || null}</p>
        <div className="flex justify-center space-x-4 mt-2">
          <p
            onClick={handleViewFollowers}
            className="text-blue-500 cursor-pointer hover:underline"
          >
            {userData.followersCount} Followers
          </p>
          <p
            onClick={handleViewFollowing}
            className="text-blue-500 cursor-pointer hover:underline"
          >
            {userData.followingCount} Following
          </p>
        </div>
      </div>
    </div>
  );
};

export default ProfileCard;