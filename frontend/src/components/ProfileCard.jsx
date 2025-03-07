import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { followUser, getUserData, unfollowUser } from '../api/api';
import default_avatar from '../images/default-avatar.png';
import '../styles/profile-card.css'

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

  if (loading) return <p className="loading">Loading...</p>;
  if (!userData) return <p className="loading">Loading...</p>;

  return (
      <div className="profile-card">
        <div className="profile-header">
          <img src={userData.profilePic || default_avatar} alt="Profile" className="profile-pic" />
          {console.log(userData.profilePic)}
          <h2 className="name">{userData.name || userData.username || 'Guest'}</h2>
          <h3 className="username">{'@'+userData.username || 'Guest'}</h3>
        </div>

        <div className="profile-actions">
        {profileType === 'self' ? (
            <button className="edit-btn" onClick={handleEditProfile}>Edit Profile</button>
        ) : profileType === 'following' ? (
          <button className="unfollow-btn" onClick={handleUnfollow}>Unfollow</button>
        ) : (
          <button className="follow-btn" onClick={handleFollow}>Follow</button>
        )}
        </div>

        <div className="profile-info">
          <p className="bio">{userData.bio || null}</p>
          <div className='connections'>
          <p className="see-connections" onClick={handleViewFollowers}> {userData.followersCount} Followers</p>
          <p className="see-connections" onClick={handleViewFollowing}> {userData.followingCount} Following</p>
          </div>
        </div>

      </div>
  );
};

export default ProfileCard;