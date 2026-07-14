import "./RecentActivity.css";
import {
  FiUserPlus,
  FiFolder,
  FiCheckCircle,
  FiMessageCircle,
} from "react-icons/fi";

const activities = [
  {
    icon: <FiUserPlus />,
    title: "New employee joined",
    time: "2 minutes ago",
    color: "#7c3aed",
  },
  {
    icon: <FiFolder />,
    title: "Project Alpha updated",
    time: "1 hour ago",
    color: "#3b82f6",
  },
  {
    icon: <FiCheckCircle />,
    title: "Task completed",
    time: "3 hours ago",
    color: "#14d8b4",
  },
  {
    icon: <FiMessageCircle />,
    title: "New client message",
    time: "5 hours ago",
    color: "#f59e0b",
  },
];

export default function RecentActivity() {
  return (
    <div className="recent-card">
      <div className="recent-header">
        <h3>Recent Activity</h3>
        <button>View All</button>
      </div>

      <div className="recent-list">
        {activities.map((item, index) => (
          <div className="activity-item" key={index}>
            <div
              className="activity-icon"
              style={{ background: item.color }}
            >
              {item.icon}
            </div>

            <div className="activity-info">
              <h4>{item.title}</h4>
              <p>{item.time}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}