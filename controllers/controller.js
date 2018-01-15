var express = require("express");
var router = express.Router();
// var news = require("../models/news.js");

router.get("/", function(req, res) {
  res.render("index");
});

router.get("/saved", function(req, res) {
  res.render("saved");
});

module.exports = router;