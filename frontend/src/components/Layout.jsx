import { NavLink, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { useState } from "react";
import '../styles/layout.css';

const Dropdown = ({ link }) => {
  const navigate = useNavigate();
  if (link=='create'){
    return (
      <div className="dropdown">
          <div className="dropdown-item" onClick={() => {navigate('/create/post')}}>
            Post
          </div>
          <div className="dropdown-item" onClick={() => {navigate('/create/story')}}>
            Story
          </div>
      </div>
    );
  }
  else{
    return null
  }
};

const Layout = ({ children }) => {
  const { user } = useSelector((state) => state.auth);
  const [hoveredLink, setHoveredLink] = useState(null);

  const handleClickOnCreate = () => {
    if (hoveredLink){
      setHoveredLink(null);
    }
    else{
      setHoveredLink('create');
    }
  }

  return (
    <div className="layout-container">
      <nav className="layout-nav">
        <ul className="layout-nav-list">
            <li><NavLink onClick={() => {if (hoveredLink){setHoveredLink(null)}}} to='/' className="nav-link">Home</NavLink></li>
            <li><NavLink onClick={() => {if (hoveredLink){setHoveredLink(null)}}} to='/explore' className="nav-link">Explore</NavLink></li>
            <li><NavLink onClick={() => {if (hoveredLink){setHoveredLink(null)}}} to='/search' className="nav-link">Search</NavLink></li>
            <li><NavLink onClick={() => {if (hoveredLink){setHoveredLink(null)}}} to='/notifications' className="nav-link">Notifications</NavLink></li>
            <li onClick={handleClickOnCreate}><NavLink className="nav-link">Create</NavLink></li>
            <li><NavLink onClick={() => {if (hoveredLink){setHoveredLink(null)}}} to={`/profile/${user}`} className="nav-link">Profile</NavLink></li>
        </ul>
        {hoveredLink && (
          <Dropdown link={hoveredLink}/>
        )}
      </nav>
      <main className="layout-main" onClick={() => {if (hoveredLink){setHoveredLink(null)}}}>{children}</main>
    </div>
  );
}

export default Layout;