var mongoose = require("mongoose"); // mongoose not required ,it just for testing peorpose
var notificationCenterSchema = mongoose.Schema;
// notificationCenterModel
var actionLogSchema = new Schema({
  recipients: String
});

var notificationCenter = mongoose.model(
  "NotificationCenter",
  notificationCenterSchema
);
module.exports = notificationCenter;
