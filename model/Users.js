var mongoose = require("mongoose"); // mongoose not required ,it just for testing peorpose
var Schema = mongoose.Schema;
// userModel
var userSchema = new Schema({
  company_id: {
    type: Schema.Types.ObjectId,
    ref: "Company"
  },
  plant_id: {
    type: Schema.Types.ObjectId,
    ref: "Plant"
  },
  fullname: String,
  fname: String,
  lname: String,
  email: String,
  password: String,
  role: String,
  dateTime: String
});

var user = mongoose.model("User", userSchema);
module.exports = user;
WSO2TechFlicks



async function f2() {
  var y = await 20;
  console.log(y); // 20
}
f2();

//---------------------------------------------------------------------------------------------------
var zookeepersAtThisZoo;
try {
  zookeepersAtThisZoo = await Zookeeper.find({
    zoo: req.param('zoo')
  }).limit(30);
} catch (err) {
  switch (err.name) {
    case 'UsageError': return res.badRequest(err);
    default: throw err;
  }
}

return res.json(zookeepersAtThisZoo);


var response = await promisedFunction().catch((err) => { console.log(err); });








//-----------------------------------------------------

Zookeeper.find()
.then(function (zookeepers) {...})
.catch(function (err) {...});
//
// (don't put code out here)


most prefrable is 
var zookeepersAtThisZoo;
try {
  zookeepersAtThisZoo = await Zookeeper.find({
    zoo: req.param('zoo')
  }).limit(30);
} catch (err) {
  switch (err.name) {
    case 'UsageError': return res.badRequest(err);
    default: throw err;
  }
}

return res.json(zookeepersAtThisZoo);



// helper class
var greeting = await sails.helpers.formatWelcomeMessage('Bubba');
sails.log(greeting);
// => "Hello, Bubba!"

or in other way
var greeting = await sails.helpers.formatWelcomeMessage.with({ name: 'Bubba' });

//---------------------------------------------------------------


if (sails.config.environment === 'production' && !sails.config.security.csrf) {
  throw new Error('STOP IMMEDIATELY ! CSRF should always be enabled in a production deployment!');
}



Accessing sails.config in your app
PORT=443 NODE_ENV=production sails lift
sails lift --port=1338





// tolrate
var newOrExistingContact = await Contact.create({
  emailAddress: inputs.emailAddress,
  fullName: inputs.fullName
})
.fetch()
.tolerate('E_UNIQUE');

if(!newOrExistingContact) {
  newOrExistingContact = (
    await Contact.update({ emailAddress: inputs.emailAddress })
    .set({ fullName: inputs.fullName })
    .fetch()
  )[0];
}







Exists-->
https://sailsjs.com/documentation/concepts/helpers

Model Setting

https://sailsjs.com/documentation/concepts/models-and-orm/model-settings





Atributes
https://sailsjs.com/documentation/concepts/models-and-orm/attributes


Create Requests
https://sailsjs.com/documentation/reference/waterline-orm/models/create


Actions
https://sailsjs.com/documentation/concepts/actions-and-controllers
