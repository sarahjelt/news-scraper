const express = require("express");
const methodOverride = require("method-override");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

//scraping tools
const axios = require("axios");
const cheerio = require("cheerio");

const db = require("./models");

const PORT = process.env.PORT || 3000;

const app = express();

//configure middleware
app.use("/public", express.static(__dirname + "/public"));
app.use(bodyParser.urlencoded({extended: false}));

const exphbs = require("express-handlebars");

app.engine("handlebars", exphbs({defaultLayout: "main"}));
app.set("view engine", "handlebars");

mongoose.Promise = Promise;
mongoose.connect("mongodb://localhost/news-scraper", {
  useMongoClient: true
});

// routes
const routes = require("./controllers/controller.js");

app.use("/", routes);

// GET route for scraping
app.get("/scrape", function(req, res) {
  axios.get("https://www.npr.org/").then(function(response) {
    var $ = cheerio.load(response.data);
    $("article.has-image").each(function(i, element) {
      var result = {};

      result.headline = $(element).find("h1.title").text().trim();
      result.link = $(element).find("a").attr("href");
      result.summary = $(element).find("p.teaser").text().trim();
      
        db.Article
          .create(result)
          .then(function(dbArticle) {
            res.redirect("/");
          })
          .catch(function(err) {
            res.json(err);
          })
    })
  })
});

// route for getting all articles from db
app.get("/articles", function (req, res) {
  db.Article.find({})
    .then((articles) => res.json(articles))
    .catch(error => res.send(error))
});

// route for getting all SAVED articles from db
app.get("/articles-saved", function (req, res) {
  db.Article.find({saved: true})
    .then((articlesSaved) => res.json(articlesSaved))
    .catch(error => res.send(error))
});

// route for grabbing specific article by ID, populating it with its note
app.get("/articles/:id", function(req, res) {
  db.Article.findOne({_id: req.params.id})
    .populate("note")
    .then(article => res.json(article))
    .catch(error => res.send(error))
});

// route for saving/updating article's associated note
app.post("/articles/:id", function(req, res) {
  db.Note
    .create(req.body)
    .then(note => {
      db.Article.findByIdAndUpdate(req.params.id, {note: note._id})
        .then(note => res.json(note))
        .catch(error => res.send(error))
    })
    .catch(error => res.send(error))
});

// server start
app.listen(PORT, () => console.log(`listening on port ${PORT}`));