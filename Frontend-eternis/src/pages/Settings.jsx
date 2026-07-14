import { useState, useRef, useEffect, useMemo } from "react";
import "./Settings.css";
import Sidebar from "../components/Sidebar";
import {
  FaCog,
  FaUser,
  FaUserShield,
  FaBell,
  FaPalette,
  FaGlobe,
  FaPuzzlePiece,
  FaCreditCard,
  FaUsers,
  FaCloud,
  FaHistory,
  FaSearch,
  FaSun,
  FaMoon,
  FaTimes,
} from "react-icons/fa";

const ACCENTS = ["#8b5cf6", "#3b82f6", "#22c55e", "#ef4444"];

function Settings() {
  // ---------- refs for scroll-to-section ----------
  const generalRef = useRef(null);
  const notifRef = useRef(null);
  const profileRef = useRef(null);
  const securityRef = useRef(null);
  const appearanceRef = useRef(null);
  const languageRef = useRef(null);
  const integrationsRef = useRef(null);
  const billingRef = useRef(null);
  const rolesRef = useRef(null);
  const backupsRef = useRef(null);
  const activityRef = useRef(null);
  const accountRef = useRef(null);
  const logoInputRef = useRef(null);
  const bellRef = useRef(null);

  const menuItems = [
    { key: "general", label: "General", icon: FaCog, ref: generalRef },
    { key: "profile", label: "Profile", icon: FaUser, ref: profileRef },
    { key: "account", label: "Account", icon: FaUserShield, ref: accountRef },
    { key: "security", label: "Security", icon: FaUserShield, ref: securityRef },
    { key: "notifications", label: "Notifications", icon: FaBell, ref: notifRef },
    { key: "appearance", label: "Appearance", icon: FaPalette, ref: appearanceRef },
    { key: "language", label: "Language & Region", icon: FaGlobe, ref: languageRef },
    { key: "integrations", label: "Integrations", icon: FaPuzzlePiece, ref: integrationsRef },
    { key: "billing", label: "Billing", icon: FaCreditCard, ref: billingRef },
    { key: "roles", label: "Roles & Permissions", icon: FaUsers, ref: rolesRef },
    { key: "backups", label: "Backups", icon: FaCloud, ref: backupsRef },
    { key: "activity", label: "Activity Log", icon: FaHistory, ref: activityRef },
  ];

  // ---------- top-level state ----------
  const [searchTerm, setSearchTerm] = useState("");
  const [activeMenu, setActiveMenu] = useState("general");
  const [toast, setToast] = useState(null);
  const [showBellDropdown, setShowBellDropdown] = useState(false);

  const [company, setCompany] = useState({
    name: "Eternis Solutions",
    email: "contact@eternis.com",
    phone: "+212 612 345 678",
    timezone: "(GMT+01:00) Casablanca",
    dateFormat: "DD/MM/YYYY",
    currency: "MAD (Moroccan Dirham)",
  });
  const [logo, setLogo] = useState(null);

  const [notifPrefs, setNotifPrefs] = useState({
    email: true,
    inApp: true,
    sms: false,
    tasks: true,
  });

  const [profile, setProfile] = useState({
    firstName: "Youssef",
    lastName: "El Amrani",
    email: "youssef@eternis.com",
    jobTitle: "Administrator",
    avatar: "https://i.pravatar.cc/150?img=12",
  });

  const [security, setSecurity] = useState({
    twoFactor: false,
    lastPasswordChange: "30 days ago",
  });
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [passwordForm, setPasswordForm] = useState({ current: "", next: "", confirm: "" });
  const [showSessionsModal, setShowSessionsModal] = useState(false);
  const [sessions, setSessions] = useState([
    { id: 1, device: "Chrome on Windows", location: "Casablanca, MA", current: true },
    { id: 2, device: "Safari on iPhone", location: "Tangier, MA", current: false },
    { id: 3, device: "Firefox on macOS", location: "Rabat, MA", current: false },
  ]);

  const [themeChoice, setThemeChoice] = useState("dark"); // dark | light | system
  const [accent, setAccent] = useState(ACCENTS[0]);

  const [integrations, setIntegrations] = useState({
    google: true,
    slack: false,
    github: false,
  });

  const [roles, setRoles] = useState([
    { id: 1, name: "Administrator" },
    { id: 2, name: "Manager" },
    { id: 3, name: "Employee" },
  ]);
  const [editingRoleId, setEditingRoleId] = useState(null);
  const [roleDraft, setRoleDraft] = useState("");

  const [activityLog, setActivityLog] = useState([
    { id: 1, action: "Password changed", time: "2 hours ago" },
    { id: 2, action: "Added new employee", time: "Yesterday" },
    { id: 3, action: "Project updated", time: "2 days ago" },
  ]);

  const [langPrefs, setLangPrefs] = useState({
    language: "English (US)",
    region: "Morocco",
    timeFormat: "24 Hours",
  });

  const [accountPrefs, setAccountPrefs] = useState({
    publicProfile: true,
    emailVisibility: false,
  });
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteConfirmText, setDeleteConfirmText] = useState("");

  // ---------- helpers ----------
  function showToast(message) {
    setToast(message);
    setTimeout(() => setToast(null), 2500);
  }

  function addLog(action) {
    setActivityLog((prev) => [{ id: Date.now(), action, time: "Just now" }, ...prev]);
  }

  const appliedTheme = useMemo(() => {
    if (themeChoice !== "system") return themeChoice;
    if (typeof window !== "undefined" && window.matchMedia) {
      return window.matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark";
    }
    return "dark";
  }, [themeChoice]);

  // Close bell dropdown on outside click
  useEffect(() => {
    function handleClick(e) {
      if (bellRef.current && !bellRef.current.contains(e.target)) {
        setShowBellDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  function handleMenuClick(item) {
    setActiveMenu(item.key);
    item.ref.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  const filteredKeys = useMemo(() => {
    if (!searchTerm.trim()) return null; // null = show everything
    const s = searchTerm.toLowerCase();
    return menuItems.filter((m) => m.label.toLowerCase().includes(s)).map((m) => m.key);
  }, [searchTerm]);

  function isVisible(key) {
    return filteredKeys === null || filteredKeys.includes(key);
  }

  function handleLogoChange(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      setLogo(reader.result);
      addLog("Business logo updated");
      showToast("Logo updated");
    };
    reader.readAsDataURL(file);
  }

  function handleSaveChanges() {
    addLog("Settings saved");
    showToast("All changes saved!");
  }

  function handlePasswordSubmit(e) {
    e.preventDefault();
    if (passwordForm.next.length < 6) {
      showToast("New password must be at least 6 characters");
      return;
    }
    if (passwordForm.next !== passwordForm.confirm) {
      showToast("Passwords do not match");
      return;
    }
    setSecurity((prev) => ({ ...prev, lastPasswordChange: "Just now" }));
    addLog("Password changed");
    showToast("Password updated");
    setPasswordForm({ current: "", next: "", confirm: "" });
    setShowPasswordModal(false);
  }

  function logOutSession(id) {
    setSessions((prev) => prev.filter((s) => s.id !== id));
    addLog("Logged out a session");
  }

  function toggleIntegration(key, label) {
    setIntegrations((prev) => {
      const next = { ...prev, [key]: !prev[key] };
      addLog(`${label} ${next[key] ? "connected" : "disconnected"}`);
      showToast(`${label} ${next[key] ? "connected" : "disconnected"}`);
      return next;
    });
  }

  function startEditRole(role) {
    setEditingRoleId(role.id);
    setRoleDraft(role.name);
  }

  function saveRoleEdit(id) {
    setRoles((prev) =>
      prev.map((r) => (r.id === id ? { ...r, name: roleDraft.trim() || r.name } : r))
    );
    addLog(`Role updated: ${roleDraft.trim()}`);
    setEditingRoleId(null);
  }

  function createBackup() {
    addLog("Backup created");
    showToast("Backup created successfully");
  }

  function restoreBackup() {
    addLog("Backup restored");
    showToast("Restored from latest backup");
  }

  function handleDeleteAccount() {
    if (deleteConfirmText !== "DELETE") return;
    addLog("Account deletion requested");
    showToast("Account deletion requested");
    setShowDeleteModal(false);
    setDeleteConfirmText("");
  }

  return (
    <div className="dashboard" data-theme={appliedTheme} style={{ "--accent": accent }}>
      <Sidebar />

      <main className="main-content">
        {/* HEADER */}
        <div className="settings-header">
          <div>
            <h1>Settings</h1>
            <p>Manage your profile, preferences and system configuration.</p>
          </div>

          <div className="header-actions">
            <div className="search-box">
              <FaSearch />
              <input
                type="text"
                placeholder="Search settings..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div className="bell-wrapper" ref={bellRef}>
              <button
                className="icon-btn"
                onClick={() => setShowBellDropdown((v) => !v)}
              >
                <FaBell />
                {activityLog.length > 0 && (
                  <span className="notif-badge">{Math.min(activityLog.length, 9)}</span>
                )}
              </button>

              {showBellDropdown && (
                <div className="bell-dropdown">
                  <h4>Recent Activity</h4>
                  {activityLog.slice(0, 4).map((log) => (
                    <div className="bell-dropdown-item" key={log.id}>
                      <span>{log.action}</span>
                      <small>{log.time}</small>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <button
              className="icon-btn"
              title="Toggle theme"
              onClick={() =>
                setThemeChoice((prev) => (appliedTheme === "dark" ? "light" : "dark"))
              }
            >
              {appliedTheme === "dark" ? <FaSun /> : <FaMoon />}
            </button>

            <button className="save-btn" onClick={handleSaveChanges}>
              Save Changes
            </button>
          </div>
        </div>

        {/* SETTINGS LAYOUT */}
        <div className="settings-layout">
          {/* LEFT MENU */}
          <div className="settings-menu">
            {menuItems.map((item) => (
              <div
                key={item.key}
                className={`menu-item ${activeMenu === item.key ? "active" : ""}`}
                onClick={() => handleMenuClick(item)}
              >
                <item.icon />
                <span>{item.label}</span>
              </div>
            ))}
          </div>

          {/* RIGHT SIDE */}
          <div className="settings-content">
            {/* GENERAL SETTINGS */}
            {isVisible("general") && (
              <div className="settings-card" ref={generalRef}>
                <h2>General Settings</h2>
                <p>Configure basic information and preferences.</p>

                <div className="field">
                  <label>Company Name</label>
                  <input
                    type="text"
                    value={company.name}
                    onChange={(e) => setCompany({ ...company, name: e.target.value })}
                  />
                </div>

                <div className="field">
                  <label>Company Email</label>
                  <input
                    type="email"
                    value={company.email}
                    onChange={(e) => setCompany({ ...company, email: e.target.value })}
                  />
                </div>

                <div className="field">
                  <label>Company Phone</label>
                  <input
                    type="text"
                    value={company.phone}
                    onChange={(e) => setCompany({ ...company, phone: e.target.value })}
                  />
                </div>

                <div className="double-field">
                  <div className="field">
                    <label>Time Zone</label>
                    <select
                      value={company.timezone}
                      onChange={(e) => setCompany({ ...company, timezone: e.target.value })}
                    >
                      <option>(GMT+01:00) Casablanca</option>
                      <option>(GMT+00:00) London</option>
                      <option>(GMT+01:00) Paris</option>
                      <option>(GMT-05:00) New York</option>
                    </select>
                  </div>

                  <div className="field">
                    <label>Date Format</label>
                    <select
                      value={company.dateFormat}
                      onChange={(e) => setCompany({ ...company, dateFormat: e.target.value })}
                    >
                      <option>DD/MM/YYYY</option>
                      <option>MM/DD/YYYY</option>
                      <option>YYYY-MM-DD</option>
                    </select>
                  </div>
                </div>

                <div className="field">
                  <label>Currency</label>
                  <select
                    value={company.currency}
                    onChange={(e) => setCompany({ ...company, currency: e.target.value })}
                  >
                    <option>MAD (Moroccan Dirham)</option>
                    <option>EUR (Euro)</option>
                    <option>USD (US Dollar)</option>
                  </select>
                </div>

                <div className="field">
                  <label>Business Logo</label>
                  <div className="logo-upload">
                    <div className="logo-box">
                      {logo ? (
                        <img src={logo} alt="logo" />
                      ) : (
                        company.name.charAt(0).toUpperCase()
                      )}
                    </div>
                    <div>
                      <input
                        type="file"
                        accept="image/png, image/jpeg"
                        ref={logoInputRef}
                        style={{ display: "none" }}
                        onChange={handleLogoChange}
                      />
                      <button
                        className="change-btn"
                        onClick={() => logoInputRef.current?.click()}
                      >
                        Change Logo
                      </button>
                      <p>PNG or JPG (max. 2MB)</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* NOTIFICATIONS */}
            {isVisible("notifications") && (
              <div className="settings-card" ref={notifRef}>
                <h2>Notification Preferences</h2>
                <p>Choose how you want to be notified.</p>

                {[
                  { key: "email", icon: "📧", label: "Email Notifications", desc: "Receive email updates and alerts." },
                  { key: "inApp", icon: "🔔", label: "In-App Notifications", desc: "Show notifications inside the application." },
                  { key: "sms", icon: "💬", label: "SMS Notifications", desc: "Receive important SMS updates." },
                  { key: "tasks", icon: "📅", label: "Task Reminders", desc: "Get reminders for tasks and deadlines." },
                ].map((item) => (
                  <div className="notification-row" key={item.key}>
                    <div>
                      <h4>
                        {item.icon} {item.label}
                      </h4>
                      <span>{item.desc}</span>
                    </div>
                    <label className="switch">
                      <input
                        type="checkbox"
                        checked={notifPrefs[item.key]}
                        onChange={() =>
                          setNotifPrefs((prev) => ({ ...prev, [item.key]: !prev[item.key] }))
                        }
                      />
                      <span></span>
                    </label>
                  </div>
                ))}
              </div>
            )}

            {/* PROFILE */}
            {isVisible("profile") && (
              <div className="settings-card" ref={profileRef}>
                <h2>Profile Information</h2>
                <p>Update your personal information and profile picture.</p>

                <div className="profile-section">
                  <div className="profile-avatar">
                    <img src={profile.avatar} alt="" />
                    <label className="camera-btn">
                      📷
                      <input
                        type="file"
                        accept="image/*"
                        style={{ display: "none" }}
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (!file) return;
                          const reader = new FileReader();
                          reader.onload = () =>
                            setProfile((prev) => ({ ...prev, avatar: reader.result }));
                          reader.readAsDataURL(file);
                        }}
                      />
                    </label>
                  </div>
                </div>

                <div className="double-field">
                  <div className="field">
                    <label>First Name</label>
                    <input
                      type="text"
                      value={profile.firstName}
                      onChange={(e) => setProfile({ ...profile, firstName: e.target.value })}
                    />
                  </div>
                  <div className="field">
                    <label>Last Name</label>
                    <input
                      type="text"
                      value={profile.lastName}
                      onChange={(e) => setProfile({ ...profile, lastName: e.target.value })}
                    />
                  </div>
                </div>

                <div className="field">
                  <label>Email Address</label>
                  <input
                    type="email"
                    value={profile.email}
                    onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                  />
                </div>

                <div className="field">
                  <label>Job Title</label>
                  <input
                    type="text"
                    value={profile.jobTitle}
                    onChange={(e) => setProfile({ ...profile, jobTitle: e.target.value })}
                  />
                </div>

                <button
                  className="primary-btn"
                  onClick={() => {
                    addLog("Profile updated");
                    showToast("Profile updated");
                  }}
                >
                  Update Profile
                </button>
              </div>
            )}

            {/* SECURITY */}
            {isVisible("security") && (
              <div className="settings-card" ref={securityRef}>
                <h2>Security</h2>
                <p>Manage your password and account security.</p>

                <div className="security-row">
                  <div>
                    <h4>Password</h4>
                    <span>Last changed {security.lastPasswordChange}</span>
                  </div>
                  <button className="primary-btn" onClick={() => setShowPasswordModal(true)}>
                    Change Password
                  </button>
                </div>

                <div className="security-row">
                  <div>
                    <h4>Two-Factor Authentication</h4>
                    <span>Add an extra layer of security.</span>
                  </div>
                  <label className="switch">
                    <input
                      type="checkbox"
                      checked={security.twoFactor}
                      onChange={() => {
                        setSecurity((prev) => ({ ...prev, twoFactor: !prev.twoFactor }));
                        addLog(`Two-factor authentication ${security.twoFactor ? "disabled" : "enabled"}`);
                      }}
                    />
                    <span></span>
                  </label>
                </div>

                <div className="security-row">
                  <div>
                    <h4>Active Sessions</h4>
                    <span>Manage your active sessions.</span>
                  </div>
                  <button className="secondary-btn" onClick={() => setShowSessionsModal(true)}>
                    View Sessions
                  </button>
                </div>
              </div>
            )}

            {/* APPEARANCE */}
            {isVisible("appearance") && (
              <div className="settings-card" ref={appearanceRef}>
                <h2>Appearance</h2>
                <p>Customize the look and feel of the application.</p>

                <div className="theme-grid">
                  <button
                    className={`theme-card ${themeChoice === "dark" ? "active" : ""}`}
                    onClick={() => setThemeChoice("dark")}
                  >
                    🌙 Dark
                  </button>
                  <button
                    className={`theme-card ${themeChoice === "light" ? "active" : ""}`}
                    onClick={() => setThemeChoice("light")}
                  >
                    ☀️ Light
                  </button>
                  <button
                    className={`theme-card ${themeChoice === "system" ? "active" : ""}`}
                    onClick={() => setThemeChoice("system")}
                  >
                    💻 System
                  </button>
                </div>

                <div className="field">
                  <label>Accent Color</label>
                  <div className="colors">
                    {ACCENTS.map((c) => (
                      <span
                        key={c}
                        className={`color ${accent === c ? "active" : ""}`}
                        style={{ background: c }}
                        onClick={() => setAccent(c)}
                      ></span>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* INTEGRATIONS */}
            {isVisible("integrations") && (
              <div className="settings-card" ref={integrationsRef}>
                <h2>Integrations</h2>
                <p>Connect your favorite tools and services.</p>

                {[
                  { key: "google", label: "Google Workspace", desc: "Sync emails and calendars." },
                  { key: "slack", label: "Slack", desc: "Receive team notifications." },
                  { key: "github", label: "GitHub", desc: "Link repositories and projects." },
                ].map((item) => (
                  <div className="integration-item" key={item.key}>
                    <div>
                      <h4>{item.label}</h4>
                      <span>{item.desc}</span>
                    </div>
                    <button
                      className={integrations[item.key] ? "primary-btn" : "secondary-btn"}
                      onClick={() => toggleIntegration(item.key, item.label)}
                    >
                      {integrations[item.key] ? "Connected" : "Connect"}
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* BILLING */}
            {isVisible("billing") && (
              <div className="settings-card" ref={billingRef}>
                <h2>Billing</h2>
                <p>Manage your subscription and payment methods.</p>

                <div className="billing-box">
                  <h3>Professional Plan</h3>
                  <span>$49/month • Active</span>
                </div>

                <button
                  className="primary-btn"
                  onClick={() => showToast("Opening billing portal...")}
                >
                  Manage Subscription
                </button>
              </div>
            )}

            {/* ROLES */}
            {isVisible("roles") && (
              <div className="settings-card" ref={rolesRef}>
                <h2>Roles & Permissions</h2>
                <p>Manage access and permissions.</p>

                {roles.map((role) => (
                  <div className="role-item" key={role.id}>
                    {editingRoleId === role.id ? (
                      <>
                        <input
                          className="role-edit-input"
                          value={roleDraft}
                          onChange={(e) => setRoleDraft(e.target.value)}
                          autoFocus
                        />
                        <div className="role-edit-actions">
                          <button className="primary-btn" onClick={() => saveRoleEdit(role.id)}>
                            Save
                          </button>
                          <button
                            className="secondary-btn"
                            onClick={() => setEditingRoleId(null)}
                          >
                            Cancel
                          </button>
                        </div>
                      </>
                    ) : (
                      <>
                        <span>{role.name}</span>
                        <button className="secondary-btn" onClick={() => startEditRole(role)}>
                          Edit
                        </button>
                      </>
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* BACKUPS */}
            {isVisible("backups") && (
              <div className="settings-card" ref={backupsRef}>
                <h2>Backups</h2>
                <p>Create and restore backups.</p>

                <button className="primary-btn" onClick={createBackup}>
                  Create Backup
                </button>

                <button
                  className="secondary-btn"
                  style={{ marginLeft: "15px" }}
                  onClick={restoreBackup}
                >
                  Restore
                </button>
              </div>
            )}

            {/* ACTIVITY LOG */}
            {isVisible("activity") && (
              <div className="settings-card" ref={activityRef}>
                <h2>Activity Log</h2>
                <p>Recent actions performed in the system.</p>

                {activityLog.slice(0, 8).map((log) => (
                  <div className="log-item" key={log.id}>
                    <span>{log.action}</span>
                    <small>{log.time}</small>
                  </div>
                ))}
              </div>
            )}

            {/* LANGUAGE & REGION */}
            {isVisible("language") && (
              <div className="settings-card" ref={languageRef}>
                <h2>Language & Region</h2>
                <p>Customize language and regional preferences.</p>

                <div className="field">
                  <label>Language</label>
                  <select
                    value={langPrefs.language}
                    onChange={(e) => setLangPrefs({ ...langPrefs, language: e.target.value })}
                  >
                    <option>English (US)</option>
                    <option>Français</option>
                    <option>العربية</option>
                  </select>
                </div>

                <div className="field">
                  <label>Region</label>
                  <select
                    value={langPrefs.region}
                    onChange={(e) => setLangPrefs({ ...langPrefs, region: e.target.value })}
                  >
                    <option>Morocco</option>
                    <option>France</option>
                    <option>United States</option>
                  </select>
                </div>

                <div className="field">
                  <label>Time Format</label>
                  <select
                    value={langPrefs.timeFormat}
                    onChange={(e) => setLangPrefs({ ...langPrefs, timeFormat: e.target.value })}
                  >
                    <option>24 Hours</option>
                    <option>12 Hours</option>
                  </select>
                </div>
              </div>
            )}

            {/* ACCOUNT SETTINGS */}
            {isVisible("account") && (
              <div className="settings-card" ref={accountRef}>
                <h2>Account Settings</h2>
                <p>Manage account preferences and visibility.</p>

                <div className="notification-row">
                  <div>
                    <h4>Public Profile</h4>
                    <span>Allow others to see your profile.</span>
                  </div>
                  <label className="switch">
                    <input
                      type="checkbox"
                      checked={accountPrefs.publicProfile}
                      onChange={() =>
                        setAccountPrefs((prev) => ({
                          ...prev,
                          publicProfile: !prev.publicProfile,
                        }))
                      }
                    />
                    <span></span>
                  </label>
                </div>

                <div className="notification-row">
                  <div>
                    <h4>Email Visibility</h4>
                    <span>Show email to your team.</span>
                  </div>
                  <label className="switch">
                    <input
                      type="checkbox"
                      checked={accountPrefs.emailVisibility}
                      onChange={() =>
                        setAccountPrefs((prev) => ({
                          ...prev,
                          emailVisibility: !prev.emailVisibility,
                        }))
                      }
                    />
                    <span></span>
                  </label>
                </div>

                <div className="notification-row">
                  <div>
                    <h4>Delete Account</h4>
                    <span>Permanently remove your account.</span>
                  </div>
                  <button className="danger-btn" onClick={() => setShowDeleteModal(true)}>
                    Delete
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* PASSWORD MODAL */}
      {showPasswordModal && (
        <div className="modal-overlay" onClick={() => setShowPasswordModal(false)}>
          <div className="modal-box" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Change Password</h3>
              <FaTimes onClick={() => setShowPasswordModal(false)} />
            </div>
            <form onSubmit={handlePasswordSubmit}>
              <label>Current Password</label>
              <input
                type="password"
                value={passwordForm.current}
                onChange={(e) =>
                  setPasswordForm({ ...passwordForm, current: e.target.value })
                }
                required
              />
              <label>New Password</label>
              <input
                type="password"
                value={passwordForm.next}
                onChange={(e) => setPasswordForm({ ...passwordForm, next: e.target.value })}
                required
              />
              <label>Confirm New Password</label>
              <input
                type="password"
                value={passwordForm.confirm}
                onChange={(e) =>
                  setPasswordForm({ ...passwordForm, confirm: e.target.value })
                }
                required
              />
              <button type="submit" className="primary-btn modal-submit">
                Update Password
              </button>
            </form>
          </div>
        </div>
      )}

      {/* SESSIONS MODAL */}
      {showSessionsModal && (
        <div className="modal-overlay" onClick={() => setShowSessionsModal(false)}>
          <div className="modal-box" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Active Sessions</h3>
              <FaTimes onClick={() => setShowSessionsModal(false)} />
            </div>
            {sessions.map((s) => (
              <div className="session-item" key={s.id}>
                <div>
                  <h4>
                    {s.device} {s.current && <span className="session-tag">This device</span>}
                  </h4>
                  <span>{s.location}</span>
                </div>
                {!s.current && (
                  <button className="secondary-btn" onClick={() => logOutSession(s.id)}>
                    Log out
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* DELETE ACCOUNT MODAL */}
      {showDeleteModal && (
        <div className="modal-overlay" onClick={() => setShowDeleteModal(false)}>
          <div className="modal-box" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Delete Account</h3>
              <FaTimes onClick={() => setShowDeleteModal(false)} />
            </div>
            <p className="delete-warning">
              This action is permanent. Type <strong>DELETE</strong> to confirm.
            </p>
            <input
              type="text"
              value={deleteConfirmText}
              onChange={(e) => setDeleteConfirmText(e.target.value)}
              placeholder="Type DELETE"
            />
            <button
              className="danger-btn modal-submit"
              disabled={deleteConfirmText !== "DELETE"}
              style={deleteConfirmText !== "DELETE" ? { opacity: 0.5, cursor: "default" } : undefined}
              onClick={handleDeleteAccount}
            >
              Permanently Delete Account
            </button>
          </div>
        </div>
      )}

      {/* TOAST */}
      {toast && <div className="settings-toast">{toast}</div>}
    </div>
  );
}

export default Settings;
