import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function AddEmployee() {
  const [data, setData] = useState({
    name: "",
    email: "",
    password: "",
    address: "",
    salary: "",
    image: "",
  });

  const navigate = useNavigate();

  const handleSubmit = (event) => {
    event.preventDefault();

    const formdata = new FormData();
    formdata.append("name", data.name);
    formdata.append("email", data.email);
    formdata.append("password", data.password);
    formdata.append("address", data.address);
    formdata.append("salary", data.salary);
    formdata.append("image", data.image);
    axios
      .post("http://localhost:8081/createEmployee", formdata)
      .then((res) => {
        // console.log(res);
        navigate("/employees");
      })
      .catch((err) => console.log(err));
  };
  return (
    <div className="d-flex flex-column align-items-center pt-4">
      <h2>Add Employee</h2>
      <form className="row g-3 w-50" onSubmit={handleSubmit}>
        <div className="col-12">
          <label htmlFor="inputName" className="form-label">
            Name
          </label>
          <input
            id="inputName"
            type="text"
            placeholder="Enter Name"
            onChange={(e) => setData({ ...data, name: e.target.value })}
            autoComplete="off"
            className="form-control"
          />
        </div>
        <div className="col-12">
          <label htmlFor="inputEmail" className="form-label">
            Email
          </label>
          <input
            id="inputEmail"
            type="email"
            placeholder="Enter Email"
            onChange={(e) => setData({ ...data, email: e.target.value })}
            autoComplete="off"
            className="form-control"
          />
        </div>
        <div className="col-12">
          <label htmlFor="inputPassword4" className="form-label">
            Password
          </label>
          <input
            id="inputPassword"
            type="password"
            placeholder="Enter Password"
            onChange={(e) => setData({ ...data, password: e.target.value })}
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
            onChange={(e) => setData({ ...data, salary: e.target.value })}
            autoComplete="off"
            className="form-control"
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
            onChange={(e) => setData({ ...data, address: e.target.value })}
            autoComplete="off"
            className="form-control"
          />
        </div>
        <div className="col-12 mb-3">
          <label htmlFor="inputGroupFile01" className="form-label">
            Select Image
          </label>
          <input
            id="inputGroupFile01"
            type="file"
            onChange={(e) => setData({ ...data, image: e.target.files[0] })}
            className="form-control"
          />
        </div>
        <div className="col-12">
          <button type="submit" className="btn btn-primary">
            Create
          </button>
        </div>
      </form>
    </div>
  );
}

export default AddEmployee;
