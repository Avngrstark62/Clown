import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProfile, logoutUser } from '../redux/authSlice';
import { useNavigate } from 'react-router-dom';

function Profile() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, loading } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(fetchProfile());
  }, [dispatch]);

  const handleLogout = () => {
    dispatch(logoutUser()).then(() => {
      navigate('/login');
    });
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div>
      <h1>Welcome, {user || 'Guest'}!</h1>
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
}

export default Profile;