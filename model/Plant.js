// mongoose not required her it just for testing peorpo
var mongoose = require("mongoose");
var Schema = mongoose.Schema;
// plantModel
var plantSchema = new Schema({
  name: String,
  email: String,
  company_id: {
    type: Schema.Types.ObjectId,
    ref: "Company"
  },
  dateTime: String
});

var plant = mongoose.model("Plant", plantSchema);
module.exports = plant;
