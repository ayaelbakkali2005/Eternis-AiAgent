// src/components/MainSection.jsx

export default function MainSection() {
  return (
    <div className="tasks-card">

      {/* Header */}
      <div className="tasks-header">
        <h3>Tasks Overview</h3>

        <div className="dots">
          <span></span>
          <span></span>
          <span></span>
        </div>
      </div>

      {/* Body */}
      <div className="tasks-body">

        {/* Circle */}
        <div className="circle-box">
          <div className="circle-progress">
            <div className="circle-center">
              <h2>58%</h2>
              <p>Task</p>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="task-stats">

          <div className="stat-row">
            <div>
              <h2>50%</h2>
              <p>Revenue</p>
            </div>
            <span>12 tasks</span>
          </div>

          <div className="stat-row">
            <div>
              <h2>17%</h2>
              <p>Pending</p>
            </div>
            <span>4 Tasks</span>
          </div>

        </div>

        {/* Right Side */}
        <div className="task-list">

          <div className="task-item">
            <div className="left-side">
              <span className="dot purple"></span>
              <h4>In Progress</h4>
            </div>
            <p>12 Tasks</p>
          </div>

          <div className="task-item">
            <div className="left-side">
              <span className="dot blue"></span>
              <h4>Pending</h4>
            </div>
            <p>4 Tasks</p>
          </div>

          <div className="task-item">
            <div className="left-side">
              <span className="dot orange"></span>
              <h4>Upcoming</h4>
            </div>
            <p>3 Tasks</p>
          </div>

          <div className="task-item">
            <div className="left-side">
              <span className="dot gray"></span>
              <h4>Update Website</h4>
            </div>
            <p>8 Tasks</p>
          </div>

        </div>

      </div>

    </div>
  );
}