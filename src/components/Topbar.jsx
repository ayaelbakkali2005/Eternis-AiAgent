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

import profile from "../assets/profile.jpg";

function Topbar() {
  return (
    <div className="topbar">

      <div className="topbar-header">
        <button className="menu-btn">
          <FiMenu />
        </button>

        <div className="top-actions">
          <div className="search-box">
            <input placeholder="Search anything..." />
            <FiSearch />
          </div>

          <div className="icon-btn">
            <FiBell />
            <span>5</span>
          </div>

          <div className="icon-btn">
            <FiMail />
            <span>3</span>
          </div>

          <div className="profile-box">
            <img src={profile} alt="" />
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
          <button className="date-btn">
            <FiCalendar />
            May 21 - May 27, 2025
          </button>

          <button className="new-btn">
            <FiPlus />
            New
          </button>
        </div>
      </div>
    </div>
  );
}

export default Topbar;