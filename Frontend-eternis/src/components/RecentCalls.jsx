import {
  FaEllipsisV,
  FaUserCheck,
  FaBriefcase,
  FaRobot
} from "react-icons/fa";

export default function RecentCalls() {
  return (
    <div className="recent-card">

      <div className="recent-top">

        <h2>Recent Activity</h2>

        <div className="recent-dots">
          <span></span>
          <span></span>
          <span></span>
          <FaEllipsisV />
        </div>

      </div>

      <div className="recent-row">

        <div className="recent-avatar avatar-1">
          <FaUserCheck />
        </div>

        <div className="recent-info">
          <h3>Employee Added</h3>
          <p>Sarah Johnson joined HR Team</p>
        </div>

        <div className="recent-menu">
          2m
        </div>

      </div>

      <div className="recent-row">

        <div className="recent-avatar avatar-2">
          <FaBriefcase />
        </div>

        <div className="recent-info">
          <h3>Project Updated</h3>
          <p>Alpha Project reached 75%</p>
        </div>

        <div className="recent-menu">
          15m
        </div>

      </div>

      <div className="recent-row">

        <div className="recent-avatar avatar-3">
          <FaRobot />
        </div>

        <div className="recent-info">
          <h3>AI Generated Report</h3>
          <p>Monthly performance summary</p>
        </div>

        <div className="recent-menu">
          1h
        </div>

      </div>

    </div>
  );
}