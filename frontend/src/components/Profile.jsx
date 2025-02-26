import { useDispatch, useSelector } from 'react-redux';
import { logoutUser } from '../redux/authSlice';
import { useNavigate, useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { followUser, getUserData, unfollowUser } from '../api/api';
import default_avatar from '../images/default-avatar.png';
import '../styles/profile.css';


const Profile = () => {
  const { username } = useParams();
  const [profileType, setProfileType] = useState('');

  const dispatch = useDispatch();
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
  
  const handleLogout = () => {
    dispatch(logoutUser()).then(() => {
      navigate('/login');
    });
  };

  const handleEditProfile = () => {
    navigate('/edit-profile');
  };

  const handleFollow = async () => {
    try{
      await followUser({ username });
      setButtonClicked(buttonClicked + 1);
    }
    catch(error){
      console.log(error);
    }
  };

  const handleUnfollow = async () => {
    try{
      await unfollowUser({ username });
      setButtonClicked(buttonClicked + 1);
    }
    catch(error){
      console.log(error);
    }
  };

  const handleViewFollowers = () => {
    const type = 'followers';
    navigate(`/profile/${username}/connections/${type}`);
  };

  const handleViewFollowing = () => {
    const type = 'following';
    navigate(`/profile/${username}/connections/${type}`);
  };

  if (loading) return <p className="loading">Loading...</p>;
  if (!userData) return <p className="loading">Loading...</p>;
  return (
    <div className="profile-container">
      <div className="profile-card">
        <div className="profile-header">
          <img 
            src={default_avatar}
            alt="Profile" 
            className="profile-pic" 
          />
          <h1 className="username">{userData.username || 'Guest'}</h1>
          <p className="bio">{userData.bio || 'No bio available'}</p>
        </div>

        <div className="profile-info">
          <p><span>Name:</span> {userData.name}</p>
          <p className='see-connections' onClick={handleViewFollowers}><span>Followers:</span> {userData.followersCount}</p>
          <p className='see-connections' onClick={handleViewFollowing}><span>Following:</span> {userData.followingCount}</p>
        </div>

        {profileType === 'self' ? (
          <div className="profile-actions">
            <button className="edit-btn" onClick={handleEditProfile}>Edit Profile</button>
            <button className="logout-btn" onClick={handleLogout}>Logout</button>
          </div>
        ):profileType === 'following' ? (
          <button className="unfollow-btn" onClick={handleUnfollow}>Unfollow</button>
        ):(
          <button className="follow-btn" onClick={handleFollow}>Follow</button>
        )}
      </div>
    </div>
  );
}

export default Profile;