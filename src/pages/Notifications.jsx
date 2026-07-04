import { useState, useEffect, useMemo, useRef } from "react";
import Sidebar from "../components/Sidebar";
import "./Notifications.css";

const initialNotifications = [
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
    category: "Updates",
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
    category: "Tasks",
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
    category: "Updates",
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
    category: "Updates",
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
    category: "Mentions",
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
    category: "Updates",
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
    category: "System",
  },
];

const tabs = ["All", "Unread", "Mentions", "Tasks", "System", "Updates"];
const PAGE_SIZE = 5;

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
  const [notifData, setNotifData] = useState(initialNotifications);
  const [activeTab, setActiveTab] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOrder, setSortOrder] = useState("newest");
  const [showFilterMenu, setShowFilterMenu] = useState(false);
  const [openMenuId, setOpenMenuId] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);

  const [settings, setSettings] = useState({
    email: true,
    inApp: true,
    tasks: true,
    mentions: true,
    system: true,
    marketing: false,
  });

  const [channels, setChannels] = useState({
    email: { label: "Email", detail: "email@example.com", enabled: true },
    sms: { label: "SMS", detail: "+212 6 12 34 56 78", enabled: true },
    push: { label: "Push Notifications", detail: "Enabled on this device", enabled: true },
  });

  const filterRef = useRef(null);
  const settingsCardRef = useRef(null);

  const toggleSetting = (key) =>
    setSettings((prev) => ({ ...prev, [key]: !prev[key] }));

  const toggleChannel = (key) =>
    setChannels((prev) => ({
      ...prev,
      [key]: { ...prev[key], enabled: !prev[key].enabled },
    }));

  const markAllAsRead = () =>
    setNotifData((prev) => prev.map((n) => ({ ...n, unread: false })));

  const toggleRead = (id) =>
    setNotifData((prev) =>
      prev.map((n) => (n.id === id ? { ...n, unread: !n.unread } : n))
    );

  const deleteNotification = (id) =>
    setNotifData((prev) => prev.filter((n) => n.id !== id));

  // Close open dropdowns when clicking outside
  useEffect(() => {
    function handleClickOutside(e) {
      if (!e.target.closest(".notif-more-wrapper")) setOpenMenuId(null);
      if (filterRef.current && !filterRef.current.contains(e.target)) {
        setShowFilterMenu(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Reset to page 1 whenever the visible set changes
  useEffect(() => {
    setCurrentPage(1);
  }, [activeTab, searchTerm, sortOrder]);

  const unreadCount = useMemo(
    () => notifData.filter((n) => n.unread).length,
    [notifData]
  );

  const filtered = useMemo(() => {
    let list = [...notifData];

    if (activeTab === "Unread") {
      list = list.filter((n) => n.unread);
    } else if (activeTab !== "All") {
      list = list.filter((n) => n.category === activeTab);
    }

    if (searchTerm.trim()) {
      const s = searchTerm.toLowerCase();
      list = list.filter(
        (n) =>
          n.title.toLowerCase().includes(s) || n.desc.toLowerCase().includes(s)
      );
    }

    if (sortOrder === "oldest") list.reverse();

    return list;
  }, [notifData, activeTab, searchTerm, sortOrder]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const safePage = Math.min(currentPage, totalPages);
  const startIdx = (safePage - 1) * PAGE_SIZE;
  const paginated = filtered.slice(startIdx, startIdx + PAGE_SIZE);

  const pageNumbers = useMemo(() => {
    const pages = [];
    for (let i = 1; i <= totalPages; i++) pages.push(i);
    return pages;
  }, [totalPages]);

  function scrollToSettings() {
    settingsCardRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  function resetFilters() {
    setActiveTab("All");
    setSearchTerm("");
    setSortOrder("newest");
    setCurrentPage(1);
  }

  return (
    <div className="dashboard">
      <Sidebar />

      <main className="main-content">
        <div className="notif-root">
          {/* Header */}
          <header className="notif-header">
            <div className="notif-header-left">
              <h1 className="notif-title">Notifications</h1>
              <p className="notif-subtitle">
                Stay updated with what's happening in your business.
              </p>
            </div>
            <div className="notif-header-right">
              <div className="notif-search">
                <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="#888" strokeWidth="2">
                  <circle cx="11" cy="11" r="8" />
                  <path d="M21 21l-4.35-4.35" />
                </svg>
                <input
                  placeholder="Search notifications..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              <button
                className="notif-icon-btn"
                title="Notification preferences"
                onClick={scrollToSettings}
              >
                <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="#aaa" strokeWidth="2">
                  <circle cx="12" cy="12" r="3" />
                  <path d="M19.07 4.93A10 10 0 1 1 4.93 19.07 10 10 0 0 1 19.07 4.93z" />
                </svg>
              </button>

              <button
                className="notif-icon-btn notif-bell-btn"
                title="Show unread"
                onClick={() => setActiveTab("Unread")}
              >
                <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="#aaa" strokeWidth="2">
                  <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
                  <path d="M13.73 21a2 2 0 0 1-3.46 0" />
                </svg>
                {unreadCount > 0 && (
                  <span className="notif-badge-dot">{unreadCount}</span>
                )}
              </button>

              <button
                className="notif-mark-btn"
                onClick={markAllAsRead}
                disabled={unreadCount === 0}
                style={unreadCount === 0 ? { opacity: 0.5, cursor: "default" } : undefined}
              >
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
                      {tab === "Unread" && unreadCount > 0 && (
                        <span className="notif-tab-count">{unreadCount}</span>
                      )}
                    </button>
                  ))}
                </div>

                <div className="notif-filter-wrapper" ref={filterRef}>
                  <button
                    className="notif-filter-btn"
                    onClick={() => setShowFilterMenu((v) => !v)}
                  >
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

                  {showFilterMenu && (
                    <div className="notif-filter-menu">
                      <span className="notif-filter-menu-label">Sort by</span>
                      <button
                        className={`notif-filter-option ${sortOrder === "newest" ? "active" : ""}`}
                        onClick={() => {
                          setSortOrder("newest");
                          setShowFilterMenu(false);
                        }}
                      >
                        Newest first
                      </button>
                      <button
                        className={`notif-filter-option ${sortOrder === "oldest" ? "active" : ""}`}
                        onClick={() => {
                          setSortOrder("oldest");
                          setShowFilterMenu(false);
                        }}
                      >
                        Oldest first
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* List */}
              <div className="notif-list">
                {paginated.length === 0 ? (
                  <p className="notif-empty-state">
                    No notifications match your search.
                  </p>
                ) : (
                  paginated.map((n) => (
                    <div
                      key={n.id}
                      className={`notif-item ${n.unread ? "unread" : ""}`}
                      onClick={() => toggleRead(n.id)}
                    >
                      <IconShape type={n.icon} bg={n.iconBg} />
                      <div className="notif-content">
                        <p className="notif-item-title">{n.title}</p>
                        <p className="notif-item-desc">{n.desc}</p>
                        <span className="notif-item-time">{n.time}</span>
                      </div>
                      <div
                        className="notif-item-right"
                        onClick={(e) => e.stopPropagation()}
                      >
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

                        <div className="notif-more-wrapper">
                          <button
                            className="notif-more-btn"
                            onClick={() =>
                              setOpenMenuId((prev) => (prev === n.id ? null : n.id))
                            }
                          >
                            <svg width="16" height="16" fill="#888" viewBox="0 0 24 24">
                              <circle cx="5" cy="12" r="1.5" />
                              <circle cx="12" cy="12" r="1.5" />
                              <circle cx="19" cy="12" r="1.5" />
                            </svg>
                          </button>

                          {openMenuId === n.id && (
                            <div className="notif-more-menu">
                              <button
                                onClick={() => {
                                  toggleRead(n.id);
                                  setOpenMenuId(null);
                                }}
                              >
                                Mark as {n.unread ? "read" : "unread"}
                              </button>
                              <button
                                className="danger"
                                onClick={() => {
                                  deleteNotification(n.id);
                                  setOpenMenuId(null);
                                }}
                              >
                                Delete
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Pagination */}
              <div className="notif-pagination">
                <span className="notif-pag-info">
                  {filtered.length === 0
                    ? "No notifications"
                    : `Showing ${startIdx + 1} to ${Math.min(
                        startIdx + PAGE_SIZE,
                        filtered.length
                      )} of ${filtered.length} notifications`}
                </span>
                <div className="notif-pag-controls">
                  <button
                    className="notif-pag-btn"
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    disabled={safePage === 1}
                  >
                    <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                      <path d="M15 18l-6-6 6-6" />
                    </svg>
                  </button>
                  {pageNumbers.map((p) => (
                    <button
                      key={p}
                      className={`notif-pag-btn ${safePage === p ? "active" : ""}`}
                      onClick={() => setCurrentPage(p)}
                    >
                      {p}
                    </button>
                  ))}
                  <button
                    className="notif-pag-btn"
                    onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                    disabled={safePage === totalPages}
                  >
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
              <section className="notif-sidebar-card" ref={settingsCardRef}>
                <h2 className="notif-sidebar-title">Notification Settings</h2>
                <p className="notif-sidebar-sub">Manage how you receive notifications</p>
                <div className="notif-settings-list">
                  {[
                    { key: "email", label: "Email Notifications", desc: "Receive notifications via email" },
                    { key: "inApp", label: "In-App Notifications", desc: "Show notifications in the app" },
                    { key: "tasks", label: "Task Reminders", desc: "Reminders for tasks and deadlines" },
                    { key: "mentions", label: "Mentions & Comments", desc: "Notify me when I'm mentioned" },
                    { key: "system", label: "System Updates", desc: "Important system announcements" },
                    { key: "marketing", label: "Marketing & Tips", desc: "Receive tips and product updates" },
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
                  {Object.entries(channels).map(([key, ch]) => (
                    <div key={key} className="notif-channel-row">
                      <div className="notif-channel-info">
                        <span className="notif-channel-label">{ch.label}</span>
                        <span className="notif-channel-detail">{ch.detail}</span>
                      </div>
                      <div className="notif-channel-right">
                        <span
                          className="notif-channel-status"
                          style={{ color: ch.enabled ? "#00B894" : "#7777A0" }}
                        >
                          {ch.enabled ? (key === "push" ? "Enabled" : "Verified") : "Disabled"}
                        </span>
                        <button
                          className="notif-channel-chevron"
                          onClick={() => toggleChannel(key)}
                          title={ch.enabled ? "Disable" : "Enable"}
                        >
                          <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="#555" strokeWidth="2">
                            <path d="M9 18l6-6-6-6" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              {/* Quick Actions */}
              <section className="notif-sidebar-card">
                <h2 className="notif-sidebar-title">Quick Actions</h2>
                <div className="notif-actions-list">
                  <button className="notif-action-row" onClick={resetFilters}>
                    <svg width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="#888" strokeWidth="2">
                      <circle cx="12" cy="12" r="9" />
                      <path d="M12 6v6l4 2" />
                    </svg>
                    <span>View All Activity</span>
                    <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="#555" strokeWidth="2" style={{ marginLeft: "auto" }}>
                      <path d="M9 18l6-6-6-6" />
                    </svg>
                  </button>
                  <button className="notif-action-row" onClick={scrollToSettings}>
                    <svg width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="#888" strokeWidth="2">
                      <circle cx="12" cy="12" r="9" />
                      <path d="M12 6v6l4 2" />
                    </svg>
                    <span>Notification Preferences</span>
                    <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="#555" strokeWidth="2" style={{ marginLeft: "auto" }}>
                      <path d="M9 18l6-6-6-6" />
                    </svg>
                  </button>
                </div>
              </section>
            </aside>
          </div>
        </div>
      </main>
    </div>
  );
}
