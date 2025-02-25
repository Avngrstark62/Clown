import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Register from './components/Register';
import Login from './components/Login';
import Profile from './components/Profile';
import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';

function App() {
  const { user } = useSelector((state) => state.auth);
  console.log(user);

  return (
      <BrowserRouter>
        {user ? (
          <Routes>
            <Route path="/profile" element={<Profile />} />
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