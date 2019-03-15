var mongoose = require("mongoose"); // mongoose not required ,it just for testing peorpose
var Schema = mongoose.Schema;
// actionLogModel
var actionLogSchema = new Schema({
  action: String,
  value: String,
  company_id: {
    type: Schema.Types.ObjectId,
    ref: "Company"
  },
  plant_id: {
    type: Schema.Types.ObjectId,
    ref: "Plant"
  },

  machine_id: {
    type: Schema.Types.ObjectId,
    ref: "Machine"
  },
  user_id: {
    type: Schema.Types.ObjectId,
    ref: "User"
  },
  dateTime: String
});

var actionLog = mongoose.model("ActionLog", actionLogSchema);
module.exports = actionLog;
