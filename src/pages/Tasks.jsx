import React, { useState } from "react";
import "./Tasks.css";
import Sidebar from "../components/Sidebar";

const tasksData = [
  {
    id: 1,
    title: "Design landing page",
    subtitle: "Create new hero section",
    project: "Eternis Website Redesign",
    projectColor: "#a78bfa",
    assignee: "Sarah J.",
    avatar: "SJ",
    priority: "High",
    status: "In Progress",
    dueDate: "May 25, 2024",
    daysLeft: "5 days left",
    daysLeftColor: "#f97316",
    progress: 75,
  },
  {
    id: 2,
    title: "Setup authentication",
    subtitle: "Implement JWT strategy",
    project: "Mobile App Development",
    projectColor: "#38bdf8",
    assignee: "Michael B.",
    avatar: "MB",
    priority: "High",
    status: "To Do",
    dueDate: "May 28, 2024",
    daysLeft: "8 days left",
    daysLeftColor: "#94a3b8",
    progress: 0,
  },
  {
    id: 3,
    title: "Database schema",
    subtitle: "Design and optimize schema",
    project: "E-commerce Platform",
    projectColor: "#34d399",
    assignee: "David L.",
    avatar: "DL",
    priority: "Medium",
    status: "In Progress",
    dueDate: "May 30, 2024",
    daysLeft: "10 days left",
    daysLeftColor: "#94a3b8",
    progress: 60,
  },
  {
    id: 4,
    title: "API integration",
    subtitle: "Integrate payment gateway",
    project: "E-commerce Platform",
    projectColor: "#34d399",
    assignee: "Emily W.",
    avatar: "EW",
    priority: "High",
    status: "In Review",
    dueDate: "Jun 2, 2024",
    daysLeft: "13 days left",
    daysLeftColor: "#94a3b8",
    progress: 90,
  },
  {
    id: 5,
    title: "Create UI components",
    subtitle: "Button, cards, forms...",
    project: "Mobile App Development",
    projectColor: "#38bdf8",
    assignee: "Jessica T.",
    avatar: "JT",
    priority: "Medium",
    status: "To Do",
    dueDate: "Jun 3, 2024",
    daysLeft: "14 days left",
    daysLeftColor: "#94a3b8",
    progress: 0,
  },
  {
    id: 6,
    title: "Content writing",
    subtitle: "Write product description",
    project: "Digital Marketing Campaign",
    projectColor: "#fbbf24",
    assignee: "Olivia M.",
    avatar: "OM",
    priority: "Low",
    status: "In Progress",
    dueDate: "Jun 5, 2024",
    daysLeft: "16 days left",
    daysLeftColor: "#94a3b8",
    progress: 40,
  },
  {
    id: 7,
    title: "Fix responsive issues",
    subtitle: "Dashboard & mobile view",
    project: "CRM Integration",
    projectColor: "#c084fc",
    assignee: "Daniel K.",
    avatar: "DK",
    priority: "Medium",
    status: "In Review",
    dueDate: "Jun 7, 2024",
    daysLeft: "18 days left",
    daysLeftColor: "#94a3b8",
    progress: 85,
  },
  {
    id: 8,
    title: "Deploy to production",
    subtitle: "Final deployment",
    project: "CRM Integration",
    projectColor: "#c084fc",
    assignee: "James A.",
    avatar: "JA",
    priority: "High",
    status: "To Do",
    dueDate: "Jun 10, 2024",
    daysLeft: "21 days left",
    daysLeftColor: "#94a3b8",
    progress: 0,
  },
];

const myTasks = [
  { title: "Design landing page", project: "Eternis Website Redesign", status: "In Progress" },
  { title: "Database schema", project: "E-commerce Platform", status: "In Progress" },
  { title: "Content writing", project: "Digital Marketing Campaign", status: "In Progress" },
  { title: "Fix responsive issues", project: "CRM Integration", status: "In Review" },
];

const upcomingDeadlines = [
  { title: "Design landing page", project: "Eternis Website Redesign", date: "May 25, 2024", daysLeft: "5 days left", color: "#f97316" },
  { title: "Setup authentication", project: "Mobile App Development", date: "May 28, 2024", daysLeft: "8 days left", color: "#f97316" },
  { title: "Database schema", project: "E-commerce Platform", date: "May 30, 2024", daysLeft: "10 days left", color: "#f97316" },
];

const priorityColors = { High: "#f97316", Medium: "#fbbf24", Low: "#34d399" };
const statusColors = {
  "In Progress": "#38bdf8",
  "To Do": "#94a3b8",
  "In Review": "#a78bfa",
  Completed: "#34d399",
};

const statusDot = {
  "In Progress": "#38bdf8",
  "To Do": "#64748b",
  "In Review": "#a78bfa",
  Completed: "#34d399",
};

const progressColor = (p) => {
  if (p >= 80) return "#34d399";
  if (p >= 50) return "#a78bfa";
  return "#38bdf8";
};

export default function Tasks() {
  const [selectedRows, setSelectedRows] = useState([]);
  const [view, setView] = useState("table");
  const [searchQuery, setSearchQuery] = useState("");

  const toggleRow = (id) => {
    setSelectedRows((prev) =>
      prev.includes(id) ? prev.filter((r) => r !== id) : [...prev, id]
    );
  };

  const filtered = tasksData.filter(
    (t) =>
      t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.project.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Donut chart SVG
  const donutData = [
    { label: "To Do", value: 23, color: "#64748b" },
    { label: "In Progress", value: 18, color: "#38bdf8" },
    { label: "In Review", value: 12, color: "#a78bfa" },
    { label: "Completed", value: 15, color: "#34d399" },
  ];
  const total = donutData.reduce((s, d) => s + d.value, 0);
  let cumulative = 0;
  const r = 40, cx = 56, cy = 56, stroke = 14;
  const circumference = 2 * Math.PI * r;

    return (
  <div className="dashboard">
    <Sidebar />

    <main className="main-content">
      <div className="tasks-page">
      {/* Header */}
      <div className="tasks-header">
        <div>
          <h1 className="tasks-title">Tasks</h1>
          <p className="tasks-subtitle">Organize, assign and track tasks across your projects.</p>
        </div>
        <div className="tasks-header-actions">
          <div className="tasks-search-bar">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
            <input placeholder="Search tasks..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} />
          </div>
          <button className="tasks-icon-btn">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2"><line x1="4" y1="6" x2="20" y2="6"/><line x1="8" y1="12" x2="16" y2="12"/><line x1="11" y1="18" x2="13" y2="18"/></svg>
          </button>
          <button className="tasks-icon-btn tasks-bell-btn">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>
            <span className="tasks-badge">3</span>
          </button>
          <button className="tasks-add-btn">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
            Add Task
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="tasks-stats">
        {[
          { label: "Total Tasks", value: 68, sub: "↑ 18% this month", subColor: "#34d399", icon: "📋", iconBg: "#7c3aed", wave: "#7c3aed" },
          { label: "To Do", value: 23, sub: "33.8% of total", subColor: "#38bdf8", icon: "📝", iconBg: "#1e40af", wave: "#38bdf8" },
          { label: "In Progress", value: 18, sub: "26.5% of total", subColor: "#f97316", icon: "⏳", iconBg: "#92400e", wave: "#f97316" },
          { label: "In Review", value: 12, sub: "17.6% of total", subColor: "#a78bfa", icon: "🔍", iconBg: "#4c1d95", wave: "#a78bfa" },
          { label: "Completed", value: 15, sub: "22.1% of total", subColor: "#34d399", icon: "✅", iconBg: "#065f46", wave: "#34d399" },
        ].map((card) => (
          <div className="stat-card" key={card.label}>
            <div className="stat-card-top">
              <div className="stat-icon" style={{ background: card.iconBg }}>{card.icon}</div>
              <div>
                <div className="stat-label">{card.label}</div>
                <div className="stat-value">{card.value}</div>
                <div className="stat-sub" style={{ color: card.subColor }}>{card.sub}</div>
              </div>
            </div>
            <svg className="stat-wave" viewBox="0 0 120 30" preserveAspectRatio="none">
              <polyline points="0,20 15,12 30,18 45,8 60,15 75,10 90,16 105,8 120,14" fill="none" stroke={card.wave} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
        ))}
      </div>

      {/* Main Content */}
      <div className="tasks-main">
        {/* Table Section */}
        <div className="tasks-table-section">
          {/* Filters */}
          <div className="tasks-filters">
            <div className="filter-search">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
              <input placeholder="Search by task title or keyword..." />
            </div>
            {["All Projects", "All Assignees", "All Priorities", "All Status"].map((f) => (
              <select key={f} className="filter-select">
                <option>{f}</option>
              </select>
            ))}
          </div>

          {/* Table */}
          <div className="tasks-table-wrapper">
            <table className="tasks-table">
              <thead>
                <tr>
                  <th><input type="checkbox" className="tasks-checkbox" /></th>
                  <th>TASK ↕</th>
                  <th>PROJECT ↕</th>
                  <th>ASSIGNEE ↕</th>
                  <th>PRIORITY ↕</th>
                  <th>STATUS ↕</th>
                  <th>DUE DATE ↕</th>
                  <th>PROGRESS</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((task) => (
                  <tr key={task.id} className={selectedRows.includes(task.id) ? "selected" : ""}>
                    <td>
                      <input
                        type="checkbox"
                        className="tasks-checkbox"
                        checked={selectedRows.includes(task.id)}
                        onChange={() => toggleRow(task.id)}
                      />
                    </td>
                    <td>
                      <div className="task-name">{task.title}</div>
                      <div className="task-sub">{task.subtitle}</div>
                    </td>
                    <td>
                      <span className="project-badge">
                        <span className="project-dot" style={{ background: task.projectColor }}></span>
                        {task.project}
                      </span>
                    </td>
                    <td>
                      <div className="assignee-cell">
                        <div className="avatar">{task.avatar}</div>
                        <span>{task.assignee}</span>
                      </div>
                    </td>
                    <td>
                      <span className="priority-badge" style={{ color: priorityColors[task.priority], borderColor: priorityColors[task.priority] + "33", background: priorityColors[task.priority] + "15" }}>
                        {task.priority}
                      </span>
                    </td>
                    <td>
                      <span className="status-badge">
                        <span className="status-dot" style={{ background: statusDot[task.status] }}></span>
                        <span style={{ color: statusColors[task.status] }}>{task.status}</span>
                      </span>
                    </td>
                    <td>
                      <div className="due-date">
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
                        <div>
                          <div className="due-date-text">{task.dueDate}</div>
                          <div className="days-left" style={{ color: task.daysLeftColor }}>{task.daysLeft}</div>
                        </div>
                      </div>
                    </td>
                    <td>
                      <div className="progress-cell">
                        <span className="progress-label">{task.progress}%</span>
                        <div className="progress-bar-bg">
                          <div
                            className="progress-bar-fill"
                            style={{ width: `${task.progress}%`, background: progressColor(task.progress) }}
                          ></div>
                        </div>
                      </div>
                    </td>
                    <td>
                      <button className="row-menu-btn">⋮</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="tasks-pagination">
            <span className="pagination-info">Showing 1 to 8 of 68 tasks</span>
            <div className="pagination-controls">
              <button className="page-btn">‹</button>
              {[1, 2, 3, 4, "...", 9].map((p, i) => (
                <button key={i} className={`page-btn ${p === 1 ? "active" : ""}`}>{p}</button>
              ))}
              <button className="page-btn">›</button>
            </div>
            <select className="per-page-select">
              <option>10 / page</option>
              <option>20 / page</option>
              <option>50 / page</option>
            </select>
          </div>
        </div>

        {/* Right Sidebar */}
        <div className="tasks-sidebar">
          {/* View Toggle */}
          <div className="sidebar-view-toggle">
            <button className={`view-btn ${view === "table" ? "active" : ""}`} onClick={() => setView("table")}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/></svg>
              Table
            </button>
            <button className={`view-btn ${view === "board" ? "active" : ""}`} onClick={() => setView("board")}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="5" height="18"/><rect x="10" y="3" width="5" height="18"/><rect x="17" y="3" width="5" height="18"/></svg>
              Board
            </button>
            <button className="filter-icon-btn">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/></svg>
            </button>
          </div>

          {/* Tasks by Status Donut */}
          <div className="sidebar-card">
            <h3 className="sidebar-card-title">Tasks by Status</h3>
            <div className="donut-chart-wrapper">
              <svg width="112" height="112" viewBox="0 0 112 112">
                {donutData.map((seg, i) => {
                  const offset = circumference - (cumulative / total) * circumference;
                  const dasharray = `${(seg.value / total) * circumference} ${circumference}`;
                  const el = (
                    <circle
                      key={i}
                      cx={cx} cy={cy} r={r}
                      fill="none"
                      stroke={seg.color}
                      strokeWidth={stroke}
                      strokeDasharray={dasharray}
                      strokeDashoffset={offset}
                      style={{ transform: "rotate(-90deg)", transformOrigin: "50% 50%" }}
                    />
                  );
                  cumulative += seg.value;
                  return el;
                })}
              </svg>
              <div className="donut-legend">
                {donutData.map((d) => (
                  <div key={d.label} className="legend-item">
                    <span className="legend-dot" style={{ background: d.color }}></span>
                    <span className="legend-label">{d.label}</span>
                    <span className="legend-value">{d.value} ({((d.value / total) * 100).toFixed(1)}%)</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* My Tasks */}
          <div className="sidebar-card">
            <div className="sidebar-card-header">
              <h3 className="sidebar-card-title">My Tasks</h3>
              <button className="view-all-btn">View all</button>
            </div>
            {myTasks.map((t, i) => (
              <div key={i} className="my-task-item">
                <div className="my-task-icon">📄</div>
                <div className="my-task-info">
                  <div className="my-task-name">{t.title}</div>
                  <div className="my-task-project">{t.project}</div>
                </div>
                <span className="my-task-status" style={{ color: t.status === "In Review" ? "#a78bfa" : "#38bdf8" }}>
                  {t.status} ▾
                </span>
              </div>
            ))}
          </div>

          {/* Upcoming Deadlines */}
          <div className="sidebar-card">
            <div className="sidebar-card-header">
              <h3 className="sidebar-card-title">Upcoming Deadlines</h3>
              <button className="view-all-btn">View all</button>
            </div>
            {upcomingDeadlines.map((d, i) => (
              <div key={i} className="deadline-item">
                <div className="deadline-icon" style={{ background: ["#7c3aed", "#1e3a5f", "#065f46"][i] }}>📋</div>
                <div className="deadline-info">
                  <div className="deadline-title">{d.title}</div>
                  <div className="deadline-project">{d.project}</div>
                </div>
                <div className="deadline-date">
                  <div style={{ color: d.color, fontWeight: 600, fontSize: "12px" }}>{d.date}</div>
                  <div style={{ color: d.color, fontSize: "11px" }}>{d.daysLeft}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Add Task CTA */}
          <div className="sidebar-add-task">
            <div>
              <div className="sidebar-add-title">Add Task</div>
              <div className="sidebar-add-sub">Create a new task and assign it to your team</div>
            </div>
            <div className="sidebar-add-icon">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#7c3aed" strokeWidth="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
            </div>
          </div>
        </div>
      </div>
      </div>
    </main>
  </div>
);
}