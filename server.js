/* global global */
// Import busboy
// for large file upload ex: more then 10GB
const excelToJson = require("convert-excel-to-json");
const busboy = require("connect-busboy");
const fs = require("fs-extra");
const path = require("path");
var cluster = require("cluster"),
  express = require("express"),
  mongoose = require("mongoose"),
  moment = require("moment"),
  app = express(),
  config = require("./config");
app.use(
  busboy({
    highWaterMark: 2 * 1024 * 1024 // Set 2MiB buffer
  })
); // Insert the busboy middle-ware

global.app = app;
global.ConvertExcelToJson = excelToJson;
global.moment = moment;
global.config = config;
global.fs = fs;
global.db = mongoose.connect(
  config.db_host + config.db_name,
  config.option,
  err => {
    if (err) console.log("database", err);
    console.log("Database connected");
  }
);
// ensure if directory exists  if not will create
const uploadPath = path.join(__dirname, config.uploadPath + "/");
fs.ensureDir(uploadPath, err => {
  console.log("directory created", err); // => null
  // dir has now been created, including the directory it is to be placed in
});
global.isMaster = false;
global.mongoose = mongoose;

/* app.use(bodyParser.urlencoded({ limit: "50mb", extended: true }));
app.use(bodyParser.json({ limit: "50mb" }));
app.use(multipart()); */
//init function

function initApp() {
  var numCPUs = require("os").cpus().length;
  if (cluster.isMaster) {
    app.listen(config.api_port).on("error", err => {
      console.log("Error handled");
    });
    // Fork workers.
    /* for (var i = 0; i < numCPUs - 1; i++) {
      cluster.fork();
    }
    cluster.on("exit", function(worker, code, signal) {
      console.log(
        "initApp1: Worker " +
          worker.process.pid +
          " died (" +
          code +
          "). restarting..."
      );
      cluster.fork();
    });
    global.isMaster = true; */
  } else {
    app.listen(config.api_port);
    console.log("[glockr.io] initialized on port " + config.api_port);
  }
}
initApp();
var apiRequest = require("./constant/apiRequest");

let pythonCtl = require("./controller/PythonController");

// POST or PUT
var putOrPostFunction = (req, res, redirectFunc) => {
  redirectFunc(req, res);
};
// GET Hello Request
app.get(config.base_url + apiRequest.get.helloRequest.url, (req, res) => {
  res.send("Hello recieved");
});

//--------------------------------------------------------------------------------------
//Python Request

// Get request for to test Python services- url:localhost:port/api/HelloPython
app.get(config.base_url + apiRequest.get.TestPython.url, (req, res) => {
  console.log("reached");

  // putOrPostFunction(req, res, pythonCtl.testPython);
  res.send("testPython");
});

// GET:http://host/port/api/Report

/* app.get(config.base_url + apiRequest.get.displayReport.url, (req, res) => {
  putOrPostFunction(req, res, pythonCtl.displayReport);
}); */

//POST FOR Python

// POST:http://host/port/api/Report
/* app.post(config.base_url + apiRequest.post.displayReport.url, (req, res) => {
  putOrPostFunction(req, res, pythonCtl.displayReport);
}); */
// UPLOAD FILE ROUTE

app.post(config.base_url + apiRequest.post.upload.url, (req, res, next) => {
  req.pipe(req.busboy); // Pipe it trough busboy

  req.busboy.on("file", (fieldname, file, filename) => {
    console.log(`Upload of '${filename}' started`);

    // Create a write stream of the new file
    const fstream = fs.createWriteStream(path.join(uploadPath, filename));
    // Pipe it trough
    file.pipe(fstream);

    // On finish of the upload
    fstream.on("close", () => {
      console.log(`Upload of '${filename}' finished`);
      req.params.fileName = filename;
      putOrPostFunction(req, res, pythonCtl.readFile);
    });
  });
});
//----------------------------------------------------------------------------------AuditTrailail
//method Post:http://HOST:port/api/AuditTrail
app.post(config.base_url + apiRequest.post.AuditTrail.url, (req, res, next) => {
  if (Object.keys(req.query).length === 0) {
    res.json({ success: false, Message: "'ReportId'  Not found" });
  } else {
    console.log("Object.keys(req.querry)", Object.keys(req.query));

    if (req.query.ReportId) {
      putOrPostFunction(req, res, pythonCtl.auditTrail);
    } else {
      res.json({
        success: false,
        Error: [{ statusCode: 400, details: "Expected value 'ReportId' " }]
      });
    }
  }
});

//method Post:http://HOST:port/api/SummaryReport
app.post(
  config.base_url + apiRequest.post.SummaryReport.url,
  (req, res, next) => {
    console.log("");
    if (Object.keys(req.query).length === 0) {
      res.json({ success: false, Message: "'ReportId , DataId'  Not found" });
    } else {
      console.log("Object.keys(req.querry)", Object.keys(req.query));

      if (req.query.ReportId) {
        if (req.query.DataId) {
          putOrPostFunction(req, res, pythonCtl.summaryReport);
        } else {
          res.json({ success: false, Message: "Expected value 'DataId' " });
        }
      } else {
        res.json({ success: false, Message: "Expected value 'ReportId' " });
      }
    }

    console.log("Post:SummaryReport End");
  }
);

//--------------------------------------------------------------------------------getrange
app.post(config.base_url + apiRequest.post.getRange.url, (req, res, next) => {
  console.log("Post:GetRange invoked");
  console.log("Object.keys(req.querry)", Object.keys(req.query));
  console.log("To and From", req.query.to + " " + req.query.from);
  if (Object.keys(req.query).length === 0) {
    return res.json({
      success: false,
      Error: [{ statusCode: 400, details: "request query is missing" }]
    });
  } else {
    if (Object.keys(req.query).length === 1) {
      if (req.query.QueryId) {
        console.log("POST: getSlider QueryId recieved", req.query.QueryId);
        putOrPostFunction(req, res, pythonCtl.getSlider);
      } else {
        return res.json({
          success: false,
          Error: [
            {
              statusCode: 400,
              details: " 'QueryId' does not contain value"
            }
          ]
        });
      }
    } else if (Object.keys(req.query).length === 2) {
      if (req.query.to && req.query.from) {
        putOrPostFunction(req, res, pythonCtl.getRange);
      } else {
        return res.json({
          success: false,
          Error: [{ statusCode: 400, details: " 'to' or 'from' is missing" }]
        });
      }
    }
  }
});

// GET: //UploadForm"
app.get(config.base_url + apiRequest.get.uploadForm.url, (req, res) => {
  res.writeHead(200, { "Content-Type": "text/html" });
  res.write(
    '<form action="upload" method="post" enctype="multipart/form-data">'
  );
  res.write('<input type="file" name="fileToUpload"><br>');
  res.write('<input type="submit">');
  res.write("</form>");
  return res.end();
});
