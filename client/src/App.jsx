import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./Login";
import Dashboard from "./Dashboard";
import Home from "./Home";
import Employee from "./Employee";
import Profile from "./Profile";
import AddEmployee from "./AddEmployee";
import EditEmployee from "./EditEmployee";
import Start from "./Start";
import EmployeeLogin from "./EmployeeLogin";
import EmployeeDetail from "./EmployeeDetail";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Dashboard />}>
          <Route path="" element={<Home />}></Route>
          <Route path="/employees" element={<Employee />}></Route>
          <Route path="/employeeCreate" element={<AddEmployee />}></Route>
          <Route path="/employeeEdit/:id" element={<EditEmployee />}></Route>
          <Route path="/profile" element={<Profile />}></Route>
        </Route>
        <Route path="/login" element={<Login />}></Route>
        <Route path="/start" element={<Start />}></Route>
        <Route path="/employeeLogin" element={<EmployeeLogin />}></Route>
        <Route path="/employeeDetail/:id" element={<EmployeeDetail />}></Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
