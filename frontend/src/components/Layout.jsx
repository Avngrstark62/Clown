import { NavLink, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logoutUser } from "../redux/authSlice";
import { useState } from "react";
import { FaSun, FaMoon } from "react-icons/fa";
import { useTheme } from "../context/ThemeContext";

const Layout = ({ children }) => {
  const { user } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [isOpen, setIsOpen] = useState(false);
  const { isDarkMode, toggleTheme } = useTheme();

  const handleLogout = () => {
...
      navigate("/login");
    });
  };

  return (
    <div className="flex min-h-screen flex-col md:flex-row bg-white dark:bg-gray-950 text-gray-900 dark:text-gray-100 transition-colors duration-300">
      {/* Theme Toggle Button (Fixed top-right) */}
      <button
        onClick={toggleTheme}
        className="fixed top-4 right-4 p-3 bg-gray-200 dark:bg-gray-800 text-gray-800 dark:text-gray-200 rounded-full shadow-lg z-50 hover:scale-110 transition-transform"
        aria-label="Toggle Theme"
      >
        {isDarkMode ? <FaSun size={20} /> : <FaMoon size={20} />}
      </button>

      {/* Mobile Menu Button (☰) */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed md:hidden bg-gray-900 dark:bg-gray-800 text-white p-3 m-2 rounded-md z-40"
      >
        ☰ Menu
      </button>

      {/* Sidebar Navigation */}
      <nav
        className={`fixed top-0 left-0 h-screen w-64 bg-gray-900 dark:bg-black text-white p-4 transform ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } transition-transform md:translate-x-0 md:fixed z-30`} 
      >
        {/* Close (✖) Button */}
        <button
          onClick={() => setIsOpen(false)}
          className="md:hidden absolute top-4 right-4 bg-red-600 text-white p-2 rounded-full"
        >
          ✖
        </button>

        <ul className="space-y-4 mt-8">
          <li>
            <NavLink
              to="/"
              className="block px-4 py-2 rounded-lg hover:bg-gray-700 transition"
              onClick={() => setIsOpen(false)}
            >
              Home
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/search"
              className="block px-4 py-2 rounded-lg hover:bg-gray-700 transition"
              onClick={() => setIsOpen(false)}
            >
              Search
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/chat"
              className="block px-4 py-2 rounded-lg hover:bg-gray-700 transition"
              onClick={() => setIsOpen(false)}
            >
              Chat
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/create/post"
              className="block px-4 py-2 rounded-lg hover:bg-gray-700 transition"
              onClick={() => setIsOpen(false)}
            >
              Create
            </NavLink>
          </li>
          <li>
            <NavLink
              to={`/profile/${user}`}
              className="block px-4 py-2 rounded-lg hover:bg-gray-700 transition"
              onClick={() => setIsOpen(false)}
            >
              Profile
            </NavLink>
          </li>
        </ul>

        {/* Logout Button */}
        <button
          onClick={handleLogout}
          className="mt-6 w-full bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition"
        >
          Logout
        </button>
      </nav>

      {/* Main Content Area */}
      <main className="ml-0 md:ml-64 flex-1 px-6 mt-16 md:mt-4 bg-transparent">{children}</main>

      {/* Extra Div (Visible only on large screens) */}
      <div className="hidden lg:block w-1/4 p-4 bg-gray-100 dark:bg-gray-900 border-l border-gray-200 dark:border-gray-800">
        <h2 className="font-bold mb-4">Extra Content</h2>
        <p className="text-sm text-gray-600 dark:text-gray-400">Add widgets or recommendations here.</p>
      </div>
    </div>
  );
};

export default Layout;