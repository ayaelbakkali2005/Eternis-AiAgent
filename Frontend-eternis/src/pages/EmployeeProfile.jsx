import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "./EmployeeProfile.css";

function EmployeeProfile() {

  const { id } = useParams();

  const [employee, setEmployee] = useState(null);

  useEffect(() => {

    fetch(`http://localhost:8080/api/employees/${id}`)
      .then((res) => res.json())
      .then((data) => setEmployee(data))
      .catch((err) => console.log(err));

  }, [id]);

  if (!employee) {
    return <h2>Loading...</h2>;
  }

  return (
    <div className="profile-page">

      <div className="profile-container">

        {/* LEFT */}

        <div className="profile-left">

          <img
            src={
              employee.image
                ? employee.image
                : "/avatars/1.jpg"
            }
            alt=""
            className="profile-image"
          />

          <h1 className="profile-name">
            {employee.firstName} {employee.lastName}
          </h1>

          <p className="profile-position">
            {employee.position || "Employee"}
          </p>

          <div
            className={`status-badge ${
              employee.active
                ? "active"
                : "inactive"
            }`}
          >
            {employee.active
              ? "Active"
              : "Inactive"}
          </div>

        </div>

        {/* RIGHT */}

        <div className="profile-right">

          <h2>Employee Information</h2>

          <div className="info-grid">

            <div className="info-card">
              <span>Email</span>
              <h4>{employee.email}</h4>
            </div>

            <div className="info-card">
              <span>Department</span>
              <h4>
                {employee.department || "Not Assigned"}
              </h4>
            </div>

            <div className="info-card">
              <span>Position</span>
              <h4>
                {employee.position || "Not Assigned"}
              </h4>
            </div>

            <div className="info-card">
              <span>Join Date</span>
              <h4>{employee.joinDate}</h4>
            </div>

          </div>

          <div className="stats-grid">

            <div className="stat-card">
              <h3>12</h3>
              <p>Projects</p>
            </div>

            <div className="stat-card">
              <h3>95%</h3>
              <p>Performance</p>
            </div>

            <div className="stat-card">
              <h3>4</h3>
              <p>Tasks</p>
            </div>

          </div>

          <div className="action-buttons">

            <button className="edit-btn-profile">
              Edit Employee
            </button>

            <button className="delete-btn-profile">
              Delete Employee
            </button>

          </div>

        </div>

      </div>

    </div>
  );
}

export default EmployeeProfile;