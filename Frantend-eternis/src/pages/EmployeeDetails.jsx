import "./EmployeeDetails.css";

import {
  useParams,
  Link
} from "react-router-dom";

import {
  useEffect,
  useState
} from "react";

export default function EmployeeDetails(){

  const { id } = useParams();

  const [employee, setEmployee] =
    useState(null);

  useEffect(() => {

    fetch(
      `http://localhost:8080/api/employees/${id}`
    )

      .then((res) => res.json())

      .then((data) =>
        setEmployee(data)
      )

      .catch((error) =>
        console.log(error)
      );

  }, [id]);

  if(!employee){

    return(

      <div className="loading-box">
        Loading...
      </div>

    );

  }

  return(

    <div className="details-page">

      <div className="details-card">

        <img
          src={
            employee.image ||
            "/avatars/1.jpg"
          }
          alt=""
        />

        <h1>

          {employee.firstName}
          {" "}
          {employee.lastName}

        </h1>

        <p className="job">
          {employee.position}
        </p>

        <div className="details-info">

          <div className="info-box">

            <span>Email</span>

            <h3>
              {employee.email}
            </h3>

          </div>

          <div className="info-box">

            <span>Department</span>

            <h3>
              {employee.department}
            </h3>

          </div>

          <div className="info-box">

            <span>Status</span>

            <h3>

              {employee.active
                ? "Active"
                : "Inactive"}

            </h3>

          </div>

        </div>

        <Link
          to="/employees"
          className="back-btn"
        >
          ← Back
        </Link>

      </div>

    </div>

  );
}