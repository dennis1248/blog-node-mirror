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

// Mongoose
mongoose.connect("mongodb://localhost/blog");

var blogPostSchema = new mongoose.Schema ({
  name: String,
  date: String,
  title: String,
  post: String,
  image: String
});

var blogPost = mongoose.model("blogPost", blogPostSchema);

// Test create user
// blogPost.create({
//   name: userName,
//   date: today,
//   title: title,
//   post: post,
//   image: image
// }, function (err, blogPost) {
//   if (err) {
//     console.log(err);
//   } else {
//     console.log("New database entry");
//     console.log(blogPost);
//   }
// })

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

// TEST new posts
app.get("/newpost", function (req, res) {
  res.render("newpost.ejs");
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

// New post
app.post("/newpost", function (req, res) {
  var name    = req.body.name,
      title   = req.body.title,
      post    = req.body.post,
      image   = req.body.image;

  if (image === "undefined") {
    var newPost = {name: name, title: title, post: post, date: today, image: undefined};
  } else {
    var newPost = {name: name, title: title, post: post, date: today, image: image};
  }

  blogPost.create(newPost, function (err, newMadePost) {
    if (err) {
      console.log(err);
    } else {
      res.redirect("/posts");
    }
  })
})

// Start server and listen for GET requests
app.listen(port, function () {
	console.log("server is listening");
})
