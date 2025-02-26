import { useState } from 'react';
import '../styles/find-user.css';
import { searchUsers } from '../api/api';
// import { searchUsers } from '../api/api';

const FindUser = () => {
  const [query, setQuery] = useState('');
  const [users, setUsers] = useState([]);

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
            <div key={user.id} className="user-card">
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