import { useState } from "react";
import "./Projects.css";
import Sidebar from "../components/Sidebar";

const statsData = [
  {
    icon: "💼",
    iconBg: "#7c3aed",
    label: "Total Projects",
    value: 24,
    sub: "↑ 12% this month",
    subColor: "#22c55e",
    sparkColor: "#a855f7",
  },
  {
    icon: "🔄",
    iconBg: "#2563eb",
    label: "In Progress",
    value: 10,
    sub: "41.7% of total",
    subColor: "#22c55e",
    sparkColor: "#3b82f6",
  },
  {
    icon: "✅",
    iconBg: "#16a34a",
    label: "Completed",
    value: 9,
    sub: "37.5% of total",
    subColor: "#22c55e",
    sparkColor: "#22c55e",
  },
  {
    icon: "⏸",
    iconBg: "#d97706",
    label: "On Hold",
    value: 3,
    sub: "12.5% of total",
    subColor: "#f59e0b",
    sparkColor: "#f59e0b",
  },
  {
    icon: "⏱",
    iconBg: "#dc2626",
    label: "Overdue",
    value: 2,
    sub: "8.3% of total",
    subColor: "#ef4444",
    sparkColor: "#ef4444",
  },
];

const projects = [
  {
    id: 1,
    name: "Eternis Website Redesign",
    desc: "Redesign of the corporate website",
    client: "Eternis Corp",
    department: "Design",
    progress: 75,
    status: "In Progress",
    dueDate: "May 25, 2024",
    daysLeft: "5 days left",
  },
  {
    id: 2,
    name: "Mobile App Development",
    desc: "Build the new mobile application",
    client: "TechNova",
    department: "Development",
    progress: 60,
    status: "In Progress",
    dueDate: "Jun 10, 2024",
    daysLeft: "21 days left",
  },
  {
    id: 3,
    name: "E-commerce Platform",
    desc: "Full e-commerce solution",
    client: "ShopMax",
    department: "Development",
    progress: 100,
    status: "Completed",
    dueDate: "Apr 30, 2024",
    daysLeft: "Completed",
  },
];

function Sparkline({ color }) {
  const points =
    "0,20 20,16 40,18 60,10 80,14 100,8 120,12 140,4";

  return (
    <svg
      className="sparkline"
      viewBox="0 0 140 25"
    >
      <polyline
        points={points}
        fill="none"
        stroke={color}
        strokeWidth="2"
      />
    </svg>
  );
}

export default function Projects() {
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] =
    useState(1);

  const filtered = projects.filter(
    (p) =>
      p.name
        .toLowerCase()
        .includes(search.toLowerCase()) ||
      p.client
        .toLowerCase()
        .includes(search.toLowerCase())
  );

  return (
    <div className="dashboard">
      <Sidebar />

      <main className="main-content">
        <div className="projects-page">

          {/* Header */}
          <div className="projects-header">
            <div>
              <h1 className="projects-title">
                Projects
              </h1>

              <p className="projects-subtitle">
                Manage and track all company projects in one place.
              </p>
            </div>

            <div className="projects-header-actions">
              <div className="search-bar-top">
                <span>🔍</span>

                <input
                  type="text"
                  placeholder="Search projects..."
                  className="search-input-top"
                />
              </div>

              <button className="notif-btn">
                🔔
                <span className="notif-badge">
                  3
                </span>
              </button>

              <button className="new-project-btn">
                + New Project
              </button>
            </div>
          </div>

          {/* Cards */}
          <div className="stats-row">
            {statsData.map((s, i) => (
              <div
                className="dashboard-card"
                key={i}
              >
                <div
                  className="dashboard-icon"
                  style={{
                    background: `linear-gradient(135deg, ${s.iconBg}, #3b82f6)`,
                  }}
                >
                  {s.icon}
                </div>

                <p className="dashboard-label">
                  {s.label}
                </p>

                <h2 className="dashboard-value">
                  {s.value}
                </h2>

                <span
                  className="dashboard-sub"
                  style={{
                    color: s.subColor,
                  }}
                >
                  {s.sub}
                </span>

                <div className="dashboard-line">
                  <Sparkline
                    color={s.sparkColor}
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Table */}
          <div className="table-section">

            <div className="filters-row">
              <div className="search-bar">
                <span>🔍</span>

                <input
                  type="text"
                  placeholder="Search by project name or client..."
                  className="search-input"
                  value={search}
                  onChange={(e) =>
                    setSearch(e.target.value)
                  }
                />
              </div>

              <select className="filter-select">
                <option>All Status</option>
                <option>In Progress</option>
                <option>Completed</option>
                <option>On Hold</option>
                <option>Overdue</option>
              </select>

              <select className="filter-select">
                <option>All Departments</option>
                <option>Design</option>
                <option>Development</option>
                <option>Marketing</option>
                <option>IT & Security</option>
              </select>

              <select className="filter-select">
                <option>All Clients</option>
                <option>Eternis Corp</option>
                <option>TechNova</option>
                <option>ShopMax</option>
              </select>

              <button className="filter-btn">
                ⚙ Filter
              </button>

              <button className="export-btn">
                ↓ Export
              </button>
            </div>

            <table className="projects-table">
              <thead>
                <tr>
                  <th>PROJECT</th>
                  <th>CLIENT</th>
                  <th>DEPARTMENT</th>
                  <th>PROGRESS</th>
                  <th>STATUS</th>
                  <th>DUE DATE</th>
                  <th>TEAM</th>
                  <th>ACTIONS</th>
                </tr>
              </thead>

              <tbody>
                {filtered.map((p) => (
                  <tr key={p.id}>
                    <td>
                      <div className="project-cell">
                        <div className="project-icon">
                          💼
                        </div>

                        <div>
                          <h4>{p.name}</h4>
                          <p>{p.desc}</p>
                        </div>
                      </div>
                    </td>

                    <td>
                      <div className="client-cell">
                        <div className="client-logo">
                          ⚡
                        </div>

                        <span>{p.client}</span>
                      </div>
                    </td>

                    <td>
                      <span className="department-badge">
                        {p.department}
                      </span>
                    </td>

                    <td>
                      <div className="progress-cell">
                        <span>
                          {p.progress}%
                        </span>

                        <div className="progress-bar">
                          <div
                            className="progress-fill"
                            style={{
                              width: `${p.progress}%`,
                            }}
                          />
                        </div>
                      </div>
                    </td>

                    <td>
                      <span className="status-badge">
                        ● {p.status}
                      </span>
                    </td>

                    <td>
                      <div className="date-cell">
                        📅
                        <div>
                          <p>{p.dueDate}</p>
                          <span>{p.daysLeft}</span>
                        </div>
                      </div>
                    </td>

                    <td>
                      <div className="team-cell">
                        <img
                          src="https://i.pravatar.cc/35?img=1"
                          alt=""
                        />
                        <img
                          src="https://i.pravatar.cc/35?img=2"
                          alt=""
                        />
                        <img
                          src="https://i.pravatar.cc/35?img=3"
                          alt=""
                        />
                        <span className="extra-team">
                          +2
                        </span>
                      </div>
                    </td>

                    <td>
                      <button className="action-btn">
                        ⋮
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="pagination-row">
              <button className="page-btn">
                ‹
              </button>

              {[1, 2, 3].map((n) => (
                <button
                  key={n}
                  className={`page-btn ${
                    currentPage === n
                      ? "active"
                      : ""
                  }`}
                  onClick={() =>
                    setCurrentPage(n)
                  }
                >
                  {n}
                </button>
              ))}

              <button className="page-btn">
                ›
              </button>
            </div>

          </div>
        </div>
      </main>
    </div>
  );
}