import "./Employees.css";
import Sidebar from "../components/Sidebar";

import {
  FaSearch,
  FaFilter,
  FaPlus,
  FaDownload,
  FaEye,
  FaEdit,
  FaEllipsisV,
} from "react-icons/fa";

import {
  HiOutlineUsers,
  HiOutlineUserGroup,
  HiOutlineBuildingOffice2,
  HiOutlineUserPlus,
} from "react-icons/hi2";

import robot from "../assets/bot.png";

function Employees() {
  const employees = [
    {
      name: "Sarah Johnson",
      position: "UI/UX Designer",
      department: "Design",
      email: "sarah@eternis.com",
      status: "Active",
      date: "Jan 15, 2023",
      avatar: "https://i.pravatar.cc/45?img=1",
    },
    {
      name: "Michael Brown",
      position: "Full Stack Developer",
      department: "Development",
      email: "michael@eternis.com",
      status: "Active",
      date: "Mar 10, 2023",
      avatar: "https://i.pravatar.cc/45?img=2",
    },
    {
      name: "Emily Wilson",
      position: "Project Manager",
      department: "Management",
      email: "emily@eternis.com",
      status: "Active",
      date: "Feb 01, 2023",
      avatar: "https://i.pravatar.cc/45?img=3",
    },
    {
      name: "David Lee",
      position: "AI Engineer",
      department: "AI & Data",
      email: "david@eternis.com",
      status: "Active",
      date: "Apr 05, 2023",
      avatar: "https://i.pravatar.cc/45?img=4",
    },
  ];

  return (
    <div className="dashboard">
      <Sidebar />

      <main className="main-content">
        <div className="employees-page">

          {/* Header */}
          <div className="employees-header">
            <div>
              <h1>Employees</h1>
              <p>Manage your team members</p>
            </div>

            <div className="top-actions">
              <button className="filter-btn-top">
                <FaFilter />
                Filters
              </button>

              <button className="add-btn">
                <FaPlus />
                Add Employee
              </button>
            </div>
          </div>

          {/* Cards + Robot */}
          <div className="top-section">
            <div className="stats">

              <div className="card">
                <div className="icon-box purple">
                  <HiOutlineUsers />
                </div>

                <h2>48</h2>
                <p>Total Employees</p>
              </div>

              <div className="card">
                <div className="icon-box blue">
                  <HiOutlineUserGroup />
                </div>

                <h2>42</h2>
                <p>Active Employees</p>
              </div>

              <div className="card">
                <div className="icon-box cyan">
                  <HiOutlineBuildingOffice2 />
                </div>

                <h2>8</h2>
                <p>Departments</p>
              </div>

              <div className="card">
                <div className="icon-box pink">
                  <HiOutlineUserPlus />
                </div>

                <h2>6</h2>
                <p>New Hires</p>
              </div>
            </div>

            <div className="robot-card">
              <img src={robot} alt="robot" />
            </div>
          </div>

          {/* Table */}
          <div className="table-card">
            <div className="table-top">
              <div className="table-filters">

                <div className="search">
                  <FaSearch />
                  <input
                    type="text"
                    placeholder="Search by name, email or position..."
                  />
                </div>

                <select className="filter-select">
                  <option>All Departments</option>
                  <option>Design</option>
                  <option>Development</option>
                  <option>Management</option>
                  <option>AI & Data</option>
                </select>

                <select className="filter-select">
                  <option>All Positions</option>
                  <option>Developer</option>
                  <option>Designer</option>
                  <option>Manager</option>
                </select>

                <select className="filter-select">
                  <option>All Status</option>
                  <option>Active</option>
                  <option>Inactive</option>
                </select>
              </div>

              <button className="export-btn">
                <FaDownload />
                Export
              </button>
            </div>

            <table>
              <thead>
                <tr>
                  <th>Employee</th>
                  <th>Position</th>
                  <th>Department</th>
                  <th>Email</th>
                  <th>Status</th>
                  <th>Join Date</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>
                {employees.map((emp, i) => (
                  <tr key={i}>
                    <td className="employee-cell">
                      <img src={emp.avatar} alt="" />
                      {emp.name}
                    </td>

                    <td>{emp.position}</td>

                    <td>
                      <span className="dept">
                        {emp.department}
                      </span>
                    </td>

                    <td>{emp.email}</td>

                    <td>
                      <span className="status">
                        {emp.status}
                      </span>
                    </td>

                    <td>{emp.date}</td>

                    <td className="actions">
                      <FaEye />
                      <FaEdit />
                      <FaEllipsisV />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="pagination">
              <button>{"<"}</button>
              <button className="active-page">
                1
              </button>
              <button>2</button>
              <button>3</button>
              <button>{">"}</button>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}

export default Employees;