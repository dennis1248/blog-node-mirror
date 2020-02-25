// Server config
const express     = require("express"),
      app         = express(),
      mongoose    = require("mongoose"),
      bodyParser  = require("body-parser");


// Define folder for static files
app.use(express.static("public"));

// Test data
var today = new Date(),
    dd = String(today.getDate()).padStart(2, '0'),
    mm = String(today.getMonth() + 1).padStart(2, '0'),
    yyyy = today.getFullYear();

today = mm + '/' + dd + '/' + yyyy;

var userName = "Dennis1248";
var title = "How to be cool";
var post = "Potatos are very cool ayy lmao lol something not every interesting"

// Mongoose
mongoose.connect("mongodb://localhost/blog");

var blogPostSchema = new mongoose.Schema ({
  name: String,
  date: String,
  title: String,
  post: String
});

var blogPost = mongoose.model("blogPost", blogPostSchema);

blogPost.create({
  name: userName,
  date: today,
  title: title,
  post: post
}, function (err, blogPost) {
  if (err) {
    console.log(err);
  } else {
    console.log("New database entry");
    console.log(blogPost);
  }
})

// Server config
const port = 8081;
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended: true}));

// Home page
app.get("/", function (req, res) {
  res.render("home.ejs");
})

// Posts page
app.get("/posts", function (req, res) {
  blogPost.find({}, function (err, blogPost) {
    if (err) {
      console.log(err);
    } else {
      res.render("posts.ejs", {blogPost:blogPost});
    }
  })
})

// About page
app.get("/projects", function (req, res) {
  res.render("projects.ejs");
})

// Login page
app.get("/login", function (req, res) {
  res.render("login.ejs");
})

// Login
app.post("/login", function (req, res) {
  // Put logic here
  res.redirect("/");
})

// Start server and listen for GET requests
app.listen(port, function () {
	console.log("server is listening");
})
