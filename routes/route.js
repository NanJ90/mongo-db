var express = require("express");
var router = express.Router();

var request = require("request");
var cheerio = require("cheerio");

var Job = require("../models/Job.js");
var Note = require("../models/Note.js");

router.get("/scrape", function(req, res) {
    request("https://www.indeed.com/jobs?q=full%20stack%20developer&l=Los%20Angeles%2C%20CA", function(err, response, html) {
        var $ = cheerio.load(html);
        $(".result").each(function(i, element) {
            var result = {};
            result.JobId = $(this).attr("id");
            result.title = $(this).find("a").attr("title");
            result.link = $(this).find("a").attr("href");
            result.summary = $(this).find(".paddedSummaryExperience").find("span.summary").text();
            // console.log(result);
            // console.log($(this).attr("class"));
            // console.log($(this).find("a").attr("title"));
            // console.log($(this).find(".sjcl").find("span.company").text());
            // console.log($(this).find(".paddedSummaryExperience").find("span.summary").text());
            // console.log($(this).find(".paddedSummaryExperience").find("div.experience").text());
            // console.log($(this).find("a").attr("href"));
            var entry = new Job(result);

            // Now, save that entry to the db
            entry.save(function(err, doc) {
                // Log any errors
                if (err) {
                    console.log(err);
                }
                // Or log the doc
                else {
                    console.log("else");
                }
            });
        });

    });
        console.log("line42");
        res.redirect("/");
});
// display data to browswe through handlebars
router.get("/", function(req, res) {
	Job.find({}, function(err, doc) {
		var hbsObject= {
			jobs: doc
		};
		// console.log(hbsObject);
		res.render("index", hbsObject);
	});
});


router.put("/:id", function(req, res) {
    console.log("saved: ", req.params);
  Job.findOneAndUpdate({_id: req.params.id}, {$set:{isSaved: req.body.saved}}
    ,function(err, doc) {
    res.redirect("/");
      // console.log(doc);
  });

});
// Create a new note or replace an existing note
router.post("/jobs/:id", function(req, res) {
// give now an ID
	var note = new Note(req.body);
    // console.log("noteID ", note);
	note.save(function(err,doc) {
        // inputting noteId to job collection
        // console.log("inputting noteId to job collection:",doc);
		Job.findOneAndUpdate({_id: req.params.id}, {note: doc._id})
		.exec(function(err2, doc2) {   
                // log all information of current Job
                console.log("all job info:", doc2);
            // res.redirect("/");
		});
            // res.render("index", )
	});
  
});
// 
router.get("/jobs/:id", function(req, res) {
  // Using the id passed in the id parameter, prepare a query that finds the matching one in our db...
  Job.findOne({ _id: req.params.id })
  // ..and populate all of the notes associated with it
  .populate("note")
  // now, execute our query
  .exec(function(error, doc) {
    
       console.log("populate notes with jobs: ", doc.note);
      res.json(doc.note);

  });
});

router.delete("/:id", function(req, res) {
  // var condition = "id = " + req.params.id;

  Job.remove({_id: req.params.id}, function(err, doc) {
    res.redirect("/");
  });
});

// Export routes for server.js to use.
module.exports = router;