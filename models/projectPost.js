const mongoose = require("mongoose");

var projectPostSchema = new mongoose.Schema ({
  id: String,
  name: String,
  date: String,
  title: String,
  post: String,
  image: String,
  link: String
});

module.exports = mongoose.model("projectPost", projectPostSchema);
