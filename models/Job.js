// Require mongoose
var mongoose = require("mongoose");
// Create Schema class
var Schema = mongoose.Schema;

// Create article schema
var JobSchema = new Schema({
  // title is a required string
  JobId:{
    type: String,
    unique:true
  },
  
  title: {
    type: String,
    required: true
  },
  // link is a required string
  link: {
    type: String
  },
  summary:{
    type:String
  },
  experience:{
    type:String,
  },
  isSaved:{
    type:Boolean,
    default:false
  },
  // This only saves one note's ObjectId, ref refers to the Note model
  note: {
    type: Schema.Types.ObjectId,
    ref: "Note"
  }
});

// Create the Job model with the JobListSchema
var Job = mongoose.model("Job", JobSchema);

// Export the model
module.exports = Job;
