import { useState } from 'react';
import '../styles/find-user.css';
import { searchUsers } from '../api/api';
import { useNavigate } from 'react-router-dom';

const FindUser = () => {
  const [query, setQuery] = useState('');
  const [users, setUsers] = useState([]);

  const navigate = useNavigate();

  const handleSearch = async () => {
    if (query.trim()) {
      try {
        const formData = { query };
        const response = await searchUsers(formData);
        setUsers(response.data.users.slice(0, 5));
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    }
  };

  const handleUserClick = (e) => {
    const username = e.currentTarget.querySelector('h3').textContent;
    navigate(`/profile/${username}`);
  }

  return (
    <div className="find-user-container">
      <div className="search-bar">
        <input
          type="text"
          placeholder="Search using name or username"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <button onClick={handleSearch}>Search</button>
      </div>

      <div className="user-list">
        {users.length > 0 ? (
          users.map((user) => (
            <div key={user._id} className="user-card" onClick={handleUserClick}>
              <h3>{user.username}</h3>
              <p>{user.name}</p>
            </div>
          ))
        ) : (
          <p className="no-results">No users found</p>
        )}
      </div>
    </div>
  );
};

export default FindUser;