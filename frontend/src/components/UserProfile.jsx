import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import default_avatar from '../images/default-avatar.png';
import '../styles/profile.css';
import { getOtherUserData } from '../api/api';


const UserProfile = () => {
  const { username } = useParams();
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      const response = await getOtherUserData(username);
      setUserData(response.data.user);
    };

    fetchUserData();
  }, [username]);

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
      </div>
    </div>
  );
}

export default UserProfile;