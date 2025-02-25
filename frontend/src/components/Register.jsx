import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { registerUser } from '../redux/authSlice';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import '../styles/Auth.css';

const Register = () => {
  const [formData, setFormData] = useState({ username: '', email: '', password: '' });
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { error } = useSelector((state) => state.auth);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(registerUser(formData)).then((result) => {
          if (result.meta.requestStatus === 'fulfilled') {
            navigate('/login');
          }
        });
  };

  const gotologin = () => {
    navigate('/login');
  }

  return (
    <div className="auth-container">
      <form className="auth-form" onSubmit={handleSubmit}>
        <h2>Register</h2>
        <input name="username" placeholder="Username" onChange={handleChange} required/>
        <input name="email" placeholder="Email" onChange={handleChange} required/>
        <input name="password" type="password" placeholder="Password" onChange={handleChange} required/>
        <button type="submit">Register</button>
        {error && <p className="error-message">{error}</p>}
      </form>
      <div>
      <span>Already have an account?</span>
      <button onClick={gotologin}>login</button>
      </div>
    </div>
  );
};

export default Register;