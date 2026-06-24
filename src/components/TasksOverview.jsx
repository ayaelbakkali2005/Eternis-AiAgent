import "./TasksOverview.css";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
} from "recharts";

const data = [
  { name: "Completed", value: 12, color: "#14d8b4" },
  { name: "In Progress", value: 8, color: "#3b82f6" },
  { name: "Pending", value: 3, color: "#f59e0b" },
  { name: "Overdue", value: 1, color: "#ef4444" },
];

export default function TasksOverview() {
  return (
    <div className="tasks-card">
      <div className="tasks-header">
        <h3>Tasks Overview</h3>

        <button className="week-btn">
          This Week ▼
        </button>
      </div>

      <div className="tasks-body">
        <div className="chart-container">
          <ResponsiveContainer width={170} height={170}>
            <PieChart>
              <Pie
                data={data}
                dataKey="value"
                innerRadius={45}
                outerRadius={70}
              >
                {data.map((item, index) => (
                  <Cell
                    key={index}
                    fill={item.color}
                  />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>

          <div className="chart-center">
            <h2>24</h2>
            <p>Total Tasks</p>
          </div>
        </div>

        <div className="tasks-legend">
          {data.map((item, index) => (
            <div className="legend-item" key={index}>
              <span
                className="dot"
                style={{
                  background: item.color,
                }}
              ></span>

              <span>
                {item.value} {item.name}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}