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
app.get("/about", function (req, res) {
  res.render("about.ejs");
})

// Start server and listen for GET requests
app.listen(port, function () {
	console.log("server is listening");
})
