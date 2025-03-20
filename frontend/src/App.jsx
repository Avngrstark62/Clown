import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Layout from './components/Layout';
import Register from './components/Register';
import Login from './components/Login';
import EditProfile from './components/EditProfile';
import FindUser from './components/FindUser';
import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';
import Profile from './components/Profile';
import Connections from './components/Connections';
import CreatePost from './components/CreatePost';
import Post from './components/Post';
import { useEffect } from 'react';
import { disconnectSocket, initializeSocket } from './api/socket';
import ChatComponent from './components/ChatComponent';
import ChatPage from './components/ChatPage';
import Home from './components/Home';

function App() {
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    if (user) {
      // Initialize the socket if the user is logged in
      initializeSocket();
    }
    return () => {
      disconnectSocket(); // Disconnect the socket when the app unmounts (optional)
    };
  }, [user]);

  return (
      <BrowserRouter>
        {user ? (
          <Routes>
            {/* <Route path="/" element={<Layout><Home/></Layout>} /> */}
            <Route path="/" element={<Layout><Home/></Layout>} />
            {/* <Route path="/explore" element={<Layout>Explore</Layout>} /> */}
            {/* <Route path="/live" element={<Layout>Live</Layout>} /> */}
            <Route path="/chat" element={<Layout><ChatPage/></Layout>} />
            <Route path="/chat/:recipientId" element={<Layout><ChatComponent/></Layout>} />
            {/* <Route path="/random-chat" element={<Layout>Random Chat</Layout>} /> */}
            <Route path="/search" element={<Layout><FindUser/></Layout>} />
            <Route path="/profile/:username" element={<Layout><Profile/></Layout>} />
            <Route path="/edit-profile" element={<Layout><EditProfile/></Layout>} />
            <Route path="/profile/:username/connections/:type" element={<Layout><Connections/></Layout>} />
            {/* <Route path="/create" element={<Layout>Create</Layout>} /> */}
            <Route path="/create/post" element={<Layout><CreatePost/></Layout>} />
            <Route path="/create/story" element={<Layout>Create a Story</Layout>} />
            <Route path="/post/:postId" element={<Layout><Post/></Layout>} />
            {/* <Route path="/create/live-stream" element={<Layout> Start a Live Stream</Layout>} /> */}
            {/* <Route path="/create/poll" element={<Layout>Create a Poll</Layout>} /> */}
            {/* <Route path="/create/discussion" element={<Layout>Create a Discussion</Layout>} /> */}
	    {/*<Route path="/notifications" element={<Layout>Notifications</Layout>} />*/ }
	    <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        ):(
          <Routes>
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />
            <Route path="*" element={<Navigate to="/login" />} />
          </Routes>
        )}
      </BrowserRouter>
  );
}

export default App;