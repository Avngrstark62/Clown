import { NavLink, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logoutUser } from "../redux/authSlice";
import { useState, useEffect } from "react";
import ThemeToggle from "./ThemeToggle";

const Layout = ({ children }) => {
  const { user } = useSelector((state) => state.auth);
  const currentTheme = useSelector((state) => state.theme.currentTheme);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (currentTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [currentTheme]);

  const handleLogout = () => {
    dispatch(logoutUser()).then(() => {
      navigate("/login");
    });
  };

  return (
    <div className="flex min-h-screen flex-col md:flex-row bg-white dark:bg-gray-900 text-black dark:text-white">
      {/* Top Bar with Menu Button and Theme Toggle */}
      <div className="fixed top-0 left-0 right-0 md:hidden bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 p-3 z-50 flex justify-between items-center">
        <button
          onClick={() => setIsOpen(true)}
          className="bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white p-2 rounded-md"
        >
          ☰ Menu
        </button>
        <ThemeToggle />
      </div>

      {/* Sidebar Navigation */}
      <nav
        className={`fixed top-0 left-0 h-screen w-64 bg-gray-900 dark:bg-gray-950 text-white p-4 transform ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } transition-transform md:translate-x-0 md:fixed md:top-0 md:mt-0`}
      >
        {/* Close (✖) Button */}
        <button
          onClick={() => setIsOpen(false)}
          className="md:hidden absolute top-4 right-4 bg-red-600 dark:bg-red-700 text-white p-2 rounded-full hover:bg-red-700 dark:hover:bg-red-600 transition"
        >
          ✖
        </button>

        <ul className="space-y-4 mt-8">
          <li>
            <NavLink
              to="/"
              className="block px-4 py-2 rounded-lg hover:bg-gray-700 dark:hover:bg-gray-800 transition"
              onClick={() => setIsOpen(false)}
            >
              Home
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/search"
              className="block px-4 py-2 rounded-lg hover:bg-gray-700 dark:hover:bg-gray-800 transition"
              onClick={() => setIsOpen(false)}
            >
              Search
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/chat"
              className="block px-4 py-2 rounded-lg hover:bg-gray-700 dark:hover:bg-gray-800 transition"
              onClick={() => setIsOpen(false)}
            >
              Chat
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/create/post"
              className="block px-4 py-2 rounded-lg hover:bg-gray-700 dark:hover:bg-gray-800 transition"
              onClick={() => setIsOpen(false)}
            >
              Create
            </NavLink>
          </li>
          <li>
            <NavLink
              to={`/profile/${user}`}
              className="block px-4 py-2 rounded-lg hover:bg-gray-700 dark:hover:bg-gray-800 transition"
              onClick={() => setIsOpen(false)}
            >
              Profile
            </NavLink>
          </li>
        </ul>

        {/* Logout Button */}
        <button
          onClick={handleLogout}
          className="mt-6 w-full bg-red-600 dark:bg-red-700 text-white px-4 py-2 rounded-lg hover:bg-red-700 dark:hover:bg-red-600 transition"
        >
          Logout
        </button>
      </nav>

      {/* Main Content Area with header for desktop theme toggle */}
      <main className="ml-0 md:ml-64 flex-1 px-6 mt-16 md:mt-0">
        {/* Desktop header with theme toggle (visible only on md and above) */}
        <div className="hidden md:flex justify-end items-center p-4 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 fixed top-0 right-0 left-64 z-40">
          <ThemeToggle />
        </div>
        
        {/* Content with top padding for desktop header */}
        <div className="pt-16 md:pt-0">
          {children}
        </div>
      </main>

      {/* Right Sidebar (Visible only on large screens) */}
      <div className="hidden lg:block w-1/4 p-4 bg-gray-100 dark:bg-gray-800 border-l border-gray-200 dark:border-gray-700">
        Extra Content
      </div>
    </div>
  );
};

export default Layout;