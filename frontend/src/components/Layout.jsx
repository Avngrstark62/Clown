import { NavLink } from "react-router-dom";
import '../styles/layout.css';

const Layout = ({ children }) => {
  return (
    <div className="layout-container">
      <nav className="navbar">
        <ul>
          <li><NavLink to="/">Home</NavLink></li>
          <li><NavLink to="/feed">Feed</NavLink></li>
          <li><NavLink to="/messages">Messages</NavLink></li>
          <li><NavLink to="/find-user">Find User</NavLink></li>
          <li><NavLink to="/profile">Profile</NavLink></li>
        </ul>
      </nav>
      <main className="content">{children}</main>
    </div>
  );
}

export default Layout;