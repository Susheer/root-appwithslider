var mongoose = require("mongoose"); // mongoose not required ,it just for testing peorpose
var notificationCenterSchema = mongoose.Schema;
// notificationsConfigurationsModel
var notificationsConfigurationsSchema = new Schema({});

var notificationsConfigurations = mongoose.model(
  "NotificationsConfigurations",
  notificationsConfigurationsSchema
);
module.exports = notificationCenter;
