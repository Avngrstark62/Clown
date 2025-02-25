import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Layout from './components/Layout';
import Register from './components/Register';
import Login from './components/Login';
import Profile from './components/Profile';
import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';

function App() {
  const { user } = useSelector((state) => state.auth);

  return (
      <BrowserRouter>
        {user ? (
          <Routes>
            <Route path="/" element={<Layout>Home</Layout>} />
            <Route path="/feed" element={<Layout>Feed</Layout>} />
            <Route path="/messages" element={<Layout>Messages</Layout>} />
            <Route path="/profile" element={<Layout><Profile /></Layout>} />
            <Route path="*" element={<Navigate to="/profile" />} />
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