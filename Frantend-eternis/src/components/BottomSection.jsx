import {
  FaChartLine,
  FaUsers,
  FaBriefcase,
  FaRobot,
  FaEllipsisH
} from "react-icons/fa";

export default function BottomSection() {
  return (
    <div className="bottom-wrapper">

      <div className="tasks-overview-card">

        <div className="tasks-head">
          <h2>Performance Overview</h2>

          <div className="menu-icons">
            <FaEllipsisH />
          </div>
        </div>

        <div className="tasks-grid">

          {/* Donut */}
          <div className="donut-side">

            <div className="donut-chart">
              <div className="donut-center">
                <h3>82%</h3>
                <p>Efficiency</p>
              </div>
            </div>

          </div>

          {/* Middle */}
          <div className="middle-info">

            <div className="mid-row">
              <h3>48</h3>
              <p>Employees</p>
              <span>+12%</span>
            </div>

            <div className="mid-row">
              <h3>12</h3>
              <p>Projects</p>
              <span>Active</span>
            </div>

            <div className="mid-row">
              <h3>256</h3>
              <p>AI Requests</p>
              <span>This Month</span>
            </div>

          </div>

          {/* Right */}
          <div className="right-list">

            <div className="task-item">
              <i className="purple">
                <FaUsers />
              </i>

              <p>Employees Online</p>

              <span>32</span>
            </div>

            <div className="task-item">
              <i className="blue">
                <FaBriefcase />
              </i>

              <p>Projects Running</p>

              <span>12</span>
            </div>

            <div className="task-item">
              <i className="orange">
                <FaChartLine />
              </i>

              <p>Revenue Growth</p>

              <span>+18%</span>
            </div>

            <div className="task-item">
              <i className="gray">
                <FaRobot />
              </i>

              <p>AI Assistant Usage</p>

              <span>256</span>
            </div>

          </div>

        </div>

      </div>

    </div>
  );
}