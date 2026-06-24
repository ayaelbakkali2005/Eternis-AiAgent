import "./TopProjects.css";

const projects = [
  {
    name: "E-commerce Platform",
    progress: 85,
    color: "#7c3aed",
  },
  {
    name: "CRM System",
    progress: 72,
    color: "#3b82f6",
  },
  {
    name: "Mobile App",
    progress: 60,
    color: "#14d8b4",
  },
  {
    name: "AI Assistant",
    progress: 45,
    color: "#f59e0b",
  },
];

export default function TopProjects() {
  return (
    <div className="top-projects-card">
      <div className="projects-header">
        <h3>Top Projects</h3>
        <button>View All</button>
      </div>

      <div className="projects-list">
        {projects.map((project, index) => (
          <div key={index} className="project-item">
            <div className="project-info">
              <span>{project.name}</span>
              <span>{project.progress}%</span>
            </div>

            <div className="progress-bar">
              <div
                className="progress-fill"
                style={{
                  width: `${project.progress}%`,
                  background: project.color,
                }}
              ></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}