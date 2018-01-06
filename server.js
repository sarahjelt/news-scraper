var express = require("express");
var methodOverride = require("method-override");
var bodyParser = require("body-parser");

var PORT = process.env.PORT || 3000;

var app = express();

app.use("/public", express.static(__dirname + "/public"));
app.use(bodyParser.urlencoded({extended: false}));

var exphbs = require("express-handlebars");

app.engine("handlebars", exphbs({defaultLayout: "main"}));
app.set("view engine", "handlebars");

var routes = require("./controllers/controller.js");

app.use("/", routes);

app.listen(PORT, () => console.log(`listening on port ${PORT}`));