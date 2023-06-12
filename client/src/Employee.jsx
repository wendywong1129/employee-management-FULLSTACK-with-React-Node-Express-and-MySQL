import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";

function Employee() {
  const [employees, setEmployees] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:8081/getEmployees")
      .then((res) => {
        if (res.data.Status === "Success") {
          console.log(res.data.Result);
          setEmployees(res.data.Result);
        } else {
          alert("Error");
        }
      })
      .catch((err) => console.log(err));
  }, []);

  const handleDelete = (id) => {
    axios
      .delete("http://localhost:8081/deleteEmployee/" + id)
      .then((res) => {
        if (res.data.Status === "Success") {
          window.location.reload(true);
        } else {
          alert("Error");
        }
      })
      .catch((err) => console.log(err));
  };

  return (
    <div className="px-5 py-3">
      <div className="d-flex justify-content-center mt-2">
        <h3>Employee List</h3>
      </div>
      <Link to="/employeeCreate" className="btn btn-success">
        Add Employee
      </Link>
      <div className="mt-3">
        <table className="table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Image</th>
              <th>Email</th>
              <th>Address</th>
              <th>Salary</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {employees.map((employee, index) => {
              return (
                <tr key={index} className="employee_info">
                  <td>{employee.name}</td>
                  <td>
                    {
                      <img
                        src={`http://localhost:8081/images/` + employee.image}
                        alt={`${employee.name}_avatar`}
                        className="employee_image"
                      />
                    }
                  </td>
                  <td>{employee.email}</td>
                  <td>{employee.address}</td>
                  <td>{employee.salary}</td>
                  <td>
                    <Link
                      to={`/employeeEdit/` + employee.id}
                      className="btn btn-primary btn-sm me-2 mb-1"
                    >
                      edit
                    </Link>
                    <button
                      onClick={(e) => handleDelete(employee.id)}
                      className="btn btn-danger btn-sm mb-1"
                    >
                      delete
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Employee;
