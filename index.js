const express = require("express");
const mysql = require("mysql2");
const path = require("path");
const { v4: uuidv4 } = require("uuid");
const methodOverride = require("method-override");
const app = express();
const port = 8080;

app.use(methodOverride("_method"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(express.static(path.join(__dirname, "public")));
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "/views"));

const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  database: "username",
  password: "password",
});

//home route
app.get("/", (req, res) => {
    const countQuery = "SELECT COUNT(*) AS count FROM users";
    const recentQuery = "SELECT * FROM users ORDER BY id DESC LIMIT 3";

    connection.query(countQuery, (err, countResult) => {
        if (err) throw err;
        const count = countResult[0].count;

        connection.query(recentQuery, (err, recentResult) => {
            if (err) throw err;
            res.render("home.ejs", { count, recentUsers: recentResult });
        });
    });
});


// USERS ROUTE
app.get("/users", (req, res) => {
  let q = `SELECT * FROM users`;
  try {
    connection.query(q, (err, users) => {
      if (err) throw err;
      res.render("users.ejs", { users });
    });
  } catch (err) {
    res.send("some error occurred");
    console.log(err);
  }
});

// EDIT ROUTE
app.get("/users/:id/edit", (req, res) => {
  let { id } = req.params;
  let q = `SELECT * FROM users WHERE id = ?`;
  try {
    connection.query(q, [id], (err, result) => {
      if (err) throw err;
      let user = result[0];
      res.render("edit.ejs", { user });
    });
  } catch (err) {
    res.send("some error occurred");
    console.log(err);
  }
});

// UPDATE ROUTE
app.patch("/users/:id", (req, res) => {
  let { id } = req.params;
  let { username: newUserName, password: formPass } = req.body;

  const q = `SELECT * FROM users WHERE id = ?`;
  try {
    connection.query(q, [id], (err, result) => {
      if (err) throw err;
      let user = result[0];
      if (formPass !== user.password) {
        return res.send(`
              <h2 style="color:red;text-align:center;">❌ Incorrect password!</h2>
              <p style="text-align:center;"><a href="/users/${id}/edit">Try again</a></p>
            `);
      }

      const q2 = `UPDATE users SET username = ? WHERE id = ?`;
      connection.query(q2, [newUserName, id], (err2) => {
        if (err2) throw err2;
        res.redirect("/users");
      });
    });
  } catch (err) {
    res.send("some error occurred");
    console.log(err);
  }
});

// NEW USER FORM
app.get("/users/new", (req, res) => {
  res.render("new.ejs", { error: null });
});

//AJAX USERNAME CHECK ROUTE
app.get("/check-username", (req, res) => {
  const { username } = req.query;
  if (!username) return res.json({ available: false });

  const q = `SELECT * FROM users WHERE username = ?`;
  connection.query(q, [username], (err, result) => {
    if (err) throw err;
    if (result.length > 0) res.json({ available: false });
    else res.json({ available: true });
  });
});

//ADD NEW USER ROUTE (final version)
app.post("/users", (req, res) => {
  const { username, email, password } = req.body;
  const id = uuidv4();

  // Check for duplicates
  const checkQuery = `SELECT * FROM users WHERE username = ? OR email = ?`;
  connection.query(checkQuery, [username, email], (err, result) => {
    if (err) return res.status(500).json({ success: false, message: "Database error" });

    if (result.length > 0) {
      const existing = result[0];
      if (existing.username === username) {
        return res.json({ success: false, message: "❌ Username already exists!" });
      } else if (existing.email === email) {
        return res.json({ success: false, message: "❌ Email already registered!" });
      }
    }

    // Insert new user
    const insertQuery = `INSERT INTO users (id, username, email, password) VALUES (?, ?, ?, ?)`;
    connection.query(insertQuery, [id, username, email, password], (err2) => {
      if (err2) return res.status(500).json({ success: false, message: "Error inserting user" });
      res.json({ success: true, message: "✅ User added successfully!" });
    });
  });
});


// Delete route with password verification
app.delete("/users/:id", (req, res) => {
    const { id } = req.params;
    const { password } = req.body;

    const q1 = `SELECT password FROM users WHERE id = ?`;
    connection.query(q1, [id], (err, result) => {
        if (err) {
            console.error(err);
            return res.send("Error checking password");
        }

        if (result.length === 0) {
            return res.send("User not found");
        }

        const dbPass = result[0].password;
        if (password !== dbPass) {
            return res.send(`
                <h2 style="color:red;text-align:center;">❌ Incorrect password!</h2>
                <p style="text-align:center;"><a href="/users/${id}/delete-confirm">Try again</a></p>
            `);
        }

        const q2 = `DELETE FROM users WHERE id = ?`;
        connection.query(q2, [id], (err2) => {
            if (err2) {
                console.error(err2);
                return res.send("Error deleting user");
            }
            res.redirect("/users");
        });
    });
});

// Show password confirmation page before deletion
app.get("/users/:id/delete-confirm", (req, res) => {
    const { id } = req.params;
    const q = `SELECT username FROM users WHERE id = ?`;
    connection.query(q, [id], (err, result) => {
        if (err) {
            console.error(err);
            return res.send("Error fetching user data");
        }
        if (result.length === 0) return res.send("User not found");
        const user = result[0];
        res.render("delete.ejs", { id, user });
    });
});






// SERVER
app.listen(port, () => {
  console.log("Listening on Port", port);
});
