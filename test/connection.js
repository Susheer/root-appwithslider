const mongoose = require("mongoose");
const configuration = require("../config");
// connect to mongodb
// Connect to the db before tests run
mongoose.Promise = global.Promise;
before(done => {
  mongoose.connect(
    configuration.db_host + configuration.db_name,
    configuration.option
  );

  mongoose.connection
    .once("open", () => {
      console.log("connection has been made");
      done();
    })
    .on("error", () => {
      console.log("error in connection");
    });
});

//drop comopany collection before each test
