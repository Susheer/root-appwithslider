var mongoose = require("mongoose"); // this line not required , just for testing perpose
var Schema = mongoose.Schema;

var additionalInfoSchema = new Schema({
  key: String
});

// companyModel
var companySchema = new Schema({
  name: String,
  email: String,
  phone: String,
  addional_info: [additionalInfoSchema],
  child: additionalInfoSchema,
  dateTime: String
});

var company = mongoose.model("Company", companySchema);
module.exports = company;
