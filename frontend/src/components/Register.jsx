import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { registerUser } from '../redux/authSlice';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

const Register = () => {
  const [formData, setFormData] = useState({ username: '', email: '', password: '' });
  const [validationErrors, setValidationErrors] = useState({ username: '', password: '' });
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { error } = useSelector((state) => state.auth);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    // Validate username and password as the user types
    if (name === 'username') {
      if (!/^[A-Za-z0-9_]+$/.test(value)) {
        setValidationErrors((prev) => ({
          ...prev,
          username: 'Username can only contain letters, numbers, and underscores.',
        }));
      } else {
        setValidationErrors((prev) => ({ ...prev, username: '' }));
      }
    }

    if (name === 'password') {
      if (value.length < 8) {
        setValidationErrors((prev) => ({
          ...prev,
          password: 'Password must be at least 8 characters long.',
        }));
      } else {
        setValidationErrors((prev) => ({ ...prev, password: '' }));
      }
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Check for validation errors before submitting
    if (validationErrors.username || validationErrors.password) {
      return;
    }

    dispatch(registerUser(formData)).then((result) => {
      if (result.meta.requestStatus === 'fulfilled') {
        navigate('/login');
      }
    });
  };

  const gotologin = () => {
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-lg shadow-lg">
        <div>
          <h2 className="text-center text-3xl font-bold text-gray-900">Register</h2>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm space-y-4">
            {/* Username Field */}
            <div>
              <label htmlFor="username" className="sr-only">Username</label>
              <input
                id="username"
                name="username"
                type="text"
                placeholder="Username"
                value={formData.username}
                onChange={handleChange}
                required
                className="appearance-none rounded-lg relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              />
              {validationErrors.username && (
                <p className="text-sm text-red-500 mt-1">{validationErrors.username}</p>
              )}
              <p className="text-sm text-gray-500 mt-1">
                Username can only contain letters, numbers, and underscores.
              </p>
            </div>

            {/* Email Field */}
            <div>
              <label htmlFor="email" className="sr-only">Email</label>
              <input
                id="email"
                name="email"
                type="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleChange}
                required
                className="appearance-none rounded-lg relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              />
            </div>

            {/* Password Field */}
            <div>
              <label htmlFor="password" className="sr-only">Password</label>
              <input
                id="password"
                name="password"
                type="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
                required
                className="appearance-none rounded-lg relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              />
              {validationErrors.password && (
                <p className="text-sm text-red-500 mt-1">{validationErrors.password}</p>
              )}
              <p className="text-sm text-gray-500 mt-1">
                Password must be at least 8 characters long.
              </p>
            </div>
          </div>

          {error && (
            <p className="text-sm text-red-500 text-center">{error}</p>
          )}

          <div>
            <button
              type="submit"
              disabled={!!validationErrors.username || !!validationErrors.password}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-blue-500 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              Register
            </button>
          </div>
        </form>

        <div className="text-center">
          <span className="text-sm text-gray-600">Already have an account?</span>
          <button
            onClick={gotologin}
            className="ml-2 text-sm font-medium text-blue-500 hover:text-blue-600"
          >
            Login
          </button>
        </div>
      </div>
    </div>
  );
};

export default Register;