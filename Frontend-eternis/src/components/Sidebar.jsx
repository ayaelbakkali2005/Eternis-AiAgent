import "./Sidebar.css";
import logo from "../assets/eternis-logo.png";
import { Link } from "react-router-dom";

import {
  FiHome,
  FiUsers,
  FiFolder,
  FiCheckSquare,
  FiMessageSquare,
  FiPhone,
  FiBarChart2,
  FiCalendar,
  FiBell,
  FiSettings,
} from "react-icons/fi";

const menu = [
  { icon: <FiHome />, title: "Dashboard", path: "/" },
  { icon: <FiUsers />, title: "Employees", path: "/employees" },
  { icon: <FiFolder />, title: "Projects", path: "/projects" },
  { icon: <FiCheckSquare />, title: "Tasks", path: "/tasks" },
  { icon: <FiMessageSquare />, title: "AI Assistant", path: "/assistant" },
  { icon: <FiPhone />, title: "AI Communication", path: "/communication" },
  { icon: <FiBarChart2 />, title: "Reports", path: "/reports" },
  { icon: <FiCalendar />, title: "Calendar", path: "/calendar" },
  {
    icon: <FiBell />,
    title: "Notifications",
    path: "/notifications",
    badge: 5,
  },
  { icon: <FiSettings />, title: "Settings", path: "/settings" },
];

function Sidebar() {
  return (
    <aside className="sidebar">
      <div className="logo">
        <img
          src={logo}
          alt="Eternis"
          className="logo-img"
        />

        <div>
          <h2>Eternis</h2>
          <p>Smart Business Solutions</p>
        </div>
      </div>

      <p className="menu-title">MAIN MENU</p>

      <nav className="menu">
        {menu.map((item, index) => (
          <Link
            to={item.path}
            key={index}
            className="menu-item"
          >
            {item.icon}
            <span>{item.title}</span>

            {item.badge && (
              <div className="badge">
                {item.badge}
              </div>
            )}
          </Link>
        ))}
      </nav>

      <div className="profile-card">
        <img
          src="https://i.pravatar.cc/150?img=32"
          alt=""
        />

        <div>
          <h4>Youssef E.</h4>
          <p>Administrator</p>
        </div>
      </div>
    </aside>
  );
}

export default Sidebar;