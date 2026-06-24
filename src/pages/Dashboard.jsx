import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import StatsCards from "../components/StatsCards";
import Analytics from "../components/Analytics";
import Assistant from "../components/Assistant";
import TasksOverview from "../components/TasksOverview";
import EmployeeAttendance from "../components/EmployeeAttendance";
import RecentActivity from "../components/RecentActivity";
import TopProjects from "../components/TopProjects";
import UpcomingEvents from "../components/UpcomingEvents";
import Announcements from "../components/Announcements";

import "./Dashboard.css";

function Dashboard() {
  return (
    <div className="dashboard">
      <Sidebar />

      <main className="main-content">
        <Topbar />

        <StatsCards />

        {/* Revenue + Projects + Assistant */}
        <div className="analytics-section">
          <div className="analytics-left">
            <Analytics />
          </div>

          <div className="analytics-right">
            <Assistant />
          </div>
        </div>

        {/* Tasks + Attendance + Recent */}
        <div className="middle-grid">
          <TasksOverview />
          <EmployeeAttendance />
          <RecentActivity />
        </div>

        {/* Bottom cards */}
        <div className="bottom-grid">
          <TopProjects />
          <UpcomingEvents />
          <Announcements />
        </div>
      </main>
    </div>
  );
}

export default Dashboard;