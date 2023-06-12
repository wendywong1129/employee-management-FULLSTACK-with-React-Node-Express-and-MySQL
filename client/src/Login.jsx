import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./style.css";

function Login() {
  const [values, setValues] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");

  const navigate = useNavigate();

  axios.defaults.withCredentials = true;

  const handleSubmit = (event) => {
    event.preventDefault();

    axios
      .post("http://localhost:8081/login", values)
      .then((res) => {
        // console.log(res);
        if (res.data.Status === "Success") {
          navigate("/");
        } else {
          setError(res.data.Error);
        }
      })
      .catch((err) => console.log(err));
  };

  return (
    <div className="vh-100 d-flex justify-content-center align-items-center loginPage">
      <div className="w-25 p-3 rounded border loginForm">
        <div className="text-danger mb-2">{error && error}</div>
        <h2 className="mb-4">Login</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="email">
              <strong>Email</strong>
            </label>
            <input
              type="email"
              name="email"
              placeholder="Enter Email"
              onChange={(e) => setValues({ ...values, email: e.target.value })}
              autoComplete="off"
              className="form-control rounded-0"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="password">
              <strong>Password</strong>
            </label>
            <input
              type="password"
              name="password"
              placeholder="Enter Password"
              onChange={(e) =>
                setValues({ ...values, password: e.target.value })
              }
              className="form-control rounded-0"
            />
          </div>
          <button
            type="submit"
            className="w-100 btn btn-success rounded-0 mb-2"
          >
            Log in
          </button>
          <p>You agree to our terms and policies</p>
        </form>
      </div>
    </div>
  );
}

export default Login;
