import { useDispatch, useSelector } from 'react-redux';
import { MdLightMode, MdDarkMode } from 'react-icons/md';
import { toggleTheme } from '../redux/themeSlice';

const ThemeToggle = () => {
  const dispatch = useDispatch();
  const currentTheme = useSelector((state) => state.theme.currentTheme);

  const handleToggle = () => {
    dispatch(toggleTheme());
  };

  return (
    <button
      onClick={handleToggle}
      className="p-2 rounded-lg bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-yellow-300 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
      aria-label="Toggle theme"
      title={currentTheme === 'light' ? 'Switch to dark mode' : 'Switch to light mode'}
    >
      {currentTheme === 'light' ? (
        <MdDarkMode size={20} />
      ) : (
        <MdLightMode size={20} />
      )}
    </button>
  );
};

export default ThemeToggle;
