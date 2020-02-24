// Server config
const express = require("express");
const app = express();

// Define folder for static files
app.use(express.static("public"));

// port
const port = 8081;

// Home page
app.get("/", function (req, res) {
  res.render("home.ejs");
})


// Posts page
app.get("/posts", function (req, res) {
  res.render("posts.ejs");
})

// About page
app.get("/projects", function (req, res) {
  res.render("projects.ejs");
})

// Login page
app.get("/login", function (req, res) {
  res.render("login.ejs");
})

// Login page
app.post("/login", function (req, res) {
  // Put logic here
  res.redirect("/");
})

// Start server and listen for GET requests
app.listen(port, function () {
	console.log("server is listening");
})
