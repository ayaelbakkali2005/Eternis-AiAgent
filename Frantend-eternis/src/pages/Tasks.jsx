import React, { useState, useMemo, useRef, useEffect } from "react";
import "./Tasks.css";
import Sidebar from "../components/Sidebar";

const initialTasks = [
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
    progress: 0,
  },
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
const statusOptions = ["To Do", "In Progress", "In Review", "Completed"];
const priorityOptions = ["Low", "Medium", "High"];
const projectPalette = ["#a78bfa", "#38bdf8", "#34d399", "#fbbf24", "#c084fc", "#f472b6", "#60a5fa"];

const progressColor = (p) => {
  if (p >= 80) return "#34d399";
  if (p >= 50) return "#a78bfa";
  return "#38bdf8";
};

const initials = (name) =>
  name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0].toUpperCase())
    .join("");

const colorForProject = (name, existingTasks) => {
  const existing = existingTasks.find((t) => t.project === name);
  if (existing) return existing.projectColor;
  let hash = 0;
  for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash);
  return projectPalette[Math.abs(hash) % projectPalette.length];
};

const formatDateForDisplay = (isoDate) => {
  if (!isoDate) return "";
  const d = new Date(isoDate + "T00:00:00");
  if (isNaN(d)) return isoDate;
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
};

const daysLeftInfo = (dueDate) => {
  const due = new Date(dueDate);
  if (isNaN(due)) return { label: "", color: "#94a3b8" };
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  due.setHours(0, 0, 0, 0);
  const diff = Math.round((due - today) / 86400000);
  if (diff < 0) return { label: `${Math.abs(diff)}d overdue`, color: "#f87171" };
  if (diff === 0) return { label: "Due today", color: "#f97316" };
  if (diff <= 5) return { label: `${diff} days left`, color: "#f97316" };
  return { label: `${diff} days left`, color: "#94a3b8" };
};

const emptyForm = {
  title: "",
  subtitle: "",
  project: "",
  assignee: "",
  priority: "Medium",
  status: "To Do",
  dueDate: "",
  progress: 0,
};

export default function Tasks() {
  const [tasks, setTasks] = useState(initialTasks);
  const [selectedRows, setSelectedRows] = useState([]);
  const [view, setView] = useState("table");
  const [searchQuery, setSearchQuery] = useState("");
  const [compact, setCompact] = useState(false);

  const [filterProject, setFilterProject] = useState("All Projects");
  const [filterAssignee, setFilterAssignee] = useState("All Assignees");
  const [filterPriority, setFilterPriority] = useState("All Priorities");
  const [filterStatus, setFilterStatus] = useState("All Status");

  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });

  const [currentPage, setCurrentPage] = useState(1);
  const [perPage, setPerPage] = useState(10);

  const [openRowMenuId, setOpenRowMenuId] = useState(null);
  const [showNotif, setShowNotif] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyForm);

  const [showAllMyTasks, setShowAllMyTasks] = useState(false);
  const [showAllDeadlines, setShowAllDeadlines] = useState(false);

  const notifRef = useRef(null);
  const menuRef = useRef(null);

  useEffect(() => {
    const handleClick = (e) => {
      if (notifRef.current && !notifRef.current.contains(e.target)) setShowNotif(false);
      if (menuRef.current && !menuRef.current.contains(e.target)) setOpenRowMenuId(null);
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const projectList = useMemo(() => [...new Set(tasks.map((t) => t.project))], [tasks]);
  const assigneeList = useMemo(() => [...new Set(tasks.map((t) => t.assignee))], [tasks]);

  const toggleRow = (id) => {
    setSelectedRows((prev) => (prev.includes(id) ? prev.filter((r) => r !== id) : [...prev, id]));
  };

  const toggleSelectAll = () => {
    if (selectedRows.length === paginated.length && paginated.length > 0) {
      setSelectedRows([]);
    } else {
      setSelectedRows(paginated.map((t) => t.id));
    }
  };

  const handleSort = (key) => {
    setSortConfig((prev) => {
      if (prev.key === key) return { key, direction: prev.direction === "asc" ? "desc" : "asc" };
      return { key, direction: "asc" };
    });
  };

  const filtered = useMemo(() => {
    let result = tasks.filter((t) => {
      const q = searchQuery.toLowerCase();
      const matchesSearch =
        !q || t.title.toLowerCase().includes(q) || t.project.toLowerCase().includes(q) || t.assignee.toLowerCase().includes(q);
      const matchesProject = filterProject === "All Projects" || t.project === filterProject;
      const matchesAssignee = filterAssignee === "All Assignees" || t.assignee === filterAssignee;
      const matchesPriority = filterPriority === "All Priorities" || t.priority === filterPriority;
      const matchesStatus = filterStatus === "All Status" || t.status === filterStatus;
      return matchesSearch && matchesProject && matchesAssignee && matchesPriority && matchesStatus;
    });

    if (sortConfig.key) {
      result = [...result].sort((a, b) => {
        let av = a[sortConfig.key];
        let bv = b[sortConfig.key];
        if (sortConfig.key === "dueDate") {
          av = new Date(av).getTime();
          bv = new Date(bv).getTime();
        } else if (typeof av === "string") {
          av = av.toLowerCase();
          bv = bv.toLowerCase();
        }
        if (av < bv) return sortConfig.direction === "asc" ? -1 : 1;
        if (av > bv) return sortConfig.direction === "asc" ? 1 : -1;
        return 0;
      });
    }
    return result;
  }, [tasks, searchQuery, filterProject, filterAssignee, filterPriority, filterStatus, sortConfig]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / perPage));
  const safePage = Math.min(currentPage, totalPages);
  const paginated = useMemo(
    () => filtered.slice((safePage - 1) * perPage, safePage * perPage),
    [filtered, safePage, perPage]
  );

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, filterProject, filterAssignee, filterPriority, filterStatus, perPage]);

  const clearFilters = () => {
    setSearchQuery("");
    setFilterProject("All Projects");
    setFilterAssignee("All Assignees");
    setFilterPriority("All Priorities");
    setFilterStatus("All Status");
    setSortConfig({ key: null, direction: "asc" });
  };

  const stats = useMemo(() => {
    const total = tasks.length || 1;
    const counts = statusOptions.reduce((acc, s) => {
      acc[s] = tasks.filter((t) => t.status === s).length;
      return acc;
    }, {});
    return { total: tasks.length, counts, pct: (s) => ((counts[s] / total) * 100).toFixed(1) };
  }, [tasks]);

  const donutData = [
    { label: "To Do", value: stats.counts["To Do"] || 0, color: "#64748b" },
    { label: "In Progress", value: stats.counts["In Progress"] || 0, color: "#38bdf8" },
    { label: "In Review", value: stats.counts["In Review"] || 0, color: "#a78bfa" },
    { label: "Completed", value: stats.counts["Completed"] || 0, color: "#34d399" },
  ];
  const donutTotal = Math.max(1, donutData.reduce((s, d) => s + d.value, 0));
  let cumulative = 0;
  const r = 40, cx = 56, cy = 56, stroke = 14;
  const circumference = 2 * Math.PI * r;

  const myTasksList = useMemo(() => {
    const active = tasks.filter((t) => t.status === "In Progress" || t.status === "In Review");
    return showAllMyTasks ? active : active.slice(0, 4);
  }, [tasks, showAllMyTasks]);

  const deadlinesList = useMemo(() => {
    const sorted = [...tasks]
      .filter((t) => t.status !== "Completed")
      .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));
    return showAllDeadlines ? sorted : sorted.slice(0, 3);
  }, [tasks, showAllDeadlines]);

  const openAddModal = () => {
    setEditingId(null);
    setForm(emptyForm);
    setShowModal(true);
  };

  const openEditModal = (task) => {
    setEditingId(task.id);
    const iso = isNaN(new Date(task.dueDate)) ? "" : new Date(task.dueDate).toISOString().slice(0, 10);
    setForm({ ...task, dueDate: iso });
    setOpenRowMenuId(null);
    setShowModal(true);
  };

  const deleteTask = (id) => {
    setTasks((prev) => prev.filter((t) => t.id !== id));
    setSelectedRows((prev) => prev.filter((r) => r !== id));
    setOpenRowMenuId(null);
  };

  const updateTaskStatus = (id, status) => {
    setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, status, progress: status === "Completed" ? 100 : t.progress } : t)));
  };

  const submitForm = (e) => {
    e.preventDefault();
    if (!form.title.trim() || !form.project.trim() || !form.assignee.trim()) return;

    const displayDate = formatDateForDisplay(form.dueDate) || "No due date";
    if (editingId) {
      setTasks((prev) =>
        prev.map((t) =>
          t.id === editingId
            ? {
                ...t,
                ...form,
                dueDate: displayDate,
                projectColor: colorForProject(form.project, tasks),
                avatar: initials(form.assignee),
                progress: Number(form.progress) || 0,
              }
            : t
        )
      );
    } else {
      const newTask = {
        id: Math.max(0, ...tasks.map((t) => t.id)) + 1,
        title: form.title,
        subtitle: form.subtitle || "New task",
        project: form.project,
        projectColor: colorForProject(form.project, tasks),
        assignee: form.assignee,
        avatar: initials(form.assignee),
        priority: form.priority,
        status: form.status,
        dueDate: displayDate,
        progress: form.status === "Completed" ? 100 : Number(form.progress) || 0,
      };
      setTasks((prev) => [newTask, ...prev]);
    }
    setShowModal(false);
    setForm(emptyForm);
    setEditingId(null);
  };

  const sortArrow = (key) => (sortConfig.key === key ? (sortConfig.direction === "asc" ? " ▲" : " ▼") : " ↕");

  const notifications = [
    { text: "Emily W. moved “API integration” to In Review", time: "2h ago" },
    { text: "3 tasks are due this week", time: "5h ago" },
    { text: "David L. commented on “Database schema”", time: "1d ago" },
  ];

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
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2">
                  <circle cx="11" cy="11" r="8" />
                  <path d="m21 21-4.35-4.35" />
                </svg>
                <input
                  placeholder="Search tasks..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <button
                className="tasks-icon-btn"
                title={compact ? "Switch to comfortable view" : "Switch to compact view"}
                onClick={() => setCompact((c) => !c)}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2">
                  <line x1="4" y1="6" x2="20" y2="6" />
                  <line x1="8" y1="12" x2="16" y2="12" />
                  <line x1="11" y1="18" x2="13" y2="18" />
                </svg>
              </button>
              <div className="tasks-bell-btn" ref={notifRef} style={{ position: "relative" }}>
                <button className="tasks-icon-btn" onClick={() => setShowNotif((s) => !s)}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2">
                    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
                    <path d="M13.73 21a2 2 0 0 1-3.46 0" />
                  </svg>
                  {notifications.length > 0 && <span className="tasks-badge">{notifications.length}</span>}
                </button>
                {showNotif && (
                  <div className="notif-dropdown">
                    <div className="notif-dropdown-header">Notifications</div>
                    {notifications.map((n, i) => (
                      <div className="notif-item" key={i}>
                        <div>{n.text}</div>
                        <div className="notif-item-time">{n.time}</div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <button className="tasks-add-btn" onClick={openAddModal}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5">
                  <line x1="12" y1="5" x2="12" y2="19" />
                  <line x1="5" y1="12" x2="19" y2="12" />
                </svg>
                Add Task
              </button>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="tasks-stats">
            {[
              { label: "Total Tasks", value: stats.total, sub: `${stats.total} tasks total`, subColor: "#34d399", icon: "📋", iconBg: "#7c3aed", wave: "#7c3aed" },
              { label: "To Do", value: stats.counts["To Do"] || 0, sub: `${stats.pct("To Do")}% of total`, subColor: "#38bdf8", icon: "📝", iconBg: "#1e40af", wave: "#38bdf8" },
              { label: "In Progress", value: stats.counts["In Progress"] || 0, sub: `${stats.pct("In Progress")}% of total`, subColor: "#f97316", icon: "⏳", iconBg: "#92400e", wave: "#f97316" },
              { label: "In Review", value: stats.counts["In Review"] || 0, sub: `${stats.pct("In Review")}% of total`, subColor: "#a78bfa", icon: "🔍", iconBg: "#4c1d95", wave: "#a78bfa" },
              { label: "Completed", value: stats.counts["Completed"] || 0, sub: `${stats.pct("Completed")}% of total`, subColor: "#34d399", icon: "✅", iconBg: "#065f46", wave: "#34d399" },
            ].map((card) => (
              <div
                className="stat-card"
                key={card.label}
                style={{ cursor: card.label === "Total Tasks" ? "default" : "pointer" }}
                onClick={() => {
                  if (card.label !== "Total Tasks") setFilterStatus(card.label);
                }}
              >
                <div className="stat-card-top">
                  <div className="stat-icon" style={{ background: card.iconBg }}>{card.icon}</div>
                  <div>
                    <div className="stat-label">{card.label}</div>
                    <div className="stat-value">{card.value}</div>
                    <div className="stat-sub" style={{ color: card.subColor }}>{card.sub}</div>
                  </div>
                </div>
                <svg className="stat-wave" viewBox="0 0 120 30" preserveAspectRatio="none">
                  <polyline points="0,20 15,12 30,18 45,8 60,15 75,10 90,16 105,8 120,14" fill="none" stroke={card.wave} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
            ))}
          </div>

          {/* Main Content */}
          <div className="tasks-main">
            {/* Table / Board Section */}
            <div className="tasks-table-section">
              {/* Filters */}
              <div className="tasks-filters">
                <div className="filter-search">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth="2">
                    <circle cx="11" cy="11" r="8" />
                    <path d="m21 21-4.35-4.35" />
                  </svg>
                  <input
                    placeholder="Search by task title or keyword..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <select className="filter-select" value={filterProject} onChange={(e) => setFilterProject(e.target.value)}>
                  <option>All Projects</option>
                  {projectList.map((p) => <option key={p}>{p}</option>)}
                </select>
                <select className="filter-select" value={filterAssignee} onChange={(e) => setFilterAssignee(e.target.value)}>
                  <option>All Assignees</option>
                  {assigneeList.map((a) => <option key={a}>{a}</option>)}
                </select>
                <select className="filter-select" value={filterPriority} onChange={(e) => setFilterPriority(e.target.value)}>
                  <option>All Priorities</option>
                  {priorityOptions.map((p) => <option key={p}>{p}</option>)}
                </select>
                <select className="filter-select" value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
                  <option>All Status</option>
                  {statusOptions.map((s) => <option key={s}>{s}</option>)}
                </select>
                <button className="filter-clear-btn" onClick={clearFilters}>Clear</button>
              </div>

              {view === "table" ? (
                <>
                  <div className="tasks-table-wrapper">
                    <table className="tasks-table">
                      <thead>
                        <tr>
                          <th>
                            <input
                              type="checkbox"
                              className="tasks-checkbox"
                              checked={paginated.length > 0 && selectedRows.length === paginated.length}
                              onChange={toggleSelectAll}
                            />
                          </th>
                          <th onClick={() => handleSort("title")}>TASK{sortArrow("title")}</th>
                          <th onClick={() => handleSort("project")}>PROJECT{sortArrow("project")}</th>
                          <th onClick={() => handleSort("assignee")}>ASSIGNEE{sortArrow("assignee")}</th>
                          <th onClick={() => handleSort("priority")}>PRIORITY{sortArrow("priority")}</th>
                          <th onClick={() => handleSort("status")}>STATUS{sortArrow("status")}</th>
                          <th onClick={() => handleSort("dueDate")}>DUE DATE{sortArrow("dueDate")}</th>
                          <th onClick={() => handleSort("progress")}>PROGRESS{sortArrow("progress")}</th>
                          <th></th>
                        </tr>
                      </thead>
                      <tbody>
                        {paginated.length === 0 && (
                          <tr>
                            <td colSpan={9} style={{ textAlign: "center", padding: "28px", color: "#64748b" }}>
                              No tasks match your search or filters.
                            </td>
                          </tr>
                        )}
                        {paginated.map((task) => {
                          const dl = daysLeftInfo(task.dueDate);
                          return (
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
                                <span
                                  className="priority-badge"
                                  style={{
                                    color: priorityColors[task.priority],
                                    borderColor: priorityColors[task.priority] + "33",
                                    background: priorityColors[task.priority] + "15",
                                  }}
                                >
                                  {task.priority}
                                </span>
                              </td>
                              <td>
                                <span className="status-badge">
                                  <span className="status-dot" style={{ background: statusDot[task.status] }}></span>
                                  <select
                                    value={task.status}
                                    onChange={(e) => updateTaskStatus(task.id, e.target.value)}
                                    style={{
                                      background: "transparent",
                                      border: "none",
                                      color: statusColors[task.status],
                                      fontSize: "12px",
                                      cursor: "pointer",
                                      outline: "none",
                                    }}
                                  >
                                    {statusOptions.map((s) => <option key={s} value={s}>{s}</option>)}
                                  </select>
                                </span>
                              </td>
                              <td>
                                <div className="due-date">
                                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth="2">
                                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                                    <line x1="16" y1="2" x2="16" y2="6" />
                                    <line x1="8" y1="2" x2="8" y2="6" />
                                    <line x1="3" y1="10" x2="21" y2="10" />
                                  </svg>
                                  <div>
                                    <div className="due-date-text">{task.dueDate}</div>
                                    <div className="days-left" style={{ color: dl.color }}>{dl.label}</div>
                                  </div>
                                </div>
                              </td>
                              <td>
                                <div className="progress-cell">
                                  <span className="progress-label">{task.progress}%</span>
                                  <div className="progress-bar-bg">
                                    <div className="progress-bar-fill" style={{ width: `${task.progress}%`, background: progressColor(task.progress) }}></div>
                                  </div>
                                </div>
                              </td>
                              <td>
                                <div className="row-menu-wrapper" ref={openRowMenuId === task.id ? menuRef : null}>
                                  <button className="row-menu-btn" onClick={() => setOpenRowMenuId(openRowMenuId === task.id ? null : task.id)}>
                                    ⋮
                                  </button>
                                  {openRowMenuId === task.id && (
                                    <div className="row-menu-dropdown">
                                      <button className="row-menu-item" onClick={() => openEditModal(task)}>Edit task</button>
                                      <button className="row-menu-item danger" onClick={() => deleteTask(task.id)}>Delete task</button>
                                    </div>
                                  )}
                                </div>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>

                  {/* Pagination */}
                  <div className="tasks-pagination">
                    <span className="pagination-info">
                      Showing {filtered.length === 0 ? 0 : (safePage - 1) * perPage + 1} to {Math.min(safePage * perPage, filtered.length)} of {filtered.length} tasks
                    </span>
                    <div className="pagination-controls">
                      <button className="page-btn" disabled={safePage === 1} onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}>‹</button>
                      {Array.from({ length: totalPages }, (_, i) => i + 1)
                        .filter((p) => p === 1 || p === totalPages || Math.abs(p - safePage) <= 1)
                        .reduce((acc, p, idx, arr) => {
                          if (idx > 0 && p - arr[idx - 1] > 1) acc.push("...");
                          acc.push(p);
                          return acc;
                        }, [])
                        .map((p, i) =>
                          p === "..." ? (
                            <button key={`e${i}`} className="page-btn ellipsis" disabled>…</button>
                          ) : (
                            <button key={p} className={`page-btn ${p === safePage ? "active" : ""}`} onClick={() => setCurrentPage(p)}>{p}</button>
                          )
                        )}
                      <button className="page-btn" disabled={safePage === totalPages} onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}>›</button>
                    </div>
                    <select className="per-page-select" value={perPage} onChange={(e) => setPerPage(Number(e.target.value))}>
                      <option value={10}>10 / page</option>
                      <option value={20}>20 / page</option>
                      <option value={50}>50 / page</option>
                    </select>
                  </div>
                </>
              ) : (
                <div className="board-view">
                  {statusOptions.map((status) => {
                    const colTasks = filtered.filter((t) => t.status === status);
                    return (
                      <div className="board-column" key={status}>
                        <div className="board-column-title">
                          <span className="status-dot" style={{ background: statusDot[status] }}></span>
                          {status}
                          <span className="board-column-count">{colTasks.length}</span>
                        </div>
                        {colTasks.length === 0 && <div className="board-card-empty">No tasks</div>}
                        {colTasks.map((task) => (
                          <div className="board-card" key={task.id} onClick={() => openEditModal(task)}>
                            <div className="board-card-title">{task.title}</div>
                            <div className="board-card-project">{task.project}</div>
                            <div className="board-card-footer">
                              <span
                                className="priority-badge"
                                style={{
                                  color: priorityColors[task.priority],
                                  borderColor: priorityColors[task.priority] + "33",
                                  background: priorityColors[task.priority] + "15",
                                }}
                              >
                                {task.priority}
                              </span>
                              <div className="avatar" style={{ width: 22, height: 22, fontSize: 8 }}>{task.avatar}</div>
                            </div>
                          </div>
                        ))}
                      </div>
                    );
                  })}
                </div>
              )}
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
                <button className="filter-icon-btn" title="Clear filters" onClick={clearFilters}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/></svg>
                </button>
              </div>

              {/* Tasks by Status Donut */}
              <div className="sidebar-card">
                <h3 className="sidebar-card-title">Tasks by Status</h3>
                <div className="donut-chart-wrapper">
                  <svg width="112" height="112" viewBox="0 0 112 112">
                    {donutData.map((seg, i) => {
                      const offset = circumference - (cumulative / donutTotal) * circumference;
                      const dasharray = `${(seg.value / donutTotal) * circumference} ${circumference}`;
                      const el = (
                        <circle
                          key={i}
                          cx={cx} cy={cy} r={r}
                          fill="none"
                          stroke={seg.color}
                          strokeWidth={stroke}
                          strokeDasharray={dasharray}
                          strokeDashoffset={offset}
                          style={{ transform: "rotate(-90deg)", transformOrigin: "50% 50%", cursor: "pointer" }}
                          onClick={() => setFilterStatus(seg.label)}
                        />
                      );
                      cumulative += seg.value;
                      return el;
                    })}
                  </svg>
                  <div className="donut-legend">
                    {donutData.map((d) => (
                      <div key={d.label} className="legend-item" style={{ cursor: "pointer" }} onClick={() => setFilterStatus(d.label)}>
                        <span className="legend-dot" style={{ background: d.color }}></span>
                        <span className="legend-label">{d.label}</span>
                        <span className="legend-value">{d.value} ({((d.value / donutTotal) * 100).toFixed(1)}%)</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* My Tasks */}
              <div className="sidebar-card">
                <div className="sidebar-card-header">
                  <h3 className="sidebar-card-title">My Tasks</h3>
                  <button className="view-all-btn" onClick={() => setShowAllMyTasks((s) => !s)}>
                    {showAllMyTasks ? "Show less" : "View all"}
                  </button>
                </div>
                {myTasksList.length === 0 && <div className="board-card-empty">Nothing in progress</div>}
                {myTasksList.map((t) => (
                  <div key={t.id} className="my-task-item">
                    <div className="my-task-icon">📄</div>
                    <div className="my-task-info">
                      <div className="my-task-name">{t.title}</div>
                      <div className="my-task-project">{t.project}</div>
                    </div>
                    <select
                      className="my-task-status"
                      value={t.status}
                      style={{ color: statusColors[t.status] }}
                      onChange={(e) => updateTaskStatus(t.id, e.target.value)}
                    >
                      {statusOptions.map((s) => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </div>
                ))}
              </div>

              {/* Upcoming Deadlines */}
              <div className="sidebar-card">
                <div className="sidebar-card-header">
                  <h3 className="sidebar-card-title">Upcoming Deadlines</h3>
                  <button className="view-all-btn" onClick={() => setShowAllDeadlines((s) => !s)}>
                    {showAllDeadlines ? "Show less" : "View all"}
                  </button>
                </div>
                {deadlinesList.length === 0 && <div className="board-card-empty">No upcoming deadlines</div>}
                {deadlinesList.map((d, i) => {
                  const dl = daysLeftInfo(d.dueDate);
                  return (
                    <div key={d.id} className="deadline-item">
                      <div className="deadline-icon" style={{ background: ["#7c3aed", "#1e3a5f", "#065f46"][i % 3] }}>📋</div>
                      <div className="deadline-info">
                        <div className="deadline-title">{d.title}</div>
                        <div className="deadline-project">{d.project}</div>
                      </div>
                      <div className="deadline-date">
                        <div style={{ color: dl.color, fontWeight: 600, fontSize: "12px" }}>{d.dueDate}</div>
                        <div style={{ color: dl.color, fontSize: "11px" }}>{dl.label}</div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Add Task CTA */}
              <div className="sidebar-add-task" onClick={openAddModal}>
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

      {/* Add / Edit Task Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            <h2 className="modal-title">{editingId ? "Edit Task" : "Add New Task"}</h2>
            <form onSubmit={submitForm}>
              <div className="modal-field">
                <label>Task title</label>
                <input required value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="e.g. Design landing page" />
              </div>
              <div className="modal-field">
                <label>Description</label>
                <input value={form.subtitle} onChange={(e) => setForm({ ...form, subtitle: e.target.value })} placeholder="Short description" />
              </div>
              <div className="modal-row">
                <div className="modal-field">
                  <label>Project</label>
                  <input required value={form.project} onChange={(e) => setForm({ ...form, project: e.target.value })} placeholder="Project name" list="project-options" />
                  <datalist id="project-options">
                    {projectList.map((p) => <option key={p} value={p} />)}
                  </datalist>
                </div>
                <div className="modal-field">
                  <label>Assignee</label>
                  <input required value={form.assignee} onChange={(e) => setForm({ ...form, assignee: e.target.value })} placeholder="e.g. Sarah J." list="assignee-options" />
                  <datalist id="assignee-options">
                    {assigneeList.map((a) => <option key={a} value={a} />)}
                  </datalist>
                </div>
              </div>
              <div className="modal-row">
                <div className="modal-field">
                  <label>Priority</label>
                  <select value={form.priority} onChange={(e) => setForm({ ...form, priority: e.target.value })}>
                    {priorityOptions.map((p) => <option key={p}>{p}</option>)}
                  </select>
                </div>
                <div className="modal-field">
                  <label>Status</label>
                  <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}>
                    {statusOptions.map((s) => <option key={s}>{s}</option>)}
                  </select>
                </div>
              </div>
              <div className="modal-row">
                <div className="modal-field">
                  <label>Due date</label>
                  <input type="date" value={form.dueDate} onChange={(e) => setForm({ ...form, dueDate: e.target.value })} />
                </div>
                <div className="modal-field">
                  <label>Progress (%)</label>
                  <input type="number" min="0" max="100" value={form.progress} onChange={(e) => setForm({ ...form, progress: e.target.value })} />
                </div>
              </div>
              <div className="modal-actions">
                <button type="button" className="modal-btn-cancel" onClick={() => setShowModal(false)}>Cancel</button>
                <button type="submit" className="modal-btn-submit">{editingId ? "Save changes" : "Add Task"}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
