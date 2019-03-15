var mongoose = require("mongoose"); // mongoose not required ,it just for testing peorpose
var Schema = mongoose.Schema;
// loggediSessionModel
var loggedinSessionSchema = new Schema({
  user_id: {
    type: Schema.Types.ObjectId,
    ref: "User"
  },
  sdatetime: String,
  edateTime: String,

  machine_id: {
    type: Schema.Types.ObjectId,
    ref: "Machine"
  },
  company_id: {
    type: Schema.Types.ObjectId,
    ref: "Company"
  },
  plant_id: {
    type: Schema.Types.ObjectId,
    ref: "Plant"
  },
  dateTime: String
});

var loggedinSession = mongoose.model("LoggedinSession", loggedinSessionSchema);
module.exports = loggedinSession;
