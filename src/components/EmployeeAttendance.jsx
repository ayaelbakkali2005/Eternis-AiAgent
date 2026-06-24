import "./EmployeeAttendance.css";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  Tooltip,
} from "recharts";

const data = [
  { day: "Mon", value: 80 },
  { day: "Tue", value: 70 },
  { day: "Wed", value: 85 },
  { day: "Thu", value: 55 },
  { day: "Fri", value: 45 },
  { day: "Sat", value: 42 },
  { day: "Sun", value: 65 },
];

export default function EmployeeAttendance() {
  return (
    <div className="attendance-card">
      <div className="attendance-header">
        <h3>Employee Attendance</h3>

        <button>This Week ▼</button>
      </div>

      <div className="attendance-chart">
        <ResponsiveContainer width="100%" height={180}>
          <BarChart data={data}>
            <XAxis
              dataKey="day"
              stroke="#9ca3af"
              tickLine={false}
              axisLine={false}
            />

            <Tooltip />

            <Bar
              dataKey="value"
              fill="#7c3aed"
              radius={[8, 8, 0, 0]}
              barSize={28}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}