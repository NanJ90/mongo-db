/* Showing Mongoose's "Populated" Method
 * =============================================== */

// Dependencies
var express = require("express");
var bodyParser = require("body-parser");
var logger = require("morgan");
var methodOverride = require("method-override");
var mongoose = require("mongoose");

// Requiring our Note and Article models
var Job = require("./models/Job.js");
var Note = require("./models/Note.js");
// Our scraping tools

// Set mongoose to leverage built in JavaScript ES6 Promises
mongoose.Promise = Promise;


// Initialize Express
var app = express();


var port = process.env.PORT || 3000;

// Use morgan and body parser with our app
app.use(logger("dev"));
app.use(bodyParser.urlencoded({
  extended: false
}));

// Make public a static dir
app.use(express.static("./public"));
// Override with Post 
app.use(methodOverride("_method"));
// Database configuration with mongoose
var databaseUri = "mongodb://localhost/MongoDB";
// MongoDB Configuration configuration (Change this URL to your own DB)
if (process.env.MONGODB_URI) {
    mongoose.connect(process.env.MONGODB_URI);
} else {
  mongoose.connect(databaseUri);
}

var db = mongoose.connection;

// Show any mongoose errors
db.on("error", function(error) {
  console.log("Mongoose Error: ", error);
});

// Once logged in to the db through mongoose, log a success message
db.once("open", function() {
  // console.log("Mongoose connection successful.");
});

// Set Handlebars.
var exphbs = require("express-handlebars");

app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

 // require models
var routes= require("./routes/route.js");
app.use("/", routes);
// Listen on port 3000
app.listen(port, function() {
  console.log("App running on port: ", port, "!");
});
