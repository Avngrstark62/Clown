import { useDispatch, useSelector } from 'react-redux';
import { logoutUser } from '../redux/authSlice';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { getUserData } from '../api/api';
import default_avatar from '../images/default-avatar.png';
import '../styles/profile.css';


const MyProfile = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading } = useSelector((state) => state.auth);
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      const response = await getUserData();
      setUserData(response.data.user);
    };

    fetchUserData();
  }, []);
  
  const handleLogout = () => {
    dispatch(logoutUser()).then(() => {
      navigate('/login');
    });
  };

  const handleEditProfile = () => {
    navigate('/edit-profile');
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
          <p><span>Followers:</span> {userData.followersCount}</p>
          <p><span>Following:</span> {userData.followingCount}</p>
        </div>

        <button className="edit-btn" onClick={handleEditProfile}>Edit Profile</button>
        <button className="logout-btn" onClick={handleLogout}>Logout</button>
      </div>
    </div>
  );
}

export default MyProfile;