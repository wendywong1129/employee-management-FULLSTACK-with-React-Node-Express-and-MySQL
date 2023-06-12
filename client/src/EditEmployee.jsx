import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

function EditEmployee() {
  const [data, setData] = useState({
    name: "",
    email: "",
    address: "",
    salary: "",
  });

  const { id } = useParams();

  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get("http://localhost:8081/getEmployee/" + id)
      .then((res) => {
        // console.log(res.data.Result);
        setData({
          ...data,
          name: res.data.Result[0].name,
          email: res.data.Result[0].email,
          address: res.data.Result[0].address,
          salary: res.data.Result[0].salary,
        });
      })
      .catch((err) => console.log(err));
  }, []);

  const handleSubmit = (event) => {
    event.preventDefault();

    axios
      .put("http://localhost:8081/updateEmployee/" + id, data)
      .then((res) => {
        if (res.data.Status === "Success") {
          navigate("/employees");
        }
      })
      .catch((err) => console.log(err));
  };

  return (
    <div className="d-flex flex-column align-items-center pt-4">
      <h2>Update Employee</h2>
      <form className="row g-3 w-50" onSubmit={handleSubmit}>
        <div className="col-12">
          <label htmlFor="inputName" className="form-label">
            Name
          </label>
          <input
            id="inputName"
            type="text"
            placeholder="Enter Name"
            value={data.name}
            onChange={(e) => setData({ ...data, name: e.target.value })}
            autoComplete="off"
            className="form-control"
          />
        </div>
        <div className="col-12">
          <label htmlFor="inputEmail4" className="form-label">
            Email
          </label>
          <input
            id="inputEmail"
            type="email"
            placeholder="Enter Email"
            value={data.email}
            onChange={(e) => setData({ ...data, email: e.target.value })}
            autoComplete="off"
            className="form-control"
          />
        </div>
        <div className="col-12">
          <label htmlFor="inputSalary" className="form-label">
            Salary
          </label>
          <input
            id="inputSalary"
            type="text"
            placeholder="Enter Salary"
            value={data.salary}
            onChange={(e) => setData({ ...data, salary: e.target.value })}
            className="form-control"
            autoComplete="off"
          />
        </div>
        <div className="col-12">
          <label htmlFor="inputAddress" className="form-label">
            Address
          </label>
          <input
            id="inputAddress"
            type="text"
            placeholder="Enter Address"
            value={data.address}
            onChange={(e) => setData({ ...data, address: e.target.value })}
            autoComplete="off"
            className="form-control"
          />
        </div>
        <div className="col-12">
          <button type="submit" className="btn btn-primary">
            Update
          </button>
        </div>
      </form>
    </div>
  );
}

export default EditEmployee;
