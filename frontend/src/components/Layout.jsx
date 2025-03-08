import { NavLink, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logoutUser } from '../redux/authSlice';
import '../styles/layout.css';

const Layout = ({ children }) => {
  const { user } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleLogout = () => {
      dispatch(logoutUser()).then(() => {
        navigate('/login');
      });
    };

  return (
    <div className="layout-container">
      <nav className="layout-nav">
        <ul className="layout-nav-list">
            <li><NavLink to='/' className="nav-link">Home</NavLink></li>
            <li><NavLink to='/explore' className="nav-link">Explore</NavLink></li>
            <li><NavLink to='/search' className="nav-link">Search</NavLink></li>
            <li><NavLink to='/notifications' className="nav-link">Notifications</NavLink></li>
            <li><NavLink to={'/create/post'} className="nav-link">Create</NavLink></li>
            <li><NavLink to={`/profile/${user}`} className="nav-link">Profile</NavLink></li>
        </ul>
        <button onClick={handleLogout} className="logout-btn">Logout</button>
      </nav>
      <main className="layout-main">{children}</main>
      <div className="layout-extra"></div>
    </div>
  );
}

export default Layout;