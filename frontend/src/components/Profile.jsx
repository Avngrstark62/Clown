import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import UserPosts from './UserPosts';
import ProfileCard from './ProfileCard';

const Profile = () => {
  const { username } = useParams();
  const { loading } = useSelector((state) => state.auth);

  if (loading) return <p className="text-center py-4">Loading...</p>;

  return (
    <div className="container mx-auto p-4">
      <ProfileCard username={username} />
      <UserPosts username={username} />
    </div>
  );
};

export default Profile;