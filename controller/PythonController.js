//var python=require("../PythonScripts/Hello.py")
var exec = require("child_process").exec;
var spawn = require("child_process").spawn;
const path = require("path");
let uploadPath = path.join(__dirname, config.uploadPath + "/");
let PythonController = {
  getNewReport: function(req, res) {},
  callName: function(req, res) {
    console.log("request reached");
    var processd = spawn("python", [
      "./Hello.py",
      req.query.Name,
      req.query.LastName
    ]);

    // Takes stdout data from script which executed
    // with arguments and send this data to res object
    processd.stdout.on("data", function(data) {
      console.log(data.toString());
      res.write(data);
      res.end("end");
    });
    //res.send("ok" + req.query.Name);
  },
  displayReport: function(req, res) {
    var processd = spawn("python", ["./DemoJsonReturn.py"]);

    // Takes stdout data from script which executed
    // with arguments and send this data to res object
    processd.stdout.on("data", function(data) {
      console.log(typeof JSON.parse(data));

      // res.send(JSON.parse(data.toString()));
      res.send(JSON.parse(data));
    });
  },
  testPython: function(req, res) {
    //res.json({ TestLine: true });
    console.log("testPython:Processing");
    var processd = spawn("python", ["./ReadFile.py"]);

    processd.stdout.on("data", function(data) {
      // console.log(data.toString());

      res.json({ Data: JSON.parse(data) });
      console.log("testPython:Done");
    });
  },
  readFile: function(req, res) {
    console.log("PythonCtl->readFile action invoked");
    console.log(
      "PythonCtl->readFile-FileName" + (uploadPath + req.params.fileName)
    );

    let processd = spawn("python", [
      "./ReadFile.py",
      req.params.fileName,
      req.query.Argv_2
    ]);
    let result = "";
    processd.stdout.on("data", data => {
      // returned as buffer  hence  need to convert in std JSON
      result += data.toString();
    });

    processd.stdout.on("end", () => {
      try {
        // If JSON handle the data
        let jsonResponse = JSON.parse(result);

        res.send(jsonResponse);
        // console.log(JSON.parse(result));
      } catch (e) {
        // Otherwise treat as a log entry

        console.log(e);
        //  console.log("Error", result);
        return res.json({
          success: false,
          Error: [
            {
              statusCode: 400,
              details: config.ErrorMsg.ParsingErr
            }
          ]
        });
      }
    });
    processd.on("error", err => {
      console.log("python Error : ", err);
    });
    processd.on("exit", (code, signal) => {
      console.log(
        "Python:- Process- Code '" + code + "' Signal-'" + signal + "' "
      );
      console.log("response compleated");
    });

    //res.json({ readFileAction: true });
  },
  auditTrail: function(req, res) {
    console.log("reportId->", req.query.ReportId);
    let processd = spawn("python", ["./SecondGraph.py", req.query.ReportId]);
    let result = "";
    processd.stdout.on("data", data => {
      console.log("Python Code SecondGraph started");
      result += data.toString();
    });

    processd.stdout.on("end", () => {
      try {
        // If JSON handle the data
        console.log("Python Code SecondGraph stdout end invoked");
        let jsonResponse = JSON.parse(result);

        res.send(jsonResponse);
        // console.log(JSON.parse(result));
      } catch (e) {
        //console.log(result);
        console.log(e);
        return res.json({
          success: false,
          Error: [
            {
              statusCode: 400,
              details: config.ErrorMsg.ParsingErr
            }
          ]
        });
      }
    });
    processd.on("error", err => {
      console.log("Python Code SecondGraph err invoked-", err);
    });
    processd.on("exit", (code, signal) => {
      //console.log(result.toString());
      console.log(
        "Python Code SecondGraph err invoked-'" +
          code +
          "' Signal-'" +
          signal +
          "' "
      );
      console.log("audit tril completed");
    });

    // res.json({ auditTrail: "Report id" + req.query.ReportId });
  },
  getRange: function(req, res) {
    console.log("getRange action  invoked");
    let processd = spawn("python", [
      "./Slider_Report.py",
      req.query.from,
      req.query.to
    ]);
    let result = "";
    processd.stdout.on("data", data => {
      console.log("Python Code Slider_Report.py started");
      result += data.toString();
    });

    processd.stdout.on("end", () => {
      try {
        // If JSON handle the data
        //console.log("Python Code Slider_Report.py stdout end invoked");
        console.log(result.toString());
        let jsonResponse = JSON.parse(result);

        res.send(jsonResponse);
        // console.log(JSON.parse(result));
      } catch (e) {
        // Otherwise treat as a log entry
        console.log("Parsing Error:" + e);
        //console.log(result.toString());
        return res.json({
          success: false,
          Error: [
            {
              statusCode: 400,
              details: config.ErrorMsg.ParsingErr
            }
          ]
        });
      }
    });
    processd.on("error", err => {
      console.log("Python Code SecondGraph err invoked-", err);
    });
    processd.on("exit", (code, signal) => {
      console.log(
        "Python Code SecondGraph Exit invoked-'" +
          code +
          "' Signal-'" +
          signal +
          "' "
      );
      console.log("GetRange action  completed");
    });

    // res.json({ auditTrail: "Report id" + req.query.ReportId });
  },
  getSlider: function(req, res) {
    console.log("getSlider action  invoked");
    let processd = spawn("python", ["./getSlider.py", req.query.QueryId]);
    let result = "";
    processd.stdout.on("data", data => {
      console.log("Python Code getSlider.py started");
      result += data.toString();
      // console.log(result);
    });

    processd.stdout.on("end", () => {
      try {
        // If JSON handle the data
        //console.log("Python Code Slider_Report.py stdout end invoked");
        // console.log(result.toString());
        let jsonResponse = JSON.parse(result);

        return res.send(jsonResponse);
        // console.log(JSON.parse(result));
      } catch (e) {
        // Otherwise treat as a log entry
        //console.log(result);
        console.log("[GetSlider]", e);
        //console.log(result.toString());
        // console.log(result);
        return res.json({
          success: false,
          Error: [
            {
              statusCode: 400,
              details: config.ErrorMsg.ParsingErr
            }
          ]
        });
      }
    });
    processd.on("error", err => {
      console.log("Python Code getSlider.py err invoked-", err);
    });
    processd.on("exit", (code, signal) => {
      console.log(
        "Python Code getSlider.py Exit invoked-'" +
          code +
          "' Signal-'" +
          signal +
          "' "
      );
      console.log("getSlider action  completed");
    });

    // res.json({ auditTrail: "Report id" + req.query.ReportId });
  },
  summaryReport: function(req, res) {
    console.log("Post:Summary Report");
    let processd = spawn("python", [
      "./ThirdPage.py",
      req.query.ReportId,
      req.query.DataId
    ]);
    let result = "";
    processd.stdout.on("data", data => {
      console.log("Python Code ThriedPage.py started");
      result += data.toString();
    });

    processd.stdout.on("end", () => {
      try {
        // If JSON handle the data
        console.log("Python Code ThriedPage.py stdout end invoked");
        let jsonResponse = JSON.parse(result);

        res.send(jsonResponse);
        // console.log(JSON.parse(result));
      } catch (e) {
        // Otherwise treat as a log entry
        /*   return res.json({
          success: false,
          Error: [
            {
              statusCode: 400,
              details:  config.ErrorMsg.ParsingErr
            }
          ]
        }); */
        return res.json({
          success: false,
          Error: [
            {
              statusCode: 400,
              details: config.ErrorMsg.PointError
            }
          ]
        });
        //console.log("[SummaryReport] result in catch", result);
      }
    });
    processd.on("error", err => {
      console.log("Python Code ThriedPage.py err invoked-", err);
    });
    processd.on("exit", (code, signal) => {
      console.log(
        "Python Code ThriedPage.py err invoked-'" +
          code +
          "' Signal-'" +
          signal +
          "' "
      );
    });

    console.log("Summary Report completed compleated");

    // res.json({ auditTrail: "Report id" + req.query.ReportId });
  }
};

module.exports = PythonController;
