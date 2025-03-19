import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { getFollowingList } from '../api/api';
import { useNavigate } from 'react-router-dom';
import '../styles/chat-page.css';

const ChatPage = () => {
  const [followingUsers, setFollowingUsers] = useState([]);
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    const fetchFollowingUsers = async () => {
      try {
        if (user){
            const response = await getFollowingList(user);
            setFollowingUsers(response.data.following);
        }
      } catch (error) {
        console.error('Error fetching following users:', error);
      }
    };

    fetchFollowingUsers();
  }, [user]);

  const navigate = useNavigate();

  const handleUserClick = (user) => {
    navigate('/chat/' + user._id.toString());
  };

  return (
    <div className="chat-inbox-container">
      <h2 className="chat-inbox-header">Messages</h2>
      <div className="chat-user-list">
        {followingUsers.length > 0 ? (
          followingUsers.map((user) => (
            <div
              key={user._id}
              className="chat-user-card"
              onClick={() => handleUserClick(user)}
            >
              <div className="chat-user-info">
                <h3 className="chat-username">{user.username}</h3>
                <p className="chat-user-fullname">{user.name}</p>
              </div>
            </div>
          ))
        ) : (
          <p className="chat-no-results">No users found</p>
        )}
      </div>
    </div>
  );
};

export default ChatPage;