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
} from "react-icons/fa";

function Settings() {
  return (
    <div className="dashboard">
      <Sidebar />

      <main className="main-content">
        {/* HEADER */}
        <div className="settings-header">
          <div>
            <h1>Settings</h1>
            <p>
              Manage your profile, preferences and
              system configuration.
            </p>
          </div>

          <div className="header-actions">
            <div className="search-box">
              <FaSearch />
              <input
                type="text"
                placeholder="Search settings..."
              />
            </div>

            <button className="icon-btn">
              <FaBell />
              <span className="notif-badge">
                3
              </span>
            </button>

            <button className="icon-btn">
              <FaSun />
            </button>

            <button className="save-btn">
              Save Changes
            </button>
          </div>
        </div>

        {/* SETTINGS LAYOUT */}
        <div className="settings-layout">

          {/* LEFT MENU */}
          <div className="settings-menu">
            <div className="menu-item active">
              <FaCog />
              <span>General</span>
            </div>

            <div className="menu-item">
              <FaUser />
              <span>Profile</span>
            </div>

            <div className="menu-item">
              <FaUserShield />
              <span>Account</span>
            </div>

            <div className="menu-item">
              <FaUserShield />
              <span>Security</span>
            </div>

            <div className="menu-item">
              <FaBell />
              <span>Notifications</span>
            </div>

            <div className="menu-item">
              <FaPalette />
              <span>Appearance</span>
            </div>

            <div className="menu-item">
              <FaGlobe />
              <span>Language & Region</span>
            </div>

            <div className="menu-item">
              <FaPuzzlePiece />
              <span>Integrations</span>
            </div>

            <div className="menu-item">
              <FaCreditCard />
              <span>Billing</span>
            </div>

            <div className="menu-item">
              <FaUsers />
              <span>Roles & Permissions</span>
            </div>

            <div className="menu-item">
              <FaCloud />
              <span>Backups</span>
            </div>

            <div className="menu-item">
              <FaHistory />
              <span>Activity Log</span>
            </div>
          </div>

          {/* RIGHT SIDE */}
          <div className="settings-content">
            {/* GENERAL SETTINGS */}
<div className="settings-card">
  <h2>General Settings</h2>
  <p>
    Configure basic information and
    preferences.
  </p>

  <div className="field">
    <label>Company Name</label>
    <input
      type="text"
      defaultValue="Eternis Solutions"
    />
  </div>

  <div className="field">
    <label>Company Email</label>
    <input
      type="email"
      defaultValue="contact@eternis.com"
    />
  </div>

  <div className="field">
    <label>Company Phone</label>
    <input
      type="text"
      defaultValue="+212 612 345 678"
    />
  </div>

  <div className="double-field">
    <div className="field">
      <label>Time Zone</label>

      <select>
        <option>
          (GMT+01:00) Casablanca
        </option>
      </select>
    </div>

    <div className="field">
      <label>Date Format</label>

      <select>
        <option>DD/MM/YYYY</option>
      </select>
    </div>
  </div>

  <div className="field">
    <label>Currency</label>

    <select>
      <option>
        MAD (Moroccan Dirham)
      </option>
    </select>
  </div>

  <div className="field">
    <label>Business Logo</label>

    <div className="logo-upload">
      <div className="logo-box">
        E
      </div>

      <div>
        <button className="change-btn">
          Change Logo
        </button>

        <p>
          PNG or JPG (max. 2MB)
        </p>
      </div>
    </div>
  </div>
</div>

{/* NOTIFICATIONS */}
<div className="settings-card">
  <h2>
    Notification Preferences
  </h2>

  <p>
    Choose how you want to be
    notified.
  </p>

  <div className="notification-row">
    <div>
      <h4>
        📧 Email Notifications
      </h4>

      <span>
        Receive email updates and
        alerts.
      </span>
    </div>

    <label className="switch">
      <input
        type="checkbox"
        defaultChecked
      />
      <span></span>
    </label>
  </div>

  <div className="notification-row">
    <div>
      <h4>
        🔔 In-App Notifications
      </h4>

      <span>
        Show notifications inside
        the application.
      </span>
    </div>

    <label className="switch">
      <input
        type="checkbox"
        defaultChecked
      />
      <span></span>
    </label>
  </div>

  <div className="notification-row">
    <div>
      <h4>
        💬 SMS Notifications
      </h4>

      <span>
        Receive important SMS
        updates.
      </span>
    </div>

    <label className="switch">
      <input type="checkbox" />
      <span></span>
    </label>
  </div>

  <div className="notification-row">
    <div>
      <h4>
        📅 Task Reminders
      </h4>

      <span>
        Get reminders for tasks and
        deadlines.
      </span>
    </div>

    <label className="switch">
      <input
        type="checkbox"
        defaultChecked
      />
      <span></span>
    </label>
  </div>
</div>

{/* PROFILE */}
<div className="settings-card">
  <h2>Profile Information</h2>
  <p>
    Update your personal information
    and profile picture.
  </p>

  <div className="profile-section">
    <div className="profile-avatar">
      <img
        src="https://i.pravatar.cc/150?img=12"
        alt=""
      />

      <button className="camera-btn">
        📷
      </button>
    </div>
  </div>

  <div className="double-field">
    <div className="field">
      <label>First Name</label>
      <input
        type="text"
        defaultValue="Youssef"
      />
    </div>

    <div className="field">
      <label>Last Name</label>
      <input
        type="text"
        defaultValue="El Amrani"
      />
    </div>
  </div>

  <div className="field">
    <label>Email Address</label>
    <input
      type="email"
      defaultValue="youssef@eternis.com"
    />
  </div>

  <div className="field">
    <label>Job Title</label>
    <input
      type="text"
      defaultValue="Administrator"
    />
  </div>

  <button className="primary-btn">
    Update Profile
  </button>
</div>

{/* SECURITY */}
<div className="settings-card">
  <h2>Security</h2>
  <p>
    Manage your password and account
    security.
  </p>

  <div className="security-row">
    <div>
      <h4>Password</h4>
      <span>
        Last changed 30 days ago
      </span>
    </div>

    <button className="primary-btn">
      Change Password
    </button>
  </div>

  <div className="security-row">
    <div>
      <h4>
        Two-Factor Authentication
      </h4>

      <span>
        Add an extra layer of security.
      </span>
    </div>

    <label className="switch">
      <input type="checkbox" />
      <span></span>
    </label>
  </div>

  <div className="security-row">
    <div>
      <h4>Active Sessions</h4>

      <span>
        Manage your active sessions.
      </span>
    </div>

    <button className="secondary-btn">
      View Sessions
    </button>
  </div>
</div>

{/* APPEARANCE */}
<div className="settings-card">
  <h2>Appearance</h2>

  <p>
    Customize the look and feel of
    the application.
  </p>

  <div className="theme-grid">
    <button className="theme-card active">
      🌙 Dark
    </button>

    <button className="theme-card">
      ☀️ Light
    </button>

    <button className="theme-card">
      💻 System
    </button>
  </div>

  <div className="field">
    <label>Accent Color</label>

    <div className="colors">
      <span
        className="color active"
        style={{
          background: "#8b5cf6",
        }}
      ></span>

      <span
        className="color"
        style={{
          background: "#3b82f6",
        }}
      ></span>

      <span
        className="color"
        style={{
          background: "#22c55e",
        }}
      ></span>

      <span
        className="color"
        style={{
          background: "#ef4444",
        }}
      ></span>
    </div>
  </div>
</div>
{/* INTEGRATIONS */}
<div className="settings-card">
  <h2>Integrations</h2>
  <p>
    Connect your favorite tools and
    services.
  </p>

  <div className="integration-item">
    <div>
      <h4>Google Workspace</h4>
      <span>
        Sync emails and calendars.
      </span>
    </div>

    <button className="primary-btn">
      Connected
    </button>
  </div>

  <div className="integration-item">
    <div>
      <h4>Slack</h4>
      <span>
        Receive team notifications.
      </span>
    </div>

    <button className="secondary-btn">
      Connect
    </button>
  </div>

  <div className="integration-item">
    <div>
      <h4>GitHub</h4>
      <span>
        Link repositories and projects.
      </span>
    </div>

    <button className="secondary-btn">
      Connect
    </button>
  </div>
</div>

{/* BILLING */}
<div className="settings-card">
  <h2>Billing</h2>
  <p>
    Manage your subscription and
    payment methods.
  </p>

  <div className="billing-box">
    <h3>Professional Plan</h3>
    <span>
      $49/month • Active
    </span>
  </div>

  <button className="primary-btn">
    Manage Subscription
  </button>
</div>

{/* ROLES */}
<div className="settings-card">
  <h2>Roles & Permissions</h2>
  <p>
    Manage access and permissions.
  </p>

  <div className="role-item">
    <span>Administrator</span>
    <button className="secondary-btn">
      Edit
    </button>
  </div>

  <div className="role-item">
    <span>Manager</span>
    <button className="secondary-btn">
      Edit
    </button>
  </div>

  <div className="role-item">
    <span>Employee</span>
    <button className="secondary-btn">
      Edit
    </button>
  </div>
</div>

{/* BACKUPS */}
<div className="settings-card">
  <h2>Backups</h2>
  <p>
    Create and restore backups.
  </p>

  <button className="primary-btn">
    Create Backup
  </button>

  <button
    className="secondary-btn"
    style={{ marginLeft: "15px" }}
  >
    Restore
  </button>
</div>

{/* ACTIVITY LOG */}
<div className="settings-card">
  <h2>Activity Log</h2>
  <p>
    Recent actions performed in the
    system.
  </p>

  <div className="log-item">
    <span>
      Password changed
    </span>

    <small>
      2 hours ago
    </small>
  </div>

  <div className="log-item">
    <span>
      Added new employee
    </span>

    <small>
      Yesterday
    </small>
  </div>

  <div className="log-item">
    <span>
      Project updated
    </span>

    <small>
      2 days ago
    </small>
  </div>
</div>
{/* LANGUAGE & REGION */}
<div className="settings-card">
  <h2>Language & Region</h2>

  <p>
    Customize language and regional
    preferences.
  </p>

  <div className="field">
    <label>Language</label>

    <select>
      <option>English (US)</option>
      <option>Français</option>
      <option>العربية</option>
    </select>
  </div>

  <div className="field">
    <label>Region</label>

    <select>
      <option>Morocco</option>
      <option>France</option>
      <option>United States</option>
    </select>
  </div>

  <div className="field">
    <label>Time Format</label>

    <select>
      <option>24 Hours</option>
      <option>12 Hours</option>
    </select>
  </div>
</div>

{/* ACCOUNT SETTINGS */}
<div className="settings-card">
  <h2>Account Settings</h2>

  <p>
    Manage account preferences and
    visibility.
  </p>

  <div className="notification-row">
    <div>
      <h4>Public Profile</h4>

      <span>
        Allow others to see your
        profile.
      </span>
    </div>

    <label className="switch">
      <input
        type="checkbox"
        defaultChecked
      />
      <span></span>
    </label>
  </div>

  <div className="notification-row">
    <div>
      <h4>Email Visibility</h4>

      <span>
        Show email to your team.
      </span>
    </div>

    <label className="switch">
      <input type="checkbox" />
      <span></span>
    </label>
  </div>

  <div className="notification-row">
    <div>
      <h4>Delete Account</h4>

      <span>
        Permanently remove your
        account.
      </span>
    </div>

    <button className="danger-btn">
      Delete
    </button>
  </div>
</div>

          </div>

        </div>
      </main>
    </div>
  );
}

export default Settings;