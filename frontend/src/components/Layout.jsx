import { NavLink, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { useState } from "react";
import '../styles/layout.css';

const Dropdown = ({ link, content }) => {
  const navigate = useNavigate();
  return (
    <div className="dropdown">
      {content.map((item, index) => (
        <div key={index} className="dropdown-item" onClick={() => {navigate(`/${link.toLowerCase()}/${item.toLowerCase().replace(' ', '-')}`)}}>
          {item}
        </div>
      ))}
    </div>
  );
};

const Layout = ({ children }) => {
  const { user } = useSelector((state) => state.auth);
  const [hoveredLink, setHoveredLink] = useState(null);

  const handleMouseEnter = (link) => {
    setHoveredLink(link);
  };

  const handleMouseLeave = () => {
    setHoveredLink(null);
  };

  const dropdownContent = {
    Home: ["Overview", "Updates", "Stats"],
    Search: ["Users", "Posts", "Tags"],
    Explore: ["Trending", "Categories", "Collections"],
    Live: ["Streams", "Events", "Highlights"],
    "Random Chat": ["Start Chat", "Chat Rooms", "History"],
    Notifications: ["Mentions", "Reactions", "Messages"],
    Create: ["Post", "Live Stream", "Discussion", "Poll"],
    Messages: ["Inbox", "Sent", "Archived"],
    Profile: ["Settings", "Activity", "Log out"]
  };

  return (
    <div className="layout-container">
      <nav className="layout-nav" onMouseLeave={handleMouseLeave}>
        <ul className="layout-nav-list">
          {Object.keys(dropdownContent).map((link) => (
            <li
              key={link}
              onMouseEnter={() => handleMouseEnter(link)}
            >
              <NavLink to={link === "Profile" ? `/profile/${user}` : `/${link.toLowerCase().replace(' ', '-')}`}
                       className="nav-link">
                {link}
              </NavLink>
            </li>
          ))}
        </ul>
        {hoveredLink && (
          <Dropdown link={hoveredLink} content={dropdownContent[hoveredLink]}/>
        )}
      </nav>
      <main className="layout-main">{children}</main>
    </div>
  );
}

export default Layout;