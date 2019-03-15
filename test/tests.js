const assert = require("assert");
const connection = require("./connection");
const CompanyModel = require("../model/Company");
const PlantModel = require("../model/Plant");
const MachineModel = require("../model/Machine");
const UserModel = require("../model/Users");
describe("Company model unit testing", function() {
  // creating company
  let compModel = {};
  let plant = {};
  let machine = {};
  let user = {};
  it("Creating company", done => {
    compModel = new CompanyModel({
      name: "xyz com",
      email: "company@xyz.com",
      phone: "1234567857",
      aaditional_info: [{ key: "value" }],
      dateTime: Date.now()
    });
    // saving comapany
    compModel.save().then(() => {
      assert(compModel.isNew === false);

      done();
    });
  });

  //next test cases
  it("Adding Plant", done => {
    plant = new PlantModel({
      name: "plantA",
      company_id: compModel._id,
      dateTime: Date.now()
    });

    plant.save().then(() => {
      assert(plant.isNew === false);

      done();
    });
  });

  // next test cases
  it("Adding machine to plant", done => {
    machine = new MachineModel({
      name: "machineA",
      model: "abcModel",
      machine_id: "machine_123",
      company_id: compModel._id,
      plant_id: plant._id,
      dateTime: Date.now(),
      configUpdate: false,
      configParam: {
        data: [{ key: "value" }, { key: "value" }, { key: "value" }]
      }
    });

    machine.save().then(() => {
      assert(machine.isNew === false);

      done();
    });
  });
});

// adding users
it("Adding User", done => {
  user = new UserModel({
    company_id: "5c5439a5d395980fc07c63a4",
    plant_id: "5c5439a5d395980fc07c63a5",
    fullname: "sudheer gupta",
    fname: "sudheer",
    lname: "gupta",
    email: "sudheer.gupta@digitalshark.in",
    password: "sudheer@123",
    role: "user",
    dateTime: Date.now()
  });

  user.save().then(() => {
    assert(user.isNew === false);

    done();
  });
});

/*
describe("Searchiong Company", function(done) {
  it("FindById", function() {
    CompanyModel.findById({ _id: "5c5410d5e26ffc14fcb1cc57" })
      .then(function(result) {
        console.log(result._id);
        assert(result._id === "5c5410d5e26ffc14fcb1cc57");
        done();
      })
      .catch(Error => {
        console.error("promise error");
      });
  });
});*/
