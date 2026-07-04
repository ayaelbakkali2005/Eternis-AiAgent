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
  FaTimes,
  FaTrash,
} from "react-icons/fa";

import {
  HiOutlineUsers,
  HiOutlineUserGroup,
  HiOutlineBuildingOffice2,
  HiOutlineUserPlus,
} from "react-icons/hi2";

import robot from "../assets/bot.png";

import { useState } from "react";

function Employees() {
  const [search, setSearch] = useState("");
  const [department, setDepartment] = useState("All Departments");
  const [status, setStatus] = useState("All Status");
  const [showFilters, setShowFilters] = useState(true);

  const [employees, setEmployees] = useState([
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
  ]);

  // Modal + form state (was wrongly declared inside the filter callback before)
  const [showModal, setShowModal] = useState(false);
  const [editingIndex, setEditingIndex] = useState(null); // null = adding, number = editing
  const [viewingEmployee, setViewingEmployee] = useState(null); // for read-only view modal

  const emptyEmployee = {
    name: "",
    position: "",
    department: "Design",
    email: "",
    status: "Active",
    date: new Date().toLocaleDateString(),
    avatar: "https://i.pravatar.cc/45",
  };

  const [newEmployee, setNewEmployee] = useState(emptyEmployee);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const filteredEmployees = employees.filter((emp) => {
    const matchesSearch =
      emp.name.toLowerCase().includes(search.toLowerCase()) ||
      emp.email.toLowerCase().includes(search.toLowerCase()) ||
      emp.position.toLowerCase().includes(search.toLowerCase());

    const matchesDepartment =
      department === "All Departments" || emp.department === department;

    const matchesStatus = status === "All Status" || emp.status === status;

    return matchesSearch && matchesDepartment && matchesStatus;
  });

  const totalPages = Math.max(
    1,
    Math.ceil(filteredEmployees.length / itemsPerPage)
  );
  const paginatedEmployees = filteredEmployees.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const goToPage = (page) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
  };

  // ---- Add / Edit ----
  const openAddModal = () => {
    setEditingIndex(null);
    setNewEmployee(emptyEmployee);
    setShowModal(true);
  };

  const openEditModal = (index) => {
    setEditingIndex(index);
    setNewEmployee(employees[index]);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingIndex(null);
    setNewEmployee(emptyEmployee);
  };

  const handleSaveEmployee = () => {
    if (!newEmployee.name || !newEmployee.position || !newEmployee.email) {
      alert("Please fill all required fields.");
      return;
    }

    if (editingIndex !== null) {
      // Update existing employee
      const updated = [...employees];
      updated[editingIndex] = newEmployee;
      setEmployees(updated);
    } else {
      // Add new employee
      setEmployees([...employees, newEmployee]);
    }

    closeModal();
  };

  // ---- Delete ----
  const handleDeleteEmployee = (index) => {
    const emp = employees[index];
    const confirmDelete = window.confirm(
      `Are you sure you want to delete ${emp.name}?`
    );
    if (!confirmDelete) return;
    setEmployees(employees.filter((_, i) => i !== index));
  };

  // ---- View ----
  const handleViewEmployee = (emp) => {
    setViewingEmployee(emp);
  };

  // ---- Export ----
  const handleExport = () => {
    if (filteredEmployees.length === 0) {
      alert("No employees to export.");
      return;
    }

    const headers = [
      "Name",
      "Position",
      "Department",
      "Email",
      "Status",
      "Join Date",
    ];

    const rows = filteredEmployees.map((emp) => [
      emp.name,
      emp.position,
      emp.department,
      emp.email,
      emp.status,
      emp.date,
    ]);

    const csvContent = [headers, ...rows]
      .map((row) => row.map((val) => `"${val}"`).join(","))
      .join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "employees.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // ---- Reset filters (this is what the top "Filters" button toggles) ----
  const handleResetFilters = () => {
    setSearch("");
    setDepartment("All Departments");
    setStatus("All Status");
    setCurrentPage(1);
  };

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
              <button
                className="filter-btn-top"
                onClick={() => setShowFilters((prev) => !prev)}
                title={showFilters ? "Hide filters" : "Show filters"}
              >
                <FaFilter />
                Filters
              </button>

              <button className="add-btn" onClick={openAddModal}>
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
                <h2>{employees.length}</h2>
                <p>Total Employees</p>
              </div>

              <div className="card">
                <div className="icon-box blue">
                  <HiOutlineUserGroup />
                </div>
                <h2>{employees.filter((e) => e.status === "Active").length}</h2>
                <p>Active Employees</p>
              </div>

              <div className="card">
                <div className="icon-box cyan">
                  <HiOutlineBuildingOffice2 />
                </div>
                <h2>{new Set(employees.map((e) => e.department)).size}</h2>
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
            {showFilters && (
              <div className="table-top">
                <div className="table-filters">
                  <div className="search">
                    <FaSearch />
                    <input
                      type="text"
                      placeholder="Search by name, email or position..."
                      value={search}
                      onChange={(e) => {
                        setSearch(e.target.value);
                        setCurrentPage(1);
                      }}
                    />
                  </div>

                  <select
                    className="filter-select"
                    value={department}
                    onChange={(e) => {
                      setDepartment(e.target.value);
                      setCurrentPage(1);
                    }}
                  >
                    <option>All Departments</option>
                    <option>Design</option>
                    <option>Development</option>
                    <option>Management</option>
                    <option>AI & Data</option>
                  </select>

                  <select
                    className="filter-select"
                    value={status}
                    onChange={(e) => {
                      setStatus(e.target.value);
                      setCurrentPage(1);
                    }}
                  >
                    <option>All Status</option>
                    <option>Active</option>
                    <option>Inactive</option>
                  </select>

                  <button className="filter-btn-top" onClick={handleResetFilters}>
                    Reset
                  </button>
                </div>

                <button className="export-btn" onClick={handleExport}>
                  <FaDownload />
                  Export
                </button>
              </div>
            )}

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
                {paginatedEmployees.length === 0 && (
                  <tr>
                    <td colSpan="7" className="no-results">
                      No employees found.
                    </td>
                  </tr>
                )}

                {paginatedEmployees.map((emp, i) => {
                  // Real index in the full employees array (needed for edit/delete)
                  const realIndex = employees.indexOf(emp);

                  return (
                    <tr key={realIndex}>
                      <td className="employee-cell">
                        <img src={emp.avatar} alt="" />
                        {emp.name}
                      </td>

                      <td>{emp.position}</td>

                      <td>
                        <span className="dept">{emp.department}</span>
                      </td>

                      <td>{emp.email}</td>

                      <td>
                        <span className="status">{emp.status}</span>
                      </td>

                      <td>{emp.date}</td>

                      <td className="actions">
                        <FaEye
                          style={{ cursor: "pointer" }}
                          onClick={() => handleViewEmployee(emp)}
                          title="View"
                        />
                        <FaEdit
                          style={{ cursor: "pointer" }}
                          onClick={() => openEditModal(realIndex)}
                          title="Edit"
                        />
                        <FaTrash
                          style={{ cursor: "pointer" }}
                          onClick={() => handleDeleteEmployee(realIndex)}
                          title="Delete"
                        />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>

            <div className="pagination">
              <button onClick={() => goToPage(currentPage - 1)} disabled={currentPage === 1}>
                {"<"}
              </button>

              {Array.from({ length: totalPages }, (_, idx) => idx + 1).map((page) => (
                <button
                  key={page}
                  className={page === currentPage ? "active-page" : ""}
                  onClick={() => goToPage(page)}
                >
                  {page}
                </button>
              ))}

              <button
                onClick={() => goToPage(currentPage + 1)}
                disabled={currentPage === totalPages}
              >
                {">"}
              </button>
            </div>
          </div>
        </div>
      </main>

      {/* Add / Edit Employee Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={closeModal}>
              <FaTimes />
            </button>

            <h2>{editingIndex !== null ? "Edit Employee" : "Add Employee"}</h2>

            <div className="modal-form">
              <input
                type="text"
                placeholder="Full name *"
                value={newEmployee.name}
                onChange={(e) => setNewEmployee({ ...newEmployee, name: e.target.value })}
              />
              <input
                type="text"
                placeholder="Position *"
                value={newEmployee.position}
                onChange={(e) => setNewEmployee({ ...newEmployee, position: e.target.value })}
              />
              <input
                type="email"
                placeholder="Email *"
                value={newEmployee.email}
                onChange={(e) => setNewEmployee({ ...newEmployee, email: e.target.value })}
              />

              <select
                value={newEmployee.department}
                onChange={(e) => setNewEmployee({ ...newEmployee, department: e.target.value })}
              >
                <option>Design</option>
                <option>Development</option>
                <option>Management</option>
                <option>AI & Data</option>
              </select>

              <select
                value={newEmployee.status}
                onChange={(e) => setNewEmployee({ ...newEmployee, status: e.target.value })}
              >
                <option>Active</option>
                <option>Inactive</option>
              </select>
            </div>

            <button className="modal-save-btn" onClick={handleSaveEmployee}>
              {editingIndex !== null ? "Save Changes" : "Add Employee"}
            </button>
          </div>
        </div>
      )}

      {/* View Employee Modal */}
      {viewingEmployee && (
        <div className="modal-overlay" onClick={() => setViewingEmployee(null)}>
          <div
            className="modal-content view-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <button className="modal-close" onClick={() => setViewingEmployee(null)}>
              <FaTimes />
            </button>

            <img src={viewingEmployee.avatar} alt="" />
            <h3>{viewingEmployee.name}</h3>
            <p>{viewingEmployee.position}</p>

            <div className="view-details">
              <p><span>Department:</span>{viewingEmployee.department}</p>
              <p><span>Email:</span>{viewingEmployee.email}</p>
              <p><span>Status:</span>{viewingEmployee.status}</p>
              <p><span>Join Date:</span>{viewingEmployee.date}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Employees;
