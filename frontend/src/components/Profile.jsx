import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import UserPosts from './UserPosts';
import ProfileCard from './ProfileCard';

const Profile = () => {
  const { username } = useParams();
  const { loading } = useSelector((state) => state.auth);

  if (loading) return (
    <div className="flex justify-center items-center py-12">
      <div className="animate-spin rounded-full h-12 w-12 border-2 border-blue-600 border-t-transparent"></div>
    </div>
  );

  return (
    <div className="space-y-8">
      <ProfileCard username={username} />
      <UserPosts username={username} />
    </div>
  );
};

export default Profile;