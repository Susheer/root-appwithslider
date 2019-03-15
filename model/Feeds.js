var mongoose = require("mongoose"); // mongoose not required ,it just for testing peorpose
var Schema = mongoose.Schema;
// feedsModel
var feedsSchema = new Schema({
  company_id: {
    type: Schema.Types.ObjectId,
    ref: "Company"
  },
  plant_id: {
    type: Schema.Types.ObjectId,
    ref: "Plant"
  },
  user_id: {
    type: Schema.Types.ObjectId,
    ref: "User"
  },
  machine_id: {
    type: Schema.Types.ObjectId,
    ref: "Machine"
  },
  key: String,
  value: String,
  dateTime: String,
  comp_machine_id: Schema.Types.ObjectId(),
  job_id: String
});

var feeds = mongoose.model("Feeds", feedsSchema);
module.exports = feeds;
