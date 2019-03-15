var mongoose = require("mongoose"); // mongoose not required ,it just for testing peorpose
var Schema = mongoose.Schema;
// machineModel
var machineSchema = new Schema({
  name: String,
  model: String,
  machine_id: String,
  company_id: {
    type: Schema.Types.ObjectId,
    ref: "Company"
  },
  plant_id: {
    type: Schema.Types.ObjectId,
    ref: "Plant"
  },
  dateTime: String,
  configUpdate: Boolean,
  configParam: {
    data: Buffer,
    contentType: Array
  }
});

var machine = mongoose.model("Machine", machineSchema);
module.exports = machine;
