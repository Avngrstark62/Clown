import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import '../styles/connections.css';
import { getFollowersList, getFollowingList } from '../api/api';
import { useNavigate } from 'react-router-dom';

const Connections = () => {
    const { username, type } = useParams();
    const [activeTab, setActiveTab] = useState(type === 'following' ? 'following' : 'followers');
    const [users, setUsers] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchFollowers = async () => {
            try {
                const response = await getFollowersList(username);
                setUsers(response.data.followers);
            }
            catch (error) {
                console.error(error);
            }
        };
    
        const fetchFollowing = async () => {
            try {
                const response = await getFollowingList(username);
                setUsers(response.data.following);
            }
            catch (error) {
                console.error(error);
            }
        };

        if (activeTab === 'followers') fetchFollowers();
        else fetchFollowing();
    }, [activeTab, username]);

    const handleUserClick = (e) => {
        const username = e.currentTarget.querySelector('h3').textContent;
        navigate(`/profile/${username}`);
    };

    return (
        <div className="connections-container">
            <div className="tab-header">
                <h2 
                    className={activeTab === 'followers' ? 'active' : ''} 
                    onClick={() => setActiveTab('followers')}
                >
                    Followers
                </h2>
                <h2 
                    className={activeTab === 'following' ? 'active' : ''} 
                    onClick={() => setActiveTab('following')}
                >
                    Following
                </h2>
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

export default Connections;