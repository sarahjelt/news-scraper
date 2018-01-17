const express = require("express");
// const methodOverride = require("method-override");
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

// route for getting ALL articles from db
app.get("/api/articles", function (req, res) {
  db.Article.find({})
    .then((dbArticle) => res.json(dbArticle))
    .catch(error => res.send(error))
});

// route for getting specific article by ID and populating w/ its notes
app.get("/api/articles/:id", function (req, res) {
  db.Article.findById(req.params.id)
    .populate("note")
    .then((dbArticle) => res.json(dbArticle))
    .catch(error => res.send(error))
});

// route for getting ONLY SAVED articles from db
app.get("/api/saved-articles", function (req, res) {
  db.Article.find({saved: true})
    .then((articlesSaved) => res.json(articlesSaved))
    .catch(error => res.send(error))
});

// route for getting ONLY UNSAVED articles from db
app.get("/api/unsaved-articles", function (req, res) {
  db.Article.find({saved: false})
    .then((articlesUnsaved) => res.json(articlesUnsaved))
    .catch(error => res.send(error))
});

// route for SAVING articles
app.post("/save/:id", function(req, res) {
  db.Article.findByIdAndUpdate(req.params.id, {saved: true})
    .then((dbArticle) => res.redirect("/"));
});

//route for UNSAVING articles
app.post("/unsave/:id", function(req, res) {
  db.Article.findByIdAndUpdate(req.params.id, {saved: false})
    .then((dbArticle) => res.redirect("/"));
});


// route for grabbing specific article by ID, populating it with its note
app.get("/api/articles/:id", function(req, res) {
  db.Article.findOne({_id: req.params.id})
    .populate("note")
    .then(dbArticle => res.json(dbArticle))
    .catch(error => res.json(error))
});

// route for saving/updating article's associated note
app.post("/api/articles/:id", function(req, res) {
  db.Note
    .create(req.body)
    .then(function(dbNote) {
      return db.Article.findByIdAndUpdate(req.params.id, { $push: {note: dbNote._id} }, {new: true});
    })
    .then(function(dbArticle) {
      res.json(dbArticle)
    })
    .catch(function(error) {
      res.json(error)
    })
});

// app.post("/api/notes", function(req, res) {
//   db.Note.insert(req.body, function(error, saved) {
//     if (error) {
//       console.log(error);
//     } else {
//       res.send(saved);
//     }
//   })
// });

// route to delete notes from saved articles -- DOESN'T WORK YET
app.get("/delete/:id", function(req, res) {
  db.Note.remove(
    {
      _id: req.params.id
    },
    function(error, removed) {
      if (error) {
        console.log(error);
        res.send(error);
      }
      else {
        console.log(removed);
        res.send(removed);
      }
    }
  )
});

// server start
app.listen(PORT, () => console.log(`listening on port ${PORT}`));