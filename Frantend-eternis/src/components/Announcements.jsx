import "./Announcements.css";
import {
  FiBell,
  FiAlertCircle,
  FiInfo,
} from "react-icons/fi";

const announcements = [
  {
    icon: <FiBell />,
    title: "New company policy update",
    time: "2 hours ago",
    color: "#7c3aed",
  },
  {
    icon: <FiAlertCircle />,
    title: "System maintenance tonight",
    time: "5 hours ago",
    color: "#f59e0b",
  },
  {
    icon: <FiInfo />,
    title: "Quarterly meeting scheduled",
    time: "1 day ago",
    color: "#3b82f6",
  },
];

export default function Announcements() {
  return (
    <div className="announcements-card">
      <div className="announcements-header">
        <h3>Announcements</h3>
        <button>View All</button>
      </div>

      <div className="announcements-list">
        {announcements.map((item, index) => (
          <div
            className="announcement-item"
            key={index}
          >
            <div
              className="announcement-icon"
              style={{
                background: item.color,
              }}
            >
              {item.icon}
            </div>

            <div className="announcement-info">
              <h4>{item.title}</h4>
              <p>{item.time}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}