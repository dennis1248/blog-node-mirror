// Server config
const express                 = require("express"),
      methodOverride          = require("method-override")
      mongoose                = require("mongoose"),
      passport                = require("passport"),
      bodyParser              = require("body-parser"),
      User                    = require("./models/user.js")
      LocalStrategy           = require("passport-local"),
      passportLocalMongoose   = require("passport-local-mongoose"),
      app                     = express();


// Define folder for static files
app.use(express.static("public"));

// Mongoose
mongoose.connect("mongodb://localhost/blog");


// Server config
const port = 8081;
const secret = "This Is My Super Secret Code"
const allowUserCreation = false;

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended: true}));

app.use(require("express-session")({
  secret: secret,
  resave: false,
  saveUninitialized: false
}));

// Passport
app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// Blog post schema
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

// Use Method Override and look for _method
app.use(methodOverride("_method"));

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
app.get("/newpost", isLoggedIn, function (req, res) {
  res.render("newpost.ejs");
})

// register page
app.get("/register", function (req, res) {
  res.render("register.ejs");
})

app.post("/register", function (req, res) {
  if (allowUserCreation) {
    User.register(new User({username: req.body.username}), req.body.password, function (err, user) {
      if (err) {
        console.log(err);
        return res.render("/register.ejs");
      }
      passport.authenticate("local")(req, res, function() {
        res.redirect("/");
      })
    })
  } else {
    res.send("This site is currently configured to not allow account creation, in the server config set allowUserCreation to true to allow account creation");
  }
})

// Login page
app.get("/login", function (req, res) {
  res.render("login.ejs");
})

// Login
app.post("/login", passport.authenticate("local", {
  successRedirect: "/",
  failureRedirect: "/login"
}), function (req, res) {
})

// Check if logged in
function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect("/login");
}

// Logout
app.get("/logout", function (req, res) {
  req.logout();
  res.redirect("/");
})

// New post
app.post("/newpost", isLoggedIn, function (req, res) {
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

// Edit posts page
app.get("/posts/:id/edit", isLoggedIn, function (req, res) {
  blogPost.findById(req.params.id, function (err, foundPost) {
    if (err) {
      console.log(err);
    } else {
      res.render("edit.ejs", {post:foundPost});
    }
  })
})

// Put the request and update post
app.put("/posts/:id", function (req, res) {
  var id      = req.body._id,
      name    = req.body.name,
      title   = req.body.title,
      post    = req.body.post,
      image   = req.body.image,
      link    = req.body.link;

  var editPost = {id: id, name: name, title: title, post: post, image: image, link: link};

  blogPost.findByIdAndUpdate(req.params.id, editPost, function (err, updatedBlog) {
    if (err) {
      console.log(err);
    } else {
      res.redirect("/posts/" + req.params.id);
    }
  })
})

// Delete post
app.delete("/posts/:id", isLoggedIn, function (req, res) {
  blogPost.findByIdAndRemove(req.params.id, function (err) {
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
