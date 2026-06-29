import { useState } from "react";
import Sidebar from "../components/Sidebar";
import "./Notifications.css";

const notifications = [
  {
    id: 1,
    icon: "briefcase",
    iconBg: "#6C5CE7",
    title: 'New project "Eternis Website" has been created',
    desc: "The project has been created by Sarah Johnson",
    time: "10 min ago",
    avatar: "https://i.pravatar.cc/40?img=5",
    badge: null,
    unread: true,
  },
  {
    id: 2,
    icon: "task",
    iconBg: "#0984E3",
    title: 'Task "Design homepage" is due tomorrow',
    desc: "Don't forget to complete this task",
    time: "1 hour ago",
    badge: { label: "Due Tomorrow", color: "#2D2D4E", text: "#E0C97A" },
    unread: true,
  },
  {
    id: 3,
    icon: "client",
    iconBg: "#00B894",
    title: 'New client "TechNova Inc." has been added',
    desc: "Client has been added by Michael Brown",
    time: "3 hours ago",
    initials: "TN",
    initialsColor: "#0984E3",
    badge: null,
    unread: true,
  },
  {
    id: 4,
    icon: "invoice",
    iconBg: "#E67E22",
    title: "Invoice #INV-2024-0456 has been paid",
    desc: "Amount of $2,450.00 was paid by TechNova Inc.",
    time: "5 hours ago",
    badge: { label: "Paid", color: "#1B3A2D", text: "#00B894" },
    unread: false,
  },
  {
    id: 5,
    icon: "message",
    iconBg: "#6C5CE7",
    title: "You have a new message from Sarah Johnson",
    desc: '"Can we reschedule the meeting to 3 PM?"',
    time: "Yesterday, 4:30 PM",
    avatar: "https://i.pravatar.cc/40?img=5",
    badge: null,
    unread: true,
  },
  {
    id: 6,
    icon: "report",
    iconBg: "#0984E3",
    title: "Monthly report is ready",
    desc: "Your business report for April 2024 is ready to view",
    time: "Yesterday, 2:15 PM",
    pdfThumb: true,
    badge: null,
    unread: false,
  },
  {
    id: 7,
    icon: "security",
    iconBg: "#E74C3C",
    title: "Security alert",
    desc: "New login detected from Chrome on Windows",
    time: "May 12, 2024 at 9:10 PM",
    badge: { label: "Important", color: "#3A1A1A", text: "#E74C3C" },
    unread: false,
  },
];

const tabs = ["All", "Unread", "Mentions", "Tasks", "System", "Updates"];

const IconShape = ({ type, bg }) => {
  const icons = {
    briefcase: (
      <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="#fff" strokeWidth="2">
        <rect x="2" y="7" width="20" height="14" rx="2" />
        <path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2" />
      </svg>
    ),
    task: (
      <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="#fff" strokeWidth="2">
        <rect x="3" y="3" width="18" height="18" rx="2" />
        <path d="M9 12l2 2 4-4" />
      </svg>
    ),
    client: (
      <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="#fff" strokeWidth="2">
        <circle cx="12" cy="8" r="4" />
        <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
        <path d="M19 8l2 2 4-4" />
      </svg>
    ),
    invoice: (
      <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="#fff" strokeWidth="2">
        <circle cx="12" cy="12" r="9" />
        <path d="M12 6v6l4 2" />
      </svg>
    ),
    message: (
      <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="#fff" strokeWidth="2">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
      </svg>
    ),
    report: (
      <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="#fff" strokeWidth="2">
        <line x1="18" y1="20" x2="18" y2="10" />
        <line x1="12" y1="20" x2="12" y2="4" />
        <line x1="6" y1="20" x2="6" y2="14" />
      </svg>
    ),
    security: (
      <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="#fff" strokeWidth="2">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      </svg>
    ),
  };
  return (
    <div className="notif-icon" style={{ background: bg }}>
      {icons[type]}
    </div>
  );
};

export default function Notifications() {
  const [activeTab, setActiveTab] = useState("All");
  const [settings, setSettings] = useState({
    email: true,
    inApp: true,
    tasks: true,
    mentions: true,
    system: true,
    marketing: false,
  });
  const [currentPage, setCurrentPage] = useState(1);

  const toggleSetting = (key) =>
    setSettings((prev) => ({ ...prev, [key]: !prev[key] }));

  const filtered =
    activeTab === "Unread"
      ? notifications.filter((n) => n.unread)
      : notifications;

  return (
  <div className="dashboard">
    <Sidebar />

    <main className="main-content">
      <div className="notif-root">
      {/* Header */}
      <header className="notif-header">
        <div className="notif-header-left">
          <h1 className="notif-title">Notifications</h1>
          <p className="notif-subtitle">Stay updated with what's happening in your business.</p>
        </div>
        <div className="notif-header-right">
          <div className="notif-search">
            <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="#888" strokeWidth="2">
              <circle cx="11" cy="11" r="8" />
              <path d="M21 21l-4.35-4.35" />
            </svg>
            <input placeholder="Search notifications..." />
          </div>
          <button className="notif-icon-btn">
            <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="#aaa" strokeWidth="2">
              <circle cx="12" cy="12" r="3" />
              <path d="M19.07 4.93A10 10 0 1 1 4.93 19.07 10 10 0 0 1 19.07 4.93z" />
            </svg>
          </button>
          <button className="notif-icon-btn notif-bell-btn">
            <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="#aaa" strokeWidth="2">
              <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
              <path d="M13.73 21a2 2 0 0 1-3.46 0" />
            </svg>
            <span className="notif-badge-dot">7</span>
          </button>
          <button className="notif-mark-btn">
            <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="#fff" strokeWidth="2.5">
              <path d="M20 6L9 17l-5-5" />
            </svg>
            Mark all as read
          </button>
        </div>
      </header>

      <div className="notif-body">
        {/* Main Panel */}
        <main className="notif-main">
          {/* Tabs */}
          <div className="notif-tabs">
            <div className="notif-tabs-list">
              {tabs.map((tab) => (
                <button
                  key={tab}
                  className={`notif-tab ${activeTab === tab ? "active" : ""}`}
                  onClick={() => setActiveTab(tab)}
                >
                  {tab}
                  {tab === "Unread" && (
                    <span className="notif-tab-count">7</span>
                  )}
                </button>
              ))}
            </div>
            <button className="notif-filter-btn">
              <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <line x1="4" y1="6" x2="20" y2="6" />
                <line x1="8" y1="12" x2="16" y2="12" />
                <line x1="11" y1="18" x2="13" y2="18" />
              </svg>
              Filter
              <svg width="12" height="12" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path d="M6 9l6 6 6-6" />
              </svg>
            </button>
          </div>

          {/* List */}
          <div className="notif-list">
            {filtered.map((n) => (
              <div key={n.id} className={`notif-item ${n.unread ? "unread" : ""}`}>
                <IconShape type={n.icon} bg={n.iconBg} />
                <div className="notif-content">
                  <p className="notif-item-title">{n.title}</p>
                  <p className="notif-item-desc">{n.desc}</p>
                  <span className="notif-item-time">{n.time}</span>
                </div>
                <div className="notif-item-right">
                  {n.avatar && (
                    <img src={n.avatar} alt="avatar" className="notif-avatar" />
                  )}
                  {n.initials && (
                    <div
                      className="notif-initials"
                      style={{ background: n.initialsColor }}
                    >
                      {n.initials}
                    </div>
                  )}
                  {n.pdfThumb && (
                    <div className="notif-pdf">
                      <svg width="28" height="28" fill="none" viewBox="0 0 24 24">
                        <rect x="3" y="2" width="14" height="18" rx="2" fill="#2D2D4E" />
                        <path d="M7 14H13M7 10H13M7 6H10" stroke="#888" strokeWidth="1.5" />
                        <rect x="10" y="13" width="9" height="7" rx="1" fill="#E74C3C" />
                        <text x="11.5" y="19" fontSize="4" fill="#fff" fontWeight="bold">PDF</text>
                      </svg>
                    </div>
                  )}
                  {n.badge && (
                    <span
                      className="notif-badge"
                      style={{ background: n.badge.color, color: n.badge.text }}
                    >
                      {n.badge.label}
                    </span>
                  )}
                  {n.unread && <span className="notif-unread-dot" />}
                  <button className="notif-more-btn">
                    <svg width="16" height="16" fill="#888" viewBox="0 0 24 24">
                      <circle cx="5" cy="12" r="1.5" />
                      <circle cx="12" cy="12" r="1.5" />
                      <circle cx="19" cy="12" r="1.5" />
                    </svg>
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          <div className="notif-pagination">
            <span className="notif-pag-info">Showing 1 to 7 of 24 notifications</span>
            <div className="notif-pag-controls">
              <button className="notif-pag-btn" onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}>
                <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path d="M15 18l-6-6 6-6" />
                </svg>
              </button>
              {[1, 2, 3, "...", 4].map((p, i) => (
                <button
                  key={i}
                  className={`notif-pag-btn ${currentPage === p ? "active" : ""}`}
                  onClick={() => typeof p === "number" && setCurrentPage(p)}
                >
                  {p}
                </button>
              ))}
              <button className="notif-pag-btn" onClick={() => setCurrentPage((p) => Math.min(4, p + 1))}>
                <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path d="M9 18l6-6-6-6" />
                </svg>
              </button>
            </div>
          </div>
        </main>

        {/* Sidebar */}
        <aside className="notif-sidebar">
          {/* Settings */}
          <section className="notif-sidebar-card">
            <h2 className="notif-sidebar-title">Notification Settings</h2>
            <p className="notif-sidebar-sub">Manage how you receive notifications</p>
            <div className="notif-settings-list">
              {[
                { key: "email", icon: "✉️", label: "Email Notifications", desc: "Receive notifications via email" },
                { key: "inApp", icon: "⚙️", label: "In-App Notifications", desc: "Show notifications in the app" },
                { key: "tasks", icon: "🔔", label: "Task Reminders", desc: "Reminders for tasks and deadlines" },
                { key: "mentions", icon: "🛡️", label: "Mentions & Comments", desc: "Notify me when I'm mentioned" },
                { key: "system", icon: "💬", label: "System Updates", desc: "Important system announcements" },
                { key: "marketing", icon: "📢", label: "Marketing & Tips", desc: "Receive tips and product updates" },
              ].map(({ key, label, desc }) => (
                <div key={key} className="notif-setting-row">
                  <div className="notif-setting-info">
                    <span className="notif-setting-label">{label}</span>
                    <span className="notif-setting-desc">{desc}</span>
                  </div>
                  <button
                    className={`notif-toggle ${settings[key] ? "on" : ""}`}
                    onClick={() => toggleSetting(key)}
                  >
                    <span className="notif-toggle-thumb" />
                  </button>
                </div>
              ))}
            </div>
          </section>

          {/* Channels */}
          <section className="notif-sidebar-card">
            <h2 className="notif-sidebar-title">Notification Channels</h2>
            <div className="notif-channels-list">
              {[
                { label: "Email", detail: "email@example.com", status: "Verified", color: "#00B894" },
                { label: "SMS", detail: "+212 6 12 34 56 78", status: "Verified", color: "#00B894" },
                { label: "Push Notifications", detail: "Enabled on this device", status: "Enabled", color: "#0984E3" },
              ].map(({ label, detail, status, color }) => (
                <div key={label} className="notif-channel-row">
                  <div className="notif-channel-info">
                    <span className="notif-channel-label">{label}</span>
                    <span className="notif-channel-detail">{detail}</span>
                  </div>
                  <div className="notif-channel-right">
                    <span className="notif-channel-status" style={{ color }}>{status}</span>
                    <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="#555" strokeWidth="2">
                      <path d="M9 18l6-6-6-6" />
                    </svg>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Quick Actions */}
          <section className="notif-sidebar-card">
            <h2 className="notif-sidebar-title">Quick Actions</h2>
            <div className="notif-actions-list">
              {["View All Activity", "Notification Preferences"].map((label) => (
                <button key={label} className="notif-action-row">
                  <svg width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="#888" strokeWidth="2">
                    <circle cx="12" cy="12" r="9" />
                    <path d="M12 6v6l4 2" />
                  </svg>
                  <span>{label}</span>
                  <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="#555" strokeWidth="2" style={{ marginLeft: "auto" }}>
                    <path d="M9 18l6-6-6-6" />
                  </svg>
                </button>
              ))}
            </div>
          </section>
          </aside>
      </div> {/* notif-body */}

      </div> {/* notif-root */}
    </main>
  </div>
);
}
