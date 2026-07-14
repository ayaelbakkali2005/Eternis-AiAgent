import { useState, useRef, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import {
  LineChart, Line, AreaChart, Area,
  BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, Tooltip, ResponsiveContainer, Legend
} from "recharts";
import "./Reports.css";

// ── Data ──────────────────────────────────────────────────────
const revenueDataByPeriod = {
  Monthly: [
    { month: "Jan", revenue: 18000, expenses: 9000 },
    { month: "Feb", revenue: 22000, expenses: 11000 },
    { month: "Mar", revenue: 19000, expenses: 10000 },
    { month: "Apr", revenue: 27000, expenses: 13000 },
    { month: "May", revenue: 48750, expenses: 21540 },
    { month: "Jun", revenue: 38000, expenses: 16000 },
  ],
  Weekly: [
    { month: "W1", revenue: 11800, expenses: 5200 },
    { month: "W2", revenue: 12600, expenses: 5600 },
    { month: "W3", revenue: 10900, expenses: 4800 },
    { month: "W4", revenue: 13400, expenses: 6000 },
    { month: "W5", revenue: 12100, expenses: 5300 },
    { month: "W6", revenue: 11700, expenses: 5100 },
  ],
  Yearly: [
    { month: "2020", revenue: 198000, expenses: 104000 },
    { month: "2021", revenue: 210000, expenses: 110000 },
    { month: "2022", revenue: 245000, expenses: 128000 },
    { month: "2023", revenue: 268000, expenses: 139000 },
    { month: "2024", revenue: 172750, expenses: 81540 },
  ],
};

const incomeExpenseDataByPeriod = {
  Monthly: [
    { month: "Jan", income: 18000, expenses: 9000 },
    { month: "Feb", income: 22000, expenses: 11000 },
    { month: "Mar", income: 35000, expenses: 19000 },
    { month: "Apr", income: 28000, expenses: 15000 },
    { month: "May", income: 45000, expenses: 22000 },
    { month: "Jun", income: 38000, expenses: 18000 },
  ],
  Weekly: [
    { month: "W1", income: 9000, expenses: 4200 },
    { month: "W2", income: 11200, expenses: 5100 },
    { month: "W3", income: 8700, expenses: 3900 },
    { month: "W4", income: 9800, expenses: 4600 },
    { month: "W5", income: 10400, expenses: 4800 },
    { month: "W6", income: 9600, expenses: 4300 },
  ],
};

const miniTrend = [4, 6, 5, 8, 7, 9, 8, 11, 10, 13];
const miniTrendDown = [12, 10, 11, 9, 10, 8, 9, 7, 8, 6];

const baseEmployees = [
  { rank: 1, name: "Sarah Johnson", role: "UI/UX Designer", score: 92, avatar: "https://i.pravatar.cc/36?img=47" },
  { rank: 2, name: "Michael Brown", role: "Full Stack Developer", score: 88, avatar: "https://i.pravatar.cc/36?img=11" },
  { rank: 3, name: "Emily Wilson", role: "Project Manager", score: 75, avatar: "https://i.pravatar.cc/36?img=5" },
  { rank: 4, name: "David Lee", role: "AI Engineer", score: 72, avatar: "https://i.pravatar.cc/36?img=15" },
  { rank: 5, name: "Jessica Taylor", role: "Marketing Specialist", score: 68, avatar: "https://i.pravatar.cc/36?img=9" },
];
const extraEmployees = [
  { rank: 6, name: "Daniel Kim", role: "Backend Developer", score: 64, avatar: "https://i.pravatar.cc/36?img=13" },
  { rank: 7, name: "Olivia Martinez", role: "Content Strategist", score: 59, avatar: "https://i.pravatar.cc/36?img=22" },
  { rank: 8, name: "James Anderson", role: "QA Engineer", score: 55, avatar: "https://i.pravatar.cc/36?img=32" },
];

const aiCallsByPeriod = {
  "This Month": { total: 320, change: "15.4%", up: true, data: [
    { name: "Answered", value: 210, pct: "65.6%", color: "#7c3aed" },
    { name: "Missed", value: 70, pct: "21.9%", color: "#3b82f6" },
    { name: "Voicemail", value: 40, pct: "12.5%", color: "#06b6d4" },
  ]},
  "Last Month": { total: 280, change: "9.8%", up: true, data: [
    { name: "Answered", value: 180, pct: "64.3%", color: "#7c3aed" },
    { name: "Missed", value: 65, pct: "23.2%", color: "#3b82f6" },
    { name: "Voicemail", value: 35, pct: "12.5%", color: "#06b6d4" },
  ]},
};

const projectDataByPeriod = {
  "This Month": { total: 48, data: [
    { name: "In Progress", value: 18, pct: "37.5%", color: "#3b82f6" },
    { name: "Completed", value: 15, pct: "31.3%", color: "#10b981" },
    { name: "On Hold", value: 8, pct: "16.7%", color: "#f59e0b" },
    { name: "Overdue", value: 7, pct: "14.5%", color: "#ef4444" },
  ]},
  "Last Month": { total: 43, data: [
    { name: "In Progress", value: 14, pct: "32.6%", color: "#3b82f6" },
    { name: "Completed", value: 19, pct: "44.2%", color: "#10b981" },
    { name: "On Hold", value: 5, pct: "11.6%", color: "#f59e0b" },
    { name: "Overdue", value: 5, pct: "11.6%", color: "#ef4444" },
  ]},
};

const kpiSets = {
  "This Month": {
    label: "May 1, 2024 – May 31, 2024",
    compareLabel: "Apr 2024",
    revenue: "$48,750", revenueChange: "24.5%", revenueUp: true,
    expenses: "$21,540", expensesChange: "8.2%", expensesUp: false,
    profit: "$27,210", profitChange: "31.7%", profitUp: true,
    clients: "128", clientsChange: "18.6%", clientsUp: true,
    projects: "24", projectsChange: "26.3%", projectsUp: true,
  },
  "Last Month": {
    label: "Apr 1, 2024 – Apr 30, 2024",
    compareLabel: "Mar 2024",
    revenue: "$39,200", revenueChange: "12.1%", revenueUp: true,
    expenses: "$19,800", expensesChange: "3.4%", expensesUp: true,
    profit: "$19,400", profitChange: "9.8%", profitUp: true,
    clients: "98", clientsChange: "6.2%", clientsUp: true,
    projects: "19", projectsChange: "11.0%", projectsUp: true,
  },
  "Last 7 Days": {
    label: "May 25 – May 31, 2024",
    compareLabel: "previous 7 days",
    revenue: "$12,400", revenueChange: "9.3%", revenueUp: true,
    expenses: "$5,600", expensesChange: "2.1%", expensesUp: false,
    profit: "$6,800", profitChange: "14.2%", profitUp: true,
    clients: "22", clientsChange: "4.0%", clientsUp: true,
    projects: "5", projectsChange: "8.0%", projectsUp: true,
  },
  "This Quarter": {
    label: "Apr 1 – Jun 30, 2024",
    compareLabel: "previous quarter",
    revenue: "$113,750", revenueChange: "19.8%", revenueUp: true,
    expenses: "$50,540", expensesChange: "6.5%", expensesUp: false,
    profit: "$63,210", profitChange: "27.4%", profitUp: true,
    clients: "301", clientsChange: "15.3%", clientsUp: true,
    projects: "58", projectsChange: "20.1%", projectsUp: true,
  },
};

const initialReports = [
  { icon: "📊", name: "Monthly Financial Report", type: "Finance", date: "May 31, 2024", color: "#7c3aed" },
  { icon: "📈", name: "Employee Performance Report", type: "HR", date: "May 30, 2024", color: "#3b82f6" },
  { icon: "📋", name: "Project Status Report", type: "Projects", date: "May 29, 2024", color: "#10b981" },
  { icon: "📞", name: "AI Calls Summary", type: "Analytics", date: "May 28, 2024", color: "#7c3aed" },
];
const olderReports = [
  { icon: "📊", name: "Q1 Financial Report", type: "Finance", date: "Apr 2, 2024", color: "#7c3aed" },
  { icon: "📋", name: "Project Status Report", type: "Projects", date: "Mar 29, 2024", color: "#10b981" },
];

const reportTypeMeta = {
  Finance: { icon: "📊", color: "#7c3aed" },
  HR: { icon: "📈", color: "#3b82f6" },
  Projects: { icon: "📋", color: "#10b981" },
  Analytics: { icon: "📞", color: "#7c3aed" },
};

// ── Mini sparkline ────────────────────────────────────────────
function Sparkline({ data, color }) {
  const pts = data.map((v, i) => ({ i, v }));
  return (
    <ResponsiveContainer width="100%" height={48}>
      <AreaChart data={pts} margin={{ top: 4, right: 0, left: 0, bottom: 0 }}>
        <defs>
          <linearGradient id={`sg${color.replace("#", "")}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor={color} stopOpacity={0.25} />
            <stop offset="95%" stopColor={color} stopOpacity={0} />
          </linearGradient>
        </defs>
        <Area type="monotone" dataKey="v" stroke={color} strokeWidth={1.8}
          fill={`url(#sg${color.replace("#", "")})`} dot={false} />
      </AreaChart>
    </ResponsiveContainer>
  );
}

// ── KPI Card ──────────────────────────────────────────────────
function KpiCard({ icon, label, value, change, up, trend, compareLabel }) {
  return (
    <div className="rp-kpi-card">
      <div className="rp-kpi-top">
        <span className="rp-kpi-icon">{icon}</span>
        <span className="rp-kpi-label">{label}</span>
      </div>
      <div className="rp-kpi-value">{value}</div>
      <div className={`rp-kpi-change ${up ? "up" : "down"}`}>
        {up ? "▲" : "▼"} {change} <span>vs {compareLabel}</span>
      </div>
      <div className="rp-kpi-spark">
        <Sparkline data={trend} color={up ? "#7c3aed" : "#3b82f6"} />
      </div>
    </div>
  );
}

// ── Custom Tooltip ────────────────────────────────────────────
function RevTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rp-tooltip">
      <div className="rp-tooltip-title">{label}</div>
      {payload.map((p) => (
        <div key={p.name} className="rp-tooltip-row">
          <span style={{ color: p.color }}>●</span>
          {p.name.charAt(0).toUpperCase() + p.name.slice(1)}:&nbsp;
          <strong>${p.value.toLocaleString()}</strong>
        </div>
      ))}
    </div>
  );
}

const downloadTextFile = (filename, content, mime = "text/csv") => {
  const blob = new Blob([content], { type: mime });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};

const dateRangePresets = ["This Month", "Last Month", "Last 7 Days", "This Quarter"];

// ── Main Component ────────────────────────────────────────────
export default function Reports() {
  const [revPeriod, setRevPeriod] = useState("Monthly");
  const [incomePeriod, setIncomePeriod] = useState("Monthly");
  const [aiPeriod, setAiPeriod] = useState("This Month");
  const [projPeriod, setProjPeriod] = useState("This Month");

  const [dateRangeKey, setDateRangeKey] = useState("This Month");
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [customFrom, setCustomFrom] = useState("");
  const [customTo, setCustomTo] = useState("");
  const [customLabel, setCustomLabel] = useState(null);

  const [reports, setReports] = useState(initialReports);
  const [showAllReports, setShowAllReports] = useState(false);
  const [showAllEmployees, setShowAllEmployees] = useState(false);

  const [showGenerateModal, setShowGenerateModal] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [genForm, setGenForm] = useState({ type: "Finance", title: "" });

  const datePickerRef = useRef(null);

  useEffect(() => {
    const handleClick = (e) => {
      if (datePickerRef.current && !datePickerRef.current.contains(e.target)) setShowDatePicker(false);
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const kpi = customLabel ? { ...kpiSets["This Month"], label: customLabel, compareLabel: "previous period" } : kpiSets[dateRangeKey];

  const displayedReports = showAllReports ? [...reports, ...olderReports] : reports.slice(0, 4);
  const displayedEmployees = showAllEmployees ? [...baseEmployees, ...extraEmployees] : baseEmployees;

  const aiCalls = aiCallsByPeriod[aiPeriod];
  const projStats = projectDataByPeriod[projPeriod];

  const applyPreset = (preset) => {
    setDateRangeKey(preset);
    setCustomLabel(null);
    setShowDatePicker(false);
  };

  const applyCustomRange = () => {
    if (!customFrom || !customTo) return;
    const f = new Date(customFrom).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
    const t = new Date(customTo).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
    setCustomLabel(`${f} – ${t}`);
    setShowDatePicker(false);
  };

  const handleExport = () => {
    const revData = revenueDataByPeriod[revPeriod];
    const rows = [
      ["Reports Export"],
      ["Date range", kpi.label],
      [],
      ["KPI", "Value", "Change"],
      ["Total Revenue", kpi.revenue, kpi.revenueChange],
      ["Total Expenses", kpi.expenses, kpi.expensesChange],
      ["Net Profit", kpi.profit, kpi.profitChange],
      ["New Clients", kpi.clients, kpi.clientsChange],
      ["Projects Completed", kpi.projects, kpi.projectsChange],
      [],
      [`Revenue Overview (${revPeriod})`],
      ["Period", "Revenue", "Expenses"],
      ...revData.map((d) => [d.month, d.revenue, d.expenses]),
    ];
    const csv = rows.map((r) => r.join(",")).join("\n");
    downloadTextFile(`reports-export-${dateRangeKey.replace(/\s+/g, "-").toLowerCase()}.csv`, csv);
  };

  const handleGenerateSubmit = (e) => {
    e.preventDefault();
    setIsGenerating(true);
    setTimeout(() => {
      const meta = reportTypeMeta[genForm.type];
      const defaultNames = {
        Finance: "Monthly Financial Report",
        HR: "Employee Performance Report",
        Projects: "Project Status Report",
        Analytics: "AI Calls Summary",
      };
      const newReport = {
        icon: meta.icon,
        color: meta.color,
        type: genForm.type,
        name: genForm.title.trim() || defaultNames[genForm.type],
        date: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
      };
      setReports((prev) => [newReport, ...prev]);
      setIsGenerating(false);
      setShowGenerateModal(false);
      setGenForm({ type: "Finance", title: "" });
    }, 600);
  };

  const downloadReportRow = (r) => {
    const content = `Report Name,Type,Date\n"${r.name}",${r.type},${r.date}`;
    downloadTextFile(`${r.name.replace(/\s+/g, "-").toLowerCase()}.csv`, content);
  };

  return (
  <div className="dashboard">
    <Sidebar />

    <main className="main-content">
      <div className="rp-root">
      {/* Header */}
      <div className="rp-header">
        <div>
          <h1 className="rp-title">Reports</h1>
          <p className="rp-subtitle">Track performance and analyze your business insights.</p>
        </div>
        <div className="rp-header-actions">
          <div className="rp-date-wrapper" ref={datePickerRef}>
            <button className="rp-btn-date" onClick={() => setShowDatePicker((s) => !s)}>
              <span>📅</span> {customLabel || kpi.label} <span className="rp-chevron">▾</span>
            </button>
            {showDatePicker && (
              <div className="rp-date-dropdown">
                {dateRangePresets.map((p) => (
                  <button
                    key={p}
                    className={`rp-date-option ${!customLabel && dateRangeKey === p ? "active" : ""}`}
                    onClick={() => applyPreset(p)}
                  >
                    {p}
                  </button>
                ))}
                <div className="rp-date-custom">
                  <div className="rp-date-custom-label">Custom range</div>
                  <div className="rp-date-custom-row">
                    <input type="date" value={customFrom} onChange={(e) => setCustomFrom(e.target.value)} />
                    <span>–</span>
                    <input type="date" value={customTo} onChange={(e) => setCustomTo(e.target.value)} />
                  </div>
                  <button className="rp-btn-primary rp-date-apply" onClick={applyCustomRange}>Apply</button>
                </div>
              </div>
            )}
          </div>
          <button className="rp-btn-ghost" onClick={handleExport}>
            <span>⬇</span> Export Report
          </button>
          <button className="rp-btn-primary" onClick={() => setShowGenerateModal(true)}>
            <span>📊</span> Generate Report
          </button>
        </div>
      </div>

      {/* KPI Row */}
      <div className="rp-kpi-row">
        <KpiCard icon="💲" label="Total Revenue" value={kpi.revenue} change={kpi.revenueChange} up={kpi.revenueUp} trend={kpi.revenueUp ? miniTrend : miniTrendDown} compareLabel={kpi.compareLabel} />
        <KpiCard icon="💳" label="Total Expenses" value={kpi.expenses} change={kpi.expensesChange} up={kpi.expensesUp} trend={kpi.expensesUp ? miniTrend : miniTrendDown} compareLabel={kpi.compareLabel} />
        <KpiCard icon="📈" label="Net Profit" value={kpi.profit} change={kpi.profitChange} up={kpi.profitUp} trend={kpi.profitUp ? miniTrend : miniTrendDown} compareLabel={kpi.compareLabel} />
        <KpiCard icon="👥" label="New Clients" value={kpi.clients} change={kpi.clientsChange} up={kpi.clientsUp} trend={kpi.clientsUp ? miniTrend : miniTrendDown} compareLabel={kpi.compareLabel} />
        <KpiCard icon="✅" label="Projects Completed" value={kpi.projects} change={kpi.projectsChange} up={kpi.projectsUp} trend={kpi.projectsUp ? miniTrend : miniTrendDown} compareLabel={kpi.compareLabel} />
      </div>

      {/* Middle Row */}
      <div className="rp-mid-row">
        {/* Revenue Overview */}
        <div className="rp-card rp-revenue">
          <div className="rp-card-header">
            <span className="rp-card-title">Revenue Overview</span>
            <select value={revPeriod} onChange={e => setRevPeriod(e.target.value)} className="rp-select">
              <option>Monthly</option>
              <option>Weekly</option>
              <option>Yearly</option>
            </select>
          </div>
          <ResponsiveContainer width="100%" height={230}>
            <AreaChart data={revenueDataByPeriod[revPeriod]} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
              <defs>
                <linearGradient id="gRev" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#7c3aed" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#7c3aed" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="gExp" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="month" tick={{ fill: "#6b6b8a", fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: "#6b6b8a", fontSize: 11 }} axisLine={false} tickLine={false}
                tickFormatter={v => `${v / 1000}K`} />
              <Tooltip content={<RevTooltip />} />
              <Legend iconType="circle" iconSize={8}
                formatter={v => <span style={{ color: "#8888aa", fontSize: 12 }}>{v.charAt(0).toUpperCase() + v.slice(1)}</span>} />
              <Area type="monotone" dataKey="revenue" stroke="#7c3aed" strokeWidth={2}
                fill="url(#gRev)" dot={false} activeDot={{ r: 4, fill: "#7c3aed" }} />
              <Area type="monotone" dataKey="expenses" stroke="#3b82f6" strokeWidth={2}
                fill="url(#gExp)" dot={false} activeDot={{ r: 4, fill: "#3b82f6" }} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Employee Performance */}
        <div className="rp-card rp-employees">
          <div className="rp-card-header">
            <span className="rp-card-title">Employee Performance</span>
            <button className="rp-link" onClick={() => setShowAllEmployees((s) => !s)}>
              {showAllEmployees ? "Show less" : "View all"}
            </button>
          </div>
          <div className="rp-emp-list">
            {displayedEmployees.map(emp => (
              <div key={emp.rank} className="rp-emp-row">
                <span className="rp-emp-rank">{emp.rank}</span>
                <img src={emp.avatar} className="rp-emp-avatar" alt={emp.name} />
                <div className="rp-emp-info">
                  <span className="rp-emp-name">{emp.name}</span>
                  <span className="rp-emp-role">{emp.role}</span>
                </div>
                <div className="rp-emp-score-col">
                  <span className="rp-emp-score">{emp.score}%</span>
                  <div className="rp-emp-bar-bg">
                    <div className="rp-emp-bar-fill" style={{ width: `${emp.score}%` }} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* AI Calls Analytics */}
        <div className="rp-card rp-aicalls">
          <div className="rp-card-header">
            <span className="rp-card-title">AI Calls Analytics</span>
            <select value={aiPeriod} onChange={e => setAiPeriod(e.target.value)} className="rp-select">
              <option>This Month</option>
              <option>Last Month</option>
            </select>
          </div>
          <div className="rp-donut-wrapper">
            <ResponsiveContainer width={180} height={180}>
              <PieChart>
                <Pie data={aiCalls.data} cx="50%" cy="50%" innerRadius={55} outerRadius={82}
                  dataKey="value" strokeWidth={0}>
                  {aiCalls.data.map((d, i) => <Cell key={i} fill={d.color} />)}
                </Pie>
                <Tooltip contentStyle={{ background: "#1a1a2e", border: "1px solid #2a2a40", borderRadius: 8, fontSize: 12 }} />
              </PieChart>
            </ResponsiveContainer>
            <div className="rp-donut-center">
              <span className="rp-donut-label">Total Calls</span>
              <span className="rp-donut-value">{aiCalls.total}</span>
            </div>
          </div>
          <div className="rp-aicalls-legend">
            {aiCalls.data.map(d => (
              <div key={d.name} className="rp-legend-row">
                <span className="rp-legend-dot" style={{ background: d.color }} />
                <span className="rp-legend-name">{d.name}</span>
                <span className="rp-legend-val">{d.value} <span className="rp-legend-pct">({d.pct})</span></span>
              </div>
            ))}
          </div>
          <div className={`rp-aicalls-change ${aiCalls.up ? "up" : "down"}`}>
            {aiCalls.up ? "▲" : "▼"} {aiCalls.change} <span>vs previous period</span>
          </div>
        </div>
      </div>

      {/* Bottom Row */}
      <div className="rp-bot-row">
        {/* Project Statistics */}
        <div className="rp-card rp-projects">
          <div className="rp-card-header">
            <span className="rp-card-title">Project Statistics</span>
            <select value={projPeriod} onChange={e => setProjPeriod(e.target.value)} className="rp-select">
              <option>This Month</option>
              <option>Last Month</option>
            </select>
          </div>
          <div className="rp-proj-body">
            <div className="rp-donut-wrapper" style={{ position: "relative" }}>
              <ResponsiveContainer width={160} height={160}>
                <PieChart>
                  <Pie data={projStats.data} cx="50%" cy="50%" innerRadius={48} outerRadius={74}
                    dataKey="value" strokeWidth={0}>
                    {projStats.data.map((d, i) => <Cell key={i} fill={d.color} />)}
                  </Pie>
                  <Tooltip contentStyle={{ background: "#1a1a2e", border: "1px solid #2a2a40", borderRadius: 8, fontSize: 12 }} />
                </PieChart>
              </ResponsiveContainer>
              <div className="rp-donut-center">
                <span className="rp-donut-label">Total</span>
                <span className="rp-donut-value">{projStats.total}</span>
              </div>
            </div>
            <div className="rp-proj-legend">
              {projStats.data.map(d => (
                <div key={d.name} className="rp-legend-row">
                  <span className="rp-legend-dot" style={{ background: d.color }} />
                  <span className="rp-legend-name">{d.name}</span>
                  <span className="rp-legend-val">{d.value} <span className="rp-legend-pct">({d.pct})</span></span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Income vs Expenses */}
        <div className="rp-card rp-income">
          <div className="rp-card-header">
            <span className="rp-card-title">Income vs Expenses</span>
            <select value={incomePeriod} onChange={e => setIncomePeriod(e.target.value)} className="rp-select">
              <option>Monthly</option>
              <option>Weekly</option>
            </select>
          </div>
          <div className="rp-income-legend">
            <span><span className="rp-legend-dot" style={{ background: "#7c3aed" }} />Income</span>
            <span><span className="rp-legend-dot" style={{ background: "#3b82f6" }} />Expenses</span>
          </div>
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={incomeExpenseDataByPeriod[incomePeriod]} barGap={4} margin={{ top: 4, right: 8, left: -16, bottom: 0 }}>
              <XAxis dataKey="month" tick={{ fill: "#6b6b8a", fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: "#6b6b8a", fontSize: 11 }} axisLine={false} tickLine={false}
                tickFormatter={v => `${v / 1000}K`} />
              <Tooltip
                contentStyle={{ background: "#1a1a2e", border: "1px solid #2a2a40", borderRadius: 8, fontSize: 12 }}
                labelStyle={{ color: "#aaa" }}
                cursor={{ fill: "#ffffff08" }}
              />
              <Bar dataKey="income" fill="#7c3aed" radius={[4, 4, 0, 0]} maxBarSize={22} />
              <Bar dataKey="expenses" fill="#3b82f6" radius={[4, 4, 0, 0]} maxBarSize={22} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Recent Reports */}
        <div className="rp-card rp-recent">
          <div className="rp-card-header">
            <span className="rp-card-title">Recent Reports</span>
            <button className="rp-link" onClick={() => setShowAllReports((s) => !s)}>
              {showAllReports ? "Show less" : "View all"}
            </button>
          </div>
          <table className="rp-table">
            <thead>
              <tr>
                <th>Report Name</th>
                <th>Type</th>
                <th>Date</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {displayedReports.map((r, i) => (
                <tr key={`${r.name}-${i}`}>
                  <td>
                    <div className="rp-report-name-cell">
                      <span className="rp-report-icon" style={{ background: r.color + "22", color: r.color }}>{r.icon}</span>
                      {r.name}
                    </div>
                  </td>
                  <td><span className="rp-type-badge">{r.type}</span></td>
                  <td className="rp-date-cell">{r.date}</td>
                  <td><button className="rp-download-btn" title="Download" onClick={() => downloadReportRow(r)}>⬇</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
          </div>
    </main>

    {/* Generate Report Modal */}
    {showGenerateModal && (
      <div className="rp-modal-overlay" onClick={() => !isGenerating && setShowGenerateModal(false)}>
        <div className="rp-modal-card" onClick={(e) => e.stopPropagation()}>
          <h2 className="rp-modal-title">Generate Report</h2>
          <form onSubmit={handleGenerateSubmit}>
            <div className="rp-modal-field">
              <label>Report type</label>
              <select value={genForm.type} onChange={(e) => setGenForm({ ...genForm, type: e.target.value })}>
                {Object.keys(reportTypeMeta).map((t) => <option key={t}>{t}</option>)}
              </select>
            </div>
            <div className="rp-modal-field">
              <label>Title (optional)</label>
              <input
                value={genForm.title}
                onChange={(e) => setGenForm({ ...genForm, title: e.target.value })}
                placeholder="e.g. Q2 Financial Summary"
              />
            </div>
            <div className="rp-modal-field">
              <label>Date range</label>
              <input value={customLabel || kpi.label} disabled />
            </div>
            <div className="rp-modal-actions">
              <button type="button" className="rp-btn-ghost" onClick={() => setShowGenerateModal(false)} disabled={isGenerating}>Cancel</button>
              <button type="submit" className="rp-btn-primary" disabled={isGenerating}>
                {isGenerating ? "Generating…" : "Generate"}
              </button>
            </div>
          </form>
        </div>
      </div>
    )}
  </div>
);
}
