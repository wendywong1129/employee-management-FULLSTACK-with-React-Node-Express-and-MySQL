import express from "express";
import cors from "cors";
import mysql from "mysql";
import cookieParser from "cookie-parser";
import multer from "multer";
import path from "path";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const app = express();

app.use(
  cors({
    origin: ["http://localhost:5173"],
    methods: ["POST", "GET", "PUT", "DELETE"],
    credentials: true,
  })
);
app.use(cookieParser());
app.use(express.json());
app.use(express.static("public"));

const con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "employee_ms",
});

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/images");
  },
  filename: (req, file, cb) => {
    cb(
      null,
      file.fieldname + "_" + Date.now() + path.extname(file.originalname)
    );
  },
});

const upload = multer({
  storage: storage,
});

con.connect(function (err) {
  if (err) {
    console.log("Error in Connection");
  } else {
    console.log("Connected");
  }
});

app.post("/login", (req, res) => {
  const sql = "SELECT * FROM users Where email = ? AND password = ?";

  con.query(sql, [req.body.email, req.body.password], (err, result) => {
    if (err)
      return res.json({ Status: "Error", Error: "Error in running query" });

    if (result.length > 0) {
      const id = result[0].id;
      const token = jwt.sign({ role: "admin" }, "jwt-secret-key", {
        expiresIn: "1d",
      });
      res.cookie("token", token);
      return res.json({ Status: "Success" });
    } else {
      return res.json({ Status: "Error", Error: "Wrong Email or Password" });
    }
  });
});

app.post("/employeeLogin", (req, res) => {
  const sql = "SELECT * FROM employee Where email = ?";

  con.query(sql, [req.body.email], (err, result) => {
    if (err)
      return res.json({ Status: "Error", Error: "Error in running query" });

    if (result.length > 0) {
      bcrypt.compare(
        req.body.password.toString(),
        result[0].password,
        (err, response) => {
          if (err) return res.json({ Error: "password error" });

          if (response) {
            const token = jwt.sign(
              { id: result[0].id, role: "employee" },
              "jwt-secret-key",
              { expiresIn: "1d" }
            );
            res.cookie("token", token);
            return res.json({ Status: "Success", id: result[0].id });
          } else {
            return res.json({
              Status: "Error",
              Error: "Wrong Email or Password",
            });
          }
        }
      );
    } else {
      return res.json({ Status: "Error", Error: "Wrong Email or Password" });
    }
  });
});

const verifyAdmin = (req, res, next) => {
  const token = req.cookies.token;
  if (!token) {
    return res.json({ Error: "You are not Authenticated" });
  } else {
    jwt.verify(token, "jwt-secret-key", (err, decoded) => {
      if (err) return res.json({ Error: "Wrong credentials" });
      console.log("verifyUser decoded: ", decoded);
      req.role = decoded.role;
      req.id = decoded.id;
      next();
    });
  }
};

app.get("/dashboard", verifyAdmin, (req, res) => {
  return res.json({ Status: "Success", role: req.role, id: req.id });
});

app.get("/logout", (req, res) => {
  res.clearCookie("token");
  return res.json({ Status: "Success" });
});

app.get("/adminCount", (req, res) => {
  // const sql = "SELECT count(id) AS admin FROM users";
  const sql = "Select count(id) as admin from users";

  con.query(sql, (err, result) => {
    if (err) return res.json({ Error: "Error in running query" });
    return res.json(result);
  });
});

app.get("/employeeCount", (req, res) => {
  const sql = "Select count(id) as employee from employee";

  con.query(sql, (err, result) => {
    if (err) return res.json({ Error: "Error in running query" });
    return res.json(result);
  });
});

app.get("/salary", (req, res) => {
  const sql = "Select sum(salary) as sumOfSalary from employee";
  con.query(sql, (err, result) => {
    if (err) return res.json({ Error: "Error in running query" });
    return res.json(result);
  });
});

app.get("/getEmployees", (req, res) => {
  const sql = "SELECT * FROM employee";

  con.query(sql, (err, result) => {
    if (err) return res.json({ Error: "Error in getting employee in sql" });
    return res.json({ Status: "Success", Result: result });
  });
});

// app.post("/createEmployee", (req, res) => {
//   console.log("createEmployee req.file: ", req.file);
// });
app.post("/createEmployee", upload.single("image"), (req, res) => {
  // console.log("createEmployee req.file: ", req.file);
  // console.log("createEmployee req.body: ", req.body);
  const sql =
    "INSERT INTO employee (`name`,`email`,`password`, `address`, `salary`,`image`) VALUES (?)";

  bcrypt.hash(req.body.password.toString(), 10, (err, hash) => {
    if (err) return res.json({ Error: "Error in hashing password" });

    const values = [
      req.body.name,
      req.body.email,
      hash,
      req.body.address,
      req.body.salary,
      req.file.filename,
    ];

    con.query(sql, [values], (err, result) => {
      if (err) return res.json({ Error: "Inside sing-up query" });
      return res.json({ Status: "Success" });
    });
  });
});

app.get("/getEmployee/:id", (req, res) => {
  const id = req.params.id;

  const sql = "SELECT * FROM employee where id = ?";

  con.query(sql, [id], (err, result) => {
    if (err) return res.json({ Error: "Error in getting employee in sql" });
    return res.json({ Status: "Success", Result: result });
  });
});

app.put("/updateEmployee/:id", (req, res) => {
  const id = req.params.id;

  // const sql = "UPDATE employee set salary = ? WHERE id = ?";
  const sql = "UPDATE employee set `address` = ?, `salary` = ? WHERE id = ?";

  // con.query(sql, [req.body.salary, id], (err, result) => {
  con.query(sql, [req.body.address, req.body.salary, id], (err, result) => {
    if (err) return res.json({ Error: "Error in updating employee in sql" });
    return res.json({ Status: "Success" });
  });
});

app.delete("/deleteEmployee/:id", (req, res) => {
  const id = req.params.id;

  const sql = "Delete FROM employee WHERE id = ?";

  con.query(sql, [id], (err, result) => {
    if (err) return res.json({ Error: "Error in deleting employee in sql" });
    return res.json({ Status: "Success" });
  });
});

// app.get("/getEmployeeDetail/:id", (req, res) => {
//   const id = req.params.id;

//   const sql = "SELECT * FROM employee where id = ?";

//   con.query(sql, [id], (err, result) => {
//     if (err) return res.json({ Error: "Error in getting employee in sql" });
//     return res.json({ Status: "Success", Result: result });
//   });
// });

const PORT = 8081;

app.listen(PORT, () => {
  console.log(`Server is running at port: ${PORT}`);
});
