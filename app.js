// Server config
const express                 = require("express"),
      methodOverride          = require("method-override")
      mongoose                = require("mongoose"),
      passport                = require("passport"),
      bodyParser              = require("body-parser"),
      favicon                 = require("serve-favicon"),
      localStrategy           = require("passport-local"),
      passportLocalMongoose   = require("passport-local-mongoose"),
      flash                   = require("connect-flash"),
      app                     = express();

// Schemas
const user          = require("./models/user.js"),
      blogPost      = require("./models/blogPost.js"),
      projectPost   = require("./models/projectPost.js");


// Define folder for static files
app.use(express.static("public"));

// Favicon
app.use(favicon(__dirname + '/public/images/favicon.ico'));

// Mongoose
mongoose.connect("mongodb://localhost/blog");


// Server Settings
const port = 8081;
const secret = "This Is My Super Secret Code"
const allowUserCreation = false;

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended: true}));

// Passport
app.use(require("express-session")({
  secret: secret,
  resave: false,
  saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

passport.use(new localStrategy(user.authenticate()));
passport.serializeUser(user.serializeUser());
passport.deserializeUser(user.deserializeUser());

// Use Method Override and look for _method
app.use(methodOverride("_method"));

// Check if logged in
app.use(function (req, res, next) {
  res.locals.isLoggedIn = req.isAuthenticated();
  next();
})

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
      res.render("error.ejs", {error:"Error: The given ID is wrong or another error occurred"})
    } else {
      if (foundPost === null) {
        res.render("error.ejs", {error:"Error: This post does not exist or it does no longer exist"});
      } else {
        res.render("showpost.ejs", {post:foundPost});
      }
    }
  })
})

// Projects page
app.get("/projects", function (req, res) {
  projectPost.find({}, function (err, projectPost) {
    if (err) {
      console.log(err);
    } else {
      res.render("projects.ejs", {projectPost:projectPost});
    }
  })
})

app.get("/projects/:id", function (req, res) {
  projectPost.findById(req.params.id, function (err, foundProject) {
    if (err) {
      console.log(err);
      res.render("error.ejs", {error:"Error: The given ID is wrong or another error occurred"});
    } else {
      if (foundProject === null) {
        res.render("error.ejs", {error:"Error: This project does not exist or it does no longer exist"});
      } else {
        res.render("showproject.ejs", {project:foundProject});
      }
    }
  })
})

// new project
app.get("/newproject", isLoggedIn, function (req, res) {
  res.render("newproject.ejs");
})

// new posts
app.get("/newpost", isLoggedIn, function (req, res) {
  res.render("newpost.ejs");
})

// register page
app.get("/register", function (req, res) {
  res.render("register.ejs");
})

app.post("/register", function (req, res) {
  if (allowUserCreation) {
    user.register(new user({username: req.body.username}), req.body.password, function (err, user) {
      if (err) {
        console.log(err);
        return res.redirect("/register.ejs");
      }
      passport.authenticate("local")(req, res, function() {
        res.redirect("/");
      })
    })
  } else {
    res.render("error.ejs", {error:"This site is currently configured to not allow account creation, in the server config set allowUserCreation to true to allow user account creation."})
  }
})

// Login page
app.get("/login", function (req, res) {
  res.render("login.ejs", {messages: req.flash("info")});
})

// Login
app.post("/login", passport.authenticate("local", {
  successRedirect: "/",
  failureRedirect: "/loginfail",
  failureFlash: true
}), function (req, res) {
})

// login fail
app.get("/loginfail", function (req, res) {
  req.flash("info", "Login Incorrect");
  res.redirect("/login");
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

// New project
app.post("/newproject", isLoggedIn, function (req, res) {
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
  var newProject = {id: id, name: name, title: title, post: post, date: today, image: image, link: link};

  projectPost.create(newProject, function (err, newMadeProject) {
    if (err) {
      console.log(err);
    } else {
      res.redirect("/projects");
    }
  })
})

// Edit project page
app.get("/projects/:id/edit", isLoggedIn, function (req, res) {
  projectPost.findById(req.params.id, function (err, foundProject) {
    if (err) {
      console.log(err);
    } else {
      res.render("editproject.ejs", {project:foundProject});
    }
  })
})

// Put the request and update project
app.put("/projects/:id", isLoggedIn, function (req, res) {
  var id      = req.body._id,
      name    = req.body.name,
      title   = req.body.title,
      post    = req.body.post,
      image   = req.body.image,
      link    = req.body.link;

  var editProject = {id: id, name: name, title: title, post: post, image: image, link: link};

  projectPost.findByIdAndUpdate(req.params.id, editProject, function (err, updatedBlog) {
    if (err) {
      console.log(err);
    } else {
      res.redirect("/projects/" + req.params.id);
    }
  })
})

// Delete project
app.delete("/projects/:id", isLoggedIn, function (req, res) {
  projectPost.findByIdAndRemove(req.params.id, function (err) {
    if (err) {
      console.log(err);
    } else {
      res.redirect("/projects");
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
app.put("/posts/:id", isLoggedIn, function (req, res) {
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
