import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import UserPosts from './UserPosts';
import ProfileCard from './ProfileCard';
import '../styles/profile.css';

const Profile = () => {
  const { username } = useParams();

  const { loading } = useSelector((state) => state.auth);

  if (loading) return <p className="loading">Loading...</p>;

  return (
    <div className="profile-container">
      <ProfileCard username={username}/>
      <UserPosts username={username}/>
    </div>
  );
};

export default Profile;