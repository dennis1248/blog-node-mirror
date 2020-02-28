// Server config
const express     = require("express"),
      app         = express(),
      mongoose    = require("mongoose"),
      bodyParser  = require("body-parser");


// Define folder for static files
app.use(express.static("public"));

// Mongoose
mongoose.connect("mongodb://localhost/blog");

var blogPostSchema = new mongoose.Schema ({
  id: String,
  name: String,
  date: String,
  title: String,
  post: String,
  image: String,
  link: String
});

var blogPost = mongoose.model("blogPost", blogPostSchema);

// Server config
const port = 8081;
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended: true}));

// Home page
app.get("/", function (req, res) {
  blogPost.find({}, function (err, blogPost) {
    if (err) {
      console.log(err);
    } else {
      res.render("home.ejs", {lastBlogPost:blogPost[blogPost.length - 1]}); // Pass last blog post
    }
  })
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

app.get("/posts/:id", function (req, res) {
  blogPost.findById(req.params.id, function (err, foundPost) {
    if (err) {
      console.log(err);
    } else {
      res.render("showpost.ejs", {post:foundPost});
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
  var id      = req.body._id,
      name    = req.body.name,
      title   = req.body.title,
      post    = req.body.post,
      image   = req.body.image,
      link    = req.body.link;

  // Set date
  var today = new Date();
  var dd = String(today.getDate()).padStart(2, '0');
      mm = String(today.getMonth() + 1).padStart(2, '0');
      yyyy = today.getFullYear();

  today = mm + '/' + dd + '/' + yyyy;

  // Put everything in an object to make it easier to work with
  var newPost = {id: id, name: name, title: title, post: post, date: today, image: image, link: link};

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
