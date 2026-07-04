import { useState } from "react";
import "./Projects.css";
import Sidebar from "../components/Sidebar";

const statsDataInitial = [
  {
    icon: "💼",
    iconBg: "#7c3aed",
    label: "Total Projects",
    sub: "↑ 12% this month",
    subColor: "#22c55e",
    sparkColor: "#a855f7",
    status: null,
  },
  {
    icon: "🔄",
    iconBg: "#2563eb",
    label: "In Progress",
    sub: "of total",
    subColor: "#22c55e",
    sparkColor: "#3b82f6",
    status: "In Progress",
  },
  {
    icon: "✅",
    iconBg: "#16a34a",
    label: "Completed",
    sub: "of total",
    subColor: "#22c55e",
    sparkColor: "#22c55e",
    status: "Completed",
  },
  {
    icon: "⏸",
    iconBg: "#d97706",
    label: "On Hold",
    sub: "of total",
    subColor: "#f59e0b",
    sparkColor: "#f59e0b",
    status: "On Hold",
  },
  {
    icon: "⏱",
    iconBg: "#dc2626",
    label: "Overdue",
    sub: "of total",
    subColor: "#ef4444",
    sparkColor: "#ef4444",
    status: "Overdue",
  },
];

const initialProjects = [
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

const emptyProject = {
  name: "",
  desc: "",
  client: "Eternis Corp",
  department: "Design",
  progress: 0,
  status: "In Progress",
  dueDate: "",
  daysLeft: "",
};

const notifications = [
  { id: 1, text: "Mobile App Development is 21 days from due date" },
  { id: 2, text: "E-commerce Platform was marked as Completed" },
  { id: 3, text: "Eternis Website Redesign is 5 days from due date" },
];

function Sparkline({ color }) {
  const points = "0,20 20,16 40,18 60,10 80,14 100,8 120,12 140,4";

  return (
    <svg className="sparkline" viewBox="0 0 140 25">
      <polyline points={points} fill="none" stroke={color} strokeWidth="2" />
    </svg>
  );
}

export default function Projects() {
  const [projects, setProjects] = useState(initialProjects);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All Status");
  const [departmentFilter, setDepartmentFilter] = useState("All Departments");
  const [clientFilter, setClientFilter] = useState("All Clients");

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState(emptyProject);

  const [viewingProject, setViewingProject] = useState(null);
  const [openMenuId, setOpenMenuId] = useState(null);
  const [showNotifs, setShowNotifs] = useState(false);

  // ----- Filtering -----
  const filtered = projects.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.client.toLowerCase().includes(search.toLowerCase());

    const matchesStatus =
      statusFilter === "All Status" || p.status === statusFilter;

    const matchesDepartment =
      departmentFilter === "All Departments" ||
      p.department === departmentFilter;

    const matchesClient =
      clientFilter === "All Clients" || p.client === clientFilter;

    return matchesSearch && matchesStatus && matchesDepartment && matchesClient;
  });

  const totalPages = Math.max(1, Math.ceil(filtered.length / itemsPerPage));
  const paginated = filtered.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const goToPage = (n) => {
    if (n < 1 || n > totalPages) return;
    setCurrentPage(n);
  };

  // ----- Stats (derived live from projects) -----
  const statsData = statsDataInitial.map((s) => {
    if (s.status === null) {
      return { ...s, value: projects.length, sub: s.sub };
    }
    const count = projects.filter((p) => p.status === s.status).length;
    const pct = projects.length
      ? ((count / projects.length) * 100).toFixed(1)
      : 0;
    return { ...s, value: count, sub: `${pct}% of total` };
  });

  // ----- Add / Edit -----
  const openAddModal = () => {
    setEditingId(null);
    setFormData(emptyProject);
    setShowModal(true);
  };

  const openEditModal = (project) => {
    setEditingId(project.id);
    setFormData(project);
    setShowModal(true);
    setOpenMenuId(null);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingId(null);
    setFormData(emptyProject);
  };

  const handleSaveProject = () => {
    if (!formData.name || !formData.client || !formData.dueDate) {
      alert("Please fill in the project name, client, and due date.");
      return;
    }

    if (editingId !== null) {
      setProjects(
        projects.map((p) => (p.id === editingId ? { ...formData, id: editingId } : p))
      );
    } else {
      const newProject = {
        ...formData,
        id: Date.now(),
        daysLeft: formData.status === "Completed" ? "Completed" : formData.daysLeft || "—",
      };
      setProjects([...projects, newProject]);
    }

    closeModal();
  };

  // ----- Delete -----
  const handleDeleteProject = (id) => {
    const project = projects.find((p) => p.id === id);
    const confirmDelete = window.confirm(
      `Delete "${project.name}"? This can't be undone.`
    );
    if (!confirmDelete) return;
    setProjects(projects.filter((p) => p.id !== id));
    setOpenMenuId(null);
  };

  // ----- View -----
  const handleViewProject = (project) => {
    setViewingProject(project);
    setOpenMenuId(null);
  };

  // ----- Export -----
  const handleExport = () => {
    if (filtered.length === 0) {
      alert("No projects to export.");
      return;
    }

    const headers = [
      "Name",
      "Description",
      "Client",
      "Department",
      "Progress",
      "Status",
      "Due Date",
    ];

    const rows = filtered.map((p) => [
      p.name,
      p.desc,
      p.client,
      p.department,
      `${p.progress}%`,
      p.status,
      p.dueDate,
    ]);

    const csv = [headers, ...rows]
      .map((row) => row.map((v) => `"${v}"`).join(","))
      .join("\n");

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "projects.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // ----- Reset filters (the ⚙ Filter button) -----
  const handleResetFilters = () => {
    setSearch("");
    setStatusFilter("All Status");
    setDepartmentFilter("All Departments");
    setClientFilter("All Clients");
    setCurrentPage(1);
  };

  const statusColor = (status) => {
    switch (status) {
      case "Completed":
        return "#22c55e";
      case "On Hold":
        return "#f59e0b";
      case "Overdue":
        return "#ef4444";
      default:
        return "#3b82f6";
    }
  };

  return (
    <div className="dashboard">
      <Sidebar />

      <main className="main-content">
        <div className="projects-page">
          {/* Header */}
          <div className="projects-header">
            <div>
              <h1 className="projects-title">Projects</h1>
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
                  value={search}
                  onChange={(e) => {
                    setSearch(e.target.value);
                    setCurrentPage(1);
                  }}
                />
              </div>

              <div style={{ position: "relative" }}>
                <button
                  className="notif-btn"
                  onClick={() => setShowNotifs((prev) => !prev)}
                >
                  🔔
                  <span className="notif-badge">{notifications.length}</span>
                </button>

                {showNotifs && (
                  <div className="notif-dropdown">
                    <h4>Notifications</h4>
                    {notifications.map((n) => (
                      <p key={n.id}>{n.text}</p>
                    ))}
                  </div>
                )}
              </div>

              <button className="new-project-btn" onClick={openAddModal}>
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
                onClick={() => {
                  setStatusFilter(s.status ?? "All Status");
                  setCurrentPage(1);
                }}
                style={{ cursor: "pointer" }}
              >
                <div
                  className="dashboard-icon"
                  style={{
                    background: `linear-gradient(135deg, ${s.iconBg}, #3b82f6)`,
                  }}
                >
                  {s.icon}
                </div>

                <p className="dashboard-label">{s.label}</p>
                <h2 className="dashboard-value">{s.value}</h2>

                <span className="dashboard-sub" style={{ color: s.subColor }}>
                  {s.sub}
                </span>

                <div className="dashboard-line">
                  <Sparkline color={s.sparkColor} />
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
                  onChange={(e) => {
                    setSearch(e.target.value);
                    setCurrentPage(1);
                  }}
                />
              </div>

              <select
                className="filter-select"
                value={statusFilter}
                onChange={(e) => {
                  setStatusFilter(e.target.value);
                  setCurrentPage(1);
                }}
              >
                <option>All Status</option>
                <option>In Progress</option>
                <option>Completed</option>
                <option>On Hold</option>
                <option>Overdue</option>
              </select>

              <select
                className="filter-select"
                value={departmentFilter}
                onChange={(e) => {
                  setDepartmentFilter(e.target.value);
                  setCurrentPage(1);
                }}
              >
                <option>All Departments</option>
                <option>Design</option>
                <option>Development</option>
                <option>Marketing</option>
                <option>IT & Security</option>
              </select>

              <select
                className="filter-select"
                value={clientFilter}
                onChange={(e) => {
                  setClientFilter(e.target.value);
                  setCurrentPage(1);
                }}
              >
                <option>All Clients</option>
                <option>Eternis Corp</option>
                <option>TechNova</option>
                <option>ShopMax</option>
              </select>

              <button className="filter-btn" onClick={handleResetFilters}>
                ⚙ Reset
              </button>

              <button className="export-btn" onClick={handleExport}>
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
                {paginated.length === 0 && (
                  <tr>
                    <td colSpan="8" className="no-results-row">
                      No projects found.
                    </td>
                  </tr>
                )}

                {paginated.map((p) => (
                  <tr key={p.id}>
                    <td>
                      <div className="project-cell">
                        <div className="project-icon">💼</div>
                        <div>
                          <h4>{p.name}</h4>
                          <p>{p.desc}</p>
                        </div>
                      </div>
                    </td>

                    <td>
                      <div className="client-cell">
                        <div className="client-logo">⚡</div>
                        <span>{p.client}</span>
                      </div>
                    </td>

                    <td>
                      <span className="department-badge">{p.department}</span>
                    </td>

                    <td>
                      <div className="progress-cell">
                        <span>{p.progress}%</span>
                        <div className="progress-bar">
                          <div
                            className="progress-fill"
                            style={{ width: `${p.progress}%` }}
                          />
                        </div>
                      </div>
                    </td>

                    <td>
                      <span
                        className="status-badge"
                        style={{ color: statusColor(p.status) }}
                      >
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
                        <img src="https://i.pravatar.cc/35?img=1" alt="" />
                        <img src="https://i.pravatar.cc/35?img=2" alt="" />
                        <img src="https://i.pravatar.cc/35?img=3" alt="" />
                        <span className="extra-team">+2</span>
                      </div>
                    </td>

                    <td style={{ position: "relative" }}>
                      <button
                        className="action-btn"
                        onClick={() =>
                          setOpenMenuId(openMenuId === p.id ? null : p.id)
                        }
                      >
                        ⋮
                      </button>

                      {openMenuId === p.id && (
                        <div className="action-menu">
                          <button onClick={() => handleViewProject(p)}>
                            View
                          </button>
                          <button onClick={() => openEditModal(p)}>Edit</button>
                          <button
                            className="danger"
                            onClick={() => handleDeleteProject(p.id)}
                          >
                            Delete
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="pagination-row">
              <div className="pagination-controls">
                <button
                  className="page-btn"
                  onClick={() => goToPage(currentPage - 1)}
                  disabled={currentPage === 1}
                >
                  ‹
                </button>

                {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
                  <button
                    key={n}
                    className={`page-btn ${currentPage === n ? "active" : ""}`}
                    onClick={() => goToPage(n)}
                  >
                    {n}
                  </button>
                ))}

                <button
                  className="page-btn"
                  onClick={() => goToPage(currentPage + 1)}
                  disabled={currentPage === totalPages}
                >
                  ›
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Add / Edit Project Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={closeModal}>
              ✕
            </button>

            <h2>{editingId !== null ? "Edit Project" : "New Project"}</h2>

            <div className="modal-form">
              <input
                type="text"
                placeholder="Project name *"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
              <input
                type="text"
                placeholder="Description"
                value={formData.desc}
                onChange={(e) => setFormData({ ...formData, desc: e.target.value })}
              />
              <input
                type="text"
                placeholder="Client *"
                value={formData.client}
                onChange={(e) => setFormData({ ...formData, client: e.target.value })}
              />

              <select
                value={formData.department}
                onChange={(e) => setFormData({ ...formData, department: e.target.value })}
              >
                <option>Design</option>
                <option>Development</option>
                <option>Marketing</option>
                <option>IT & Security</option>
              </select>

              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              >
                <option>In Progress</option>
                <option>Completed</option>
                <option>On Hold</option>
                <option>Overdue</option>
              </select>

              <input
                type="number"
                min="0"
                max="100"
                placeholder="Progress %"
                value={formData.progress}
                onChange={(e) =>
                  setFormData({ ...formData, progress: Number(e.target.value) })
                }
              />

              <input
                type="text"
                placeholder="Due date * (e.g. Jul 20, 2026)"
                value={formData.dueDate}
                onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
              />
            </div>

            <button className="modal-save-btn" onClick={handleSaveProject}>
              {editingId !== null ? "Save Changes" : "Create Project"}
            </button>
          </div>
        </div>
      )}

      {/* View Project Modal */}
      {viewingProject && (
        <div className="modal-overlay" onClick={() => setViewingProject(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setViewingProject(null)}>
              ✕
            </button>

            <h2>{viewingProject.name}</h2>
            <p className="modal-subtext">{viewingProject.desc}</p>

            <div className="view-details">
              <p><span>Client:</span>{viewingProject.client}</p>
              <p><span>Department:</span>{viewingProject.department}</p>
              <p><span>Status:</span>{viewingProject.status}</p>
              <p><span>Progress:</span>{viewingProject.progress}%</p>
              <p><span>Due date:</span>{viewingProject.dueDate}</p>
              <p><span>Time left:</span>{viewingProject.daysLeft}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
