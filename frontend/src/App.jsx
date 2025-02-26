import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Layout from './components/Layout';
import Register from './components/Register';
import Login from './components/Login';
import EditProfile from './components/EditProfile';
import FindUser from './components/FindUser';
import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';
import Profile from './components/Profile';

function App() {
  const { user } = useSelector((state) => state.auth);

  return (
      <BrowserRouter>
        {user ? (
          <Routes>
            <Route path="/" element={<Layout>Home</Layout>} />
            <Route path="/feed" element={<Layout>Feed</Layout>} />
            <Route path="/messages" element={<Layout>Messages</Layout>} />
            <Route path="/find-user" element={<Layout><FindUser/></Layout>} />
            
            <Route path="/profile/:username" element={<Layout><Profile/></Layout>} />
            <Route path="/edit-profile" element={<Layout><EditProfile/></Layout>} />
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