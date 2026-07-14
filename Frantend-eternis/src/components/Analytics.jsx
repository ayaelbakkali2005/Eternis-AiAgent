import "./Analytics.css";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
} from "recharts";

const revenueData = [
  { month: "Jan", revenue: 20000, expenses: 5000 },
  { month: "Feb", revenue: 32000, expenses: 10000 },
  { month: "Mar", revenue: 38000, expenses: 14000 },
  { month: "Apr", revenue: 55000, expenses: 24000 },
  { month: "May", revenue: 50000, expenses: 22000 },
  { month: "Jun", revenue: 62000, expenses: 28000 },
  { month: "Jul", revenue: 52000, expenses: 23000 },
  { month: "Aug", revenue: 72000, expenses: 36000 },
  { month: "Sep", revenue: 80000, expenses: 36000 },
  { month: "Oct", revenue: 78000, expenses: 38000 },
  { month: "Nov", revenue: 95000, expenses: 48000 },
  { month: "Dec", revenue: 105000, expenses: 55000 },
];

const projectsData = [
  { name: "In Progress", value: 50, color: "#7c3aed" },
  { name: "Completed", value: 25, color: "#22d3ee" },
  { name: "On Hold", value: 17, color: "#f59e0b" },
  { name: "Cancelled", value: 8, color: "#ef4444" },
];

function Analytics() {
  return (
    <div className="analytics-grid">
      {/* Revenue */}
      <div className="chart-card revenue-card">
        <div className="chart-header">
          <h3>Revenue Overview</h3>
          <button>This Year</button>
        </div>

        <ResponsiveContainer width="100%" height={260}>
          <LineChart data={revenueData}>
            <XAxis dataKey="month" stroke="#7c8599" />
            <YAxis stroke="#7c8599" />
            <Tooltip />

            <Line
              type="monotone"
              dataKey="revenue"
              stroke="#a855f7"
              strokeWidth={3}
            />

            <Line
              type="monotone"
              dataKey="expenses"
              stroke="#3b82f6"
              strokeWidth={3}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Projects */}
      <div className="chart-card projects-card">
        <h3>Projects Overview</h3>

        <div className="projects-content">
          <PieChart width={220} height={220}>
            <Pie
              data={projectsData}
              dataKey="value"
              innerRadius={60}
              outerRadius={90}
            >
              {projectsData.map((item, index) => (
                <Cell
                  key={index}
                  fill={item.color}
                />
              ))}
            </Pie>
          </PieChart>

          <div className="legend">
            {projectsData.map((item) => (
              <div key={item.name}>
                <span
                  style={{
                    background: item.color,
                  }}
                ></span>

                <p>{item.name}</p>

                <strong>{item.value}%</strong>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Analytics;