import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { loginUser, fetchProfile } from '../redux/authSlice.js';
import { useNavigate } from 'react-router-dom';
import '../styles/Auth.css';

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error } = useSelector((state) => state.auth);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(loginUser(formData)).then((result) => {
      if (result.meta.requestStatus === 'fulfilled') {
        dispatch(fetchProfile());
        // navigate('/');
      }
    });
  };

  const gotoRegister = () => {
    navigate('/register');
  }

  return (
    <div className="auth-container">
      <form className="auth-form" onSubmit={handleSubmit}>
        <h2>Login</h2>
        <input name="email" placeholder="Email" onChange={handleChange} required/>
        <input name="password" type="password" placeholder="Password" onChange={handleChange} required/>
        <button type="submit" disabled={loading}>Login</button>
        {error && <p className="error-message">{error}</p>}
      </form>
      <div>
      <span>Dont have an account?</span>
      <button onClick={gotoRegister}>Register</button>
      </div>
    </div>
  );
};

export default Login;