import "./Topbar.css";
import {
  FiMenu,
  FiSearch,
  FiBell,
  FiMail,
  FiCalendar,
  FiPlus,
  FiChevronDown,
} from "react-icons/fi";
import { useNavigate } from "react-router-dom";

import profile from "../assets/profile.jpg";

function Topbar() {
  const navigate = useNavigate();

  return (
    <div className="topbar">
      <div className="topbar-header">
        <button className="menu-btn">
          <FiMenu />
        </button>

        <div className="top-actions">
          <div className="search-box">
            <input
              placeholder="Search anything..."
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  alert(`Searching for: ${e.target.value}`);
                }
              }}
            />
            <FiSearch />
          </div>

          <button
            className="icon-btn"
            onClick={() => navigate("/notifications")}
            style={{ cursor: "pointer" }}
          >
            <FiBell />
            <span>5</span>
          </button>

          <button
            className="icon-btn"
            onClick={() =>
              alert("Messages page coming soon!")
            }
            style={{ cursor: "pointer" }}
          >
            <FiMail />
            <span>3</span>
          </button>

          <div
            className="profile-box"
            onClick={() => navigate("/settings")}
            style={{ cursor: "pointer" }}
          >
            <img src={profile} alt="Profile" />
            <div className="online"></div>
            <FiChevronDown />
          </div>
        </div>
      </div>

      <div className="dashboard-row">
        <div>
          <h1>Dashboard</h1>

          <p>
            Welcome back, <span>Youssef!</span> 👋
          </p>

          <small>
            Here's what's happening with your business today.
          </small>
        </div>

        <div className="right-buttons">
          <button
            className="date-btn"
            onClick={() => navigate("/calendar")}
            style={{ cursor: "pointer" }}
          >
            <FiCalendar />
            May 21 - May 27, 2025
          </button>

          <button
            className="new-btn"
            onClick={() => navigate("/projects")}
            style={{ cursor: "pointer" }}
          >
            <FiPlus />
            New
          </button>
        </div>
      </div>
    </div>
  );
}

export default Topbar;