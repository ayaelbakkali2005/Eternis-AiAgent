import "./StatsCards.css";
import {
  FiUsers,
  FiUser,
  FiBriefcase,
  FiCheckCircle,
  FiCpu,
  FiDollarSign,
} from "react-icons/fi";

const cards = [
  {
    title: "Total Employees",
    value: "48",
    percent: "12.5%",
    subtitle: "vs last month",
    icon: <FiUsers />,
    color: "#7C3AED",
  },
  {
    title: "Total Clients",
    value: "125",
    percent: "8.2%",
    subtitle: "vs last month",
    icon: <FiUser />,
    color: "#2563EB",
  },
  {
    title: "Active Projects",
    value: "12",
    percent: "5.4%",
    subtitle: "vs last month",
    icon: <FiBriefcase />,
    color: "#7C3AED",
  },
  {
    title: "Tasks Completed",
    value: "89",
    percent: "15.3%",
    subtitle: "vs last week",
    icon: <FiCheckCircle />,
    color: "#06B6D4",
  },
  {
    title: "AI Interactions",
    value: "256",
    percent: "22.1%",
    subtitle: "vs last week",
    icon: <FiCpu />,
    color: "#7C3AED",
  },
  {
    title: "Revenue This Month",
    value: "$24,560",
    percent: "18.6%",
    subtitle: "vs last month",
    icon: <FiDollarSign />,
    color: "#7C3AED",
  },
];

function StatsCards() {
  return (
    <div className="stats-grid">
      {cards.map((card, index) => (
        <div className="stats-card" key={index}>
          <div className="card-top">
            <div
              className="icon-box"
              style={{ background: card.color }}
            >
              {card.icon}
            </div>

            <div className="card-title">
              {card.title}
            </div>
          </div>

          <h2>{card.value}</h2>

          <div className="card-bottom">
            <span className="percent">
              ↑ {card.percent}
            </span>

            <span className="subtitle">
              {card.subtitle}
            </span>
          </div>

          <div className="sparkline"></div>
        </div>
      ))}
    </div>
  );
}

export default StatsCards;