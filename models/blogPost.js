const mongoose = require("mongoose");

var blogPostSchema = new mongoose.Schema ({
  id: String,
  name: String,
  date: String,
  title: String,
  post: String,
  image: String,
  link: String
});

module.exports = mongoose.model("blogPost", blogPostSchema);
