import "date-fns";
import React, { Component } from "react";
import { Link } from "react-router-dom";
import Button from "@material-ui/core/Button";
//import StepSlider from "./StepSlider";
import Chart from "./Chart";
import CircularProgress from "@material-ui/core/CircularProgress";
import SlideCom from "./Slider-rc";

import {
  From_DATE_SESSION,
  TO_DATE_SESSION,
  SLIDER_VALUE_SESSION
} from "../constants";
//import ReplicateResponse from "../Util-Component/BlankResponse";
import SnackbarNotification from "../Util-Component/SnackbarNotification";
import "./report-style.css";

import Paper from "@material-ui/core/Paper";
import Dialog from "@material-ui/core/Dialog";
import DialogContent from "@material-ui/core/DialogContent";
import DialogActions from "@material-ui/core/DialogActions";
import { MuiPickersUtilsProvider, DatePicker } from "material-ui-pickers";
import LinearProgress from "@material-ui/core/LinearProgress";
import DateFnsUtils from "@date-io/date-fns";

import $ from "jquery";

import {
  Badge,
  Row,
  Col,
  Button as BtsrpButton,
  ButtonToolbar,
  ButtonGroup
} from "react-bootstrap";

import { Snackbar } from "@material-ui/core";
import { timingSafeEqual } from "crypto";
import { getOverlappingDaysInIntervals } from "date-fns";

class Report extends Component {
  state = {
    // 443
    dummyState: "raju",
    LProgressStatus: false,
    blockScreen: false,
    isReportBusy: false,
    count: 25,
    fileBeingProcessedSnackbaropen: false,
    fileBeingProcessedSnackbarMessage: "File is being processed. Please wait..",
    loderCircle: "",
    sliderPointer: 24, // default 15 days
    vertical: "top",
    horizontal: "center",
    isFileUploaded: false,
    fUploadPercentege: 0,
    showFileUploadProgress: "none", // none or block
    response: {
      WithinRange: {
        x_max: 120,
        x_min: 0,
        y_max: 120,
        y_min: 0,
        datasets: []
      },
      BelowRange: {
        x_max: 120,
        x_min: 0,
        y_max: 120,
        y_min: 0,
        datasets: []
      },
      AboveRange: {
        x_max: 120,
        x_min: 0,
        y_max: 120,
        y_min: 0,
        datasets: []
      }
    },
    file: {
      Name: "",
      size: "",
      type: ""
    },
    snakbarMessage: "data to be display",
    open: false, // for snack bar
    datePickerOpen: false,
    // The first commit of Material-UI

    datePickerSelectedDateFrom:
      localStorage.getItem(From_DATE_SESSION) === null
        ? new Date()
        : new Date(localStorage.getItem(From_DATE_SESSION)),
    datePickerSelectedDateTo:
      localStorage.getItem(TO_DATE_SESSION) === null
        ? new Date()
        : new Date(localStorage.getItem(TO_DATE_SESSION)).toLocaleDateString()
  };

  handleFileBeingProcessedSnackbarClick = () => {
    //this.setState({ fileBeingProcessedSnackbaropen: true });
  };

  handleFileBeingProcessedSnackbarClose = (event, reason) => {
    if (reason === "clickaway") {
      this.state.fileBeingProcessedSnackbaropen = true;
      return false;
    }
    this.setState({ fileBeingProcessedSnackbaropen: false });
  };

  handleDatePickerClickOpen = () => {
    this.setState({ datePickerOpen: true });
    console.log("handleDatePickerClickOpen()->Clicked from report component");
  };

  handleDatePickerOnPick = () => {
    this.setState({ datePickerOpen: false });
    this.getFromRange();
  };

  shouldComponentUpdate(nextProps, nextState) {
    console.log("---------------ShdComUpdt--------------------------");
    console.log("nextState-", nextState);
    console.log("this.state", this.state);

    console.log("this.state===nextState->", this.state === nextState);

    return true;
  }

  handleDatePickerClickClose = (event, reason) => {
    // console.log("[Report] Event", event);
    console.log("[Report] handleDatePickerClickClose()- Reason", reason);
    if (reason === "backdropClick") {
      this.state.datePickerOpen = true;
      return false;
    }
    this.setState({ datePickerOpen: false });
    /*   message =
      "From:" +
      this.state.datePickerSelectedDateFrom +
      " To:" +
      this.state.datePickerSelectedDateTo; */
  };

  handleDatePickerDateChangeFrom = date => {
    localStorage.setItem(From_DATE_SESSION, date);
    // alert(sessionStorage.getItem(From_DATE_SESSION));

    this.setState({ datePickerSelectedDateFrom: date });
  };
  handleDatePickerDateChangeTo = date => {
    localStorage.setItem(TO_DATE_SESSION, date);

    this.setState({ datePickerSelectedDateTo: date });
  };
  handleSnackBar = message => {
    this.setState({
      snakbarMessage: message,
      open: true
    });
    // console.log("Class Report-> handleSnackBar() invoked ", this.state.open);
  };
  componentWillMount() {
    //  this.getReportFromSession();
    // check if slider value in session
    // if null  , tassign default  slider state value e.g 24
    //if not null , assign session value to slider state , e.g sliderPinter

    this.state.sliderPointer =
      sessionStorage.getItem(SLIDER_VALUE_SESSION) === null
        ? this.state.sliderPointer
        : parseInt(sessionStorage.getItem(SLIDER_VALUE_SESSION));
    console.log("report wil mount excuted");
  }

  componentDidMount() {
    // on being report loded
    console.log("[Report] DidMount()-invoked");
    this.getDataIfReportComponentReloaded();
  }
  disableBlockScreen = () => {
    this.setState({ blockScreen: false });
  };

  enableBlockScreen = () => {
    let flag = this.state.blockScreen;
    if (!flag) {
      this.setState({ blockScreen: true });
    }
  };

  addFile = event => {
    console.log("[AddFile] eventInvoked");
    //  event.preventDefault();
    var data = new FormData();

    data.append("file", event.target.files[0]);
    // slider value as 15 days for first file upload
    // so set this value as 24 in browser
    // following method will alter the value of slider point dynamically
    // therefore slider pointer will move to 24 e.g 15 days position withought page reloaded
    // this.setState({ sliderPointer: 24 });
    //FileAjexCall
    this.enableBlockScreen();
    $.ajax({
      type: "POST",
      url: "/api/report",
      data: data,
      dataType: "JSON",
      processData: false,
      contentType: false,

      xhr: function() {
        this.setState({ showFileUploadProgress: "block" });
        console.log("xhr inside->", data);
        var jqXHR = null;
        if (window.ActiveXObject) {
          jqXHR = new window.ActiveXObject("Microsoft.XMLHTTP");
        } else {
          jqXHR = new window.XMLHttpRequest();
        }
        //Upload progress
        jqXHR.upload.addEventListener(
          "progress",
          function(evt) {
            if (evt.lengthComputable) {
              var percentComplete = Math.round((evt.loaded * 100) / evt.total);
              //Do something with upload progress

              this.setState({ fUploadPercentege: percentComplete });
              if (percentComplete === 100) {
                this.setState({
                  showFileUploadProgress: "none",
                  fUploadPercentege: 0,
                  sliderPointer: 24
                });
                this.handleFileBeingProcessedSnackbarClick();
                // this.handleSnackBar("File is uploaded .");
                this.setState({ fileBeingProcessedSnackbaropen: true });
              }

              //  console.log("Uploaded percent", percentComplete);
            }
          }.bind(this),
          false
        );
        //Download progress
        jqXHR.addEventListener(
          "progress",
          function(evt) {
            if (evt.lengthComputable) {
              var percentComplete = Math.round((evt.loaded * 100) / evt.total);
            }
          },
          false
        );
        return jqXHR;
      }.bind(this),
      success: function(data) {
        this.setState({ fileBeingProcessedSnackbaropen: false });
        if (data.success === "true") {
          // following line will save slider point value to startSession
          // so that if page reloaded, then willMount will take slider value from session and set it to
          // repport state ,
          //so that didMount will make call for to update the chart with same data using this slider value
          sessionStorage.setItem(SLIDER_VALUE_SESSION, 24);
          console.log("inside success:true");
          // follwing method will update chart with  new data if any
          this.reportResHandler(data);
        } else {
          // if response code contains 404 e.g value is not there
          let response = {
            WithinRange: {
              x_max: 120,
              x_min: 0,
              y_max: 120,
              y_min: 0,
              datasets: []
            },
            BelowRange: {
              x_max: 120,
              x_min: 0,
              y_max: 120,
              y_min: 0,
              datasets: []
            },
            AboveRange: {
              x_max: 120,
              x_min: 0,
              y_max: 120,
              y_min: 0,
              datasets: []
            }
          };

          if (data.Error[0].statusCode === 404) {
            // following method will make slider pointer at default in case of data not found
            // from server
            // when file file uploded
            //  this.sliderPointerHandler(24);

            // pass dummay response so that it could clear last data from chart
            // follwoing method will assign chart a dummay  blank response to make chart clean
            // in case data is not found from server
            this.reportResHandler(response);

            // following session statement will store value for 15 days in machine
            // so if data not found session slider point will updated
            // and if user reloads page it  didMount will take this value and assigns  back to slierPoint state
            // hence again pointer will be pointing to same position where  it was before page re-load

            sessionStorage.setItem(SLIDER_VALUE_SESSION, 24);

            // following line will snackbar on screen to update the user
            // that data is not found

            this.handleSnackBar(data.Error[0].details);
          } else {
            // if statusCode not 404 e.g somthing went wrong in processig request
            //  server side

            this.handleSnackBar(data.Error[0].details);
          }
          // this will print on console failed report
          console.log("dummyResponse:", response);
        }
        //this.setGreeting();
        // setTimeout("window.location.reload();", 2000);
      }.bind(this),
      error: ({ err }) => {
        this.handleSnackBar("Server denied the request");
      }
    }).done(({ json }) => {
      // console.log(json);
      //  sessionStorage.setItem(SLIDER_VALUE_SESSION, 24);
      // window.location.reload();
      this.setState({ fileBeingProcessedSnackbaropen: false });
      this.disableBlockScreen();
    });
  };

  setGreeting = () => {
    this.setState({
      fileBeingProcessedSnackbarMessage:
        "We appreciate your time and patience,thank you!",
      loderCircle: "none"
    });
  };

  getFromRange = () => {
    // call top progress bar
    this.enableLinearProgress();

    let fDate = new Date(this.state.datePickerSelectedDateFrom);
    let toDate = new Date(this.state.datePickerSelectedDateTo);
    // alert("from" + fDate.getTime() + " To: " + toDate.getTime());
    //data.append("file", event.target.files[0]);
    this.handleSnackBar("Request is  being process, please stay on page ");
    $.ajax({
      type: "POST",
      url: "/api/getrange?from=" + fDate.getTime() + "&to=" + toDate.getTime(),
      success: data => {
        /*  alert(
          "/api/getrange?from=" + fDate.getTime() + "&to=" + toDate.getTime()
        ); */
        if (data.success === "true") {
          this.state.response.AboveRange = data.AboveRange;
          this.state.response.WithinRange = data.WithinRange;
          this.state.response.BelowRange = data.BelowRange;
          try {
            localStorage.setItem(
              "ReportWRD",
              JSON.stringify(data.WithinRange.datasets)
            );
            localStorage.setItem(
              "ReportARD",
              JSON.stringify(data.AboveRange.datasets)
            );
            localStorage.setItem(
              "ReportBRD",
              JSON.stringify(data.BelowRange.datasets)
            );
          } catch (err) {
            console.log("[Report] GetRange: Error storing data ");
          }
          console.log("[Report] GetRange:success");

          console.log("[Report] GetRange:Recieved from server");
          // this.setState({ response: data });
          // console.log("Deta from server", data);
          // window.location.reload();

          this.setState({ open: false });
        } else {
          this.handleSnackBar(data.Error[0].details);
        }
      }
    }).done(
      function(data) {
        // console.log(json);
        // disable TopProgressBar now
        this.disableLinearProgress();
      }.bind(this)
    );
  };

  getDataIfReportComponentReloaded() {
    // show loading on top of screen
    this.enableLinearProgress();
    console.log("[Report] getDataIfReportComponentReloaded()-invoked");
    $.ajax({
      type: "POST",
      url: "/api/getrange?QueryId=" + this.state.sliderPointer,
      success: data => {
        console.log(
          "[Report] getDataIfRprtCompRlded()-> /api/getrange?QueryId=" +
            this.state.sliderPointer
        );

        if (data.success === "true") {
          this.reportResHandler(data);
          console.log("[getDataIfReprtReloadeCom]: compleated ");
        } else {
          console.log(
            "[Report]getDataIfRprtCompRlded()->" + data.Error[0].details
          );
          this.handleSnackBar(data.Error[0].details);
        }
      }
    }).done(({ data }) => {
      console.log("[getDataIfReprtReloadeCom]: ajex call completed ");
      // disable  top progress
      this.disableLinearProgress();
    });
  }
  disableLinearProgress = () => {
    let flag = this.state.LProgressStatus;
    if (flag) {
      this.setState({ LProgressStatus: false, blockScreen: false });
    }
  };

  toggleLinearProgress = () => {
    let flag = this.state.LProgressStatus;

    this.setState({ LProgressStatus: !flag });
  };

  enableLinearProgress = () => {
    let flag = this.state.LProgressStatus;
    if (!flag) {
      this.setState({ LProgressStatus: true, blockScreen: true });
    }
  };

  toggleScreenBlock = () => {
    let flag = this.state.blockScreen;
    this.setState({ blockScreen: !flag });
  };

  render() {
    const {
      datePickerSelectedDateFrom,
      datePickerSelectedDateTo,
      vertical,
      horizontal,
      fileBeingProcessedSnackbaropen,
      fileBeingProcessedSnackbarMessage,
      loderCircle
    } = this.state;

    let LinearProgressStyle = {
      marginTop: "0px",
      marginLeft: "0px",
      marginRight: "0px",
      padding: "0px",
      display: "none"
    };

    if (this.state.LProgressStatus) {
      LinearProgressStyle.display = "block";
    }

    return (
      <React.Fragment>
        <SnackbarNotification
          message={this.state.snakbarMessage}
          state={this.state}
        />

        <Snackbar
          anchorOrigin={{ vertical, horizontal }}
          open={fileBeingProcessedSnackbaropen}
          onClose={this.handleFileBeingProcessedSnackbarClose}
          ContentProps={{
            "aria-describedby": "message-id"
          }}
          message={
            <div>
              <CircularProgress
                style={{ verticalAlign: "middle", display: loderCircle }}
                thickness={8}
                disableShrink={true}
                size={20}
                variant="indeterminate"
                color="secondary"
              />
              <span
                id="message-id"
                className="text-center"
                style={{ marginLeft: "12px", display: "" }}
              >
                {fileBeingProcessedSnackbarMessage}
              </span>
            </div>
          }
        />

        <div
          style={{ background: "" }}
          className="container-fluid Jumbotron-report"
        >
          <Row style={{ border: "1px solid none", height: "15px" }}>
            <Col
              style={{
                border: "1px solid none",
                paddingLeft: "0px",
                paddingRight: "0px"
              }}
            >
              <LinearProgress style={LinearProgressStyle} />
            </Col>
          </Row>

          <Row style={{ paddingTop: "15px" }}>
            <Col xl={10} style={{ border: "none" }}>
              <Link to="/">
                <i
                  className="fas fa-home"
                  style={{
                    fontSize: "30px",
                    color: "Black"
                  }}
                >
                  <span
                    style={{
                      fontSize: "20px",
                      fontWeight: "normal"
                    }}
                  >
                    {" "}
                    Home
                  </span>
                </i>
              </Link>
              <a ref="/">
                {" "}
                <i
                  className="far fa-lightbulb"
                  style={{
                    fontSize: "30px",
                    color: "Black",
                    borderLeft: "1px solid black",
                    marginLeft: "5px",
                    paddingLeft: "5px"
                  }}
                >
                  <span
                    style={{
                      fontSize: "20px"
                    }}
                  >
                    {" "}
                    Insights
                  </span>
                </i>
              </a>
            </Col>
            <Col xl={2} style={{}} className="text-right">
              <i
                style={{}}
                className="fas fa-user-circle"
                style={{ fontSize: "40px" }}
              />
            </Col>
          </Row>
          <Row
            style={{ paddingTop: "12px", border: "none" }}
            className="justify-content-md-center"
          >
            <Col
              md={2}
              style={{
                border: "none",
                paddingTop: "6px",
                paddingLeft: "100px"
              }}
            >
              <form
                action="/api/report"
                method="post"
                encType="multipart/form-data"
                ref={a => (this._form = a)}
                onSubmit={() => {
                  return false;
                }}
              >
                <label htmlFor="fileUpload" style={{ cursor: "pointer" }}>
                  <Badge
                    variant="secondary"
                    style={{
                      borderRadius: "0",
                      boxShadow: " 5px 5px",
                      height: "27px",
                      background: "white",
                      color: "black",
                      border: "1.4px solid black",
                      width: "170px",
                      fontSize: "14px",
                      fontWeight: "normal",
                      paddingTop: "5px"
                    }}
                  >
                    <i className="fa  fa-file-excel"> </i>{" "}
                    <span>&nbsp; Add New Report</span>{" "}
                  </Badge>

                  {/*  <input
                    id="fileUpload"
                    type="file"
                    onChange={this.addFile}
                    style={{ display: "none" }}
                  />
 */}
                  <input
                    type="file"
                    onChange={this.addFile}
                    name="name"
                    id="fileUpload"
                    onClick={e => {
                      e.target.value = null;
                    }}
                    style={{ display: "none" }}
                  />
                </label>
              </form>
              <LinearProgress
                variant="determinate"
                style={{ display: this.state.showFileUploadProgress }}
                value={this.state.fUploadPercentege}
              />
            </Col>
            <Col
              md={8}
              style={{ border: "none", paddingTop: "6px" }}
              className="text-center"
            >
              <ButtonToolbar
                style={{
                  display: "block"
                }}
                aria-label="Toolbar with button groups"
              >
                <ButtonGroup
                  className="mr-2"
                  aria-label="First group"
                  style={{
                    borderRadius: "0",
                    boxShadow: " 5px 5px",
                    height: "26px",
                    padding: "0",
                    margin: "0",
                    background: "white"
                  }}
                >
                  <BtsrpButton
                    active
                    variant="outline-dark"
                    style={{ borderRadius: "0", paddingTop: "0px" }}
                  >
                    All
                  </BtsrpButton>
                  <BtsrpButton
                    variant="outline-dark"
                    style={{ borderRadius: "0", paddingTop: "0px" }}
                  >
                    Validated
                  </BtsrpButton>
                  <BtsrpButton
                    variant="outline-dark"
                    style={{ borderRadius: "0", paddingTop: "0px" }}
                  >
                    Suspect
                  </BtsrpButton>
                </ButtonGroup>
              </ButtonToolbar>
            </Col>
            <Col md={2} />
          </Row>
          <Row style={{ marginTop: "10%" }}>
            <Col xl={2} md={2} sm={2}>
              {/* blank column for space  */}
            </Col>
            <Col md={8} style={{ position: "block", maxBlockSize: "80%" }}>
              <Chart
                parentName="REPORT"
                response={this.state.response}
                location="Massachusetts"
              />
            </Col>

            <Col xl={2} md={2} sm={2} style={{ position: "block" }}>
              {/*   blank col for space */}
            </Col>
          </Row>
          <Row style={{ marginTop: "3%" }}>
            <Col md={{ offset: 3 }} style={{}} className="text-center">
              <Col
                md={{ offset: 1 }}
                style={{ border: "none", paddingTop: "6px" }}
                className="text-center"
              >
                <SlideCom
                  dummyState={this.changeDummyStateHandler}
                  reportResHandler={this.reportResHandler}
                  sliderPointerHandler={this.sliderPointerHandler}
                  sliderPointerValue={this.state.sliderPointer}
                  enableLinearProgress={this.enableLinearProgress}
                  disableLinearProgress={this.disableLinearProgress}
                />
              </Col>
            </Col>
            <Col className="float-left" style={{}} className="reportPickRange">
              <BtsrpButton
                onClick={this.handleDatePickerClickOpen}
                style={{
                  border: "none",
                  borderColor: "black",
                  background: "rgba(255,255,255,0.1)",
                  borderRadius: "0",
                  color: "black"
                }}
              >
                {" "}
                <span style={{ fontSize: "30px" }}>
                  {" "}
                  <i className="fa fa-calendar-alt" />
                </span>
                <br />
                <span style={{ fontSize: "12px", fontWeight: "bold" }}>
                  {" "}
                  Pick your range
                </span>
              </BtsrpButton>
            </Col>
          </Row>
        </div>
        {/* date picker module start*/}

        <Dialog
          open={this.state.blockScreen}
          onClose={this.disableBlockScreen}
          labelledby="draggable-dialog-title"
          style={{
            backgroundColor: "transparent",
            opacity: "0",
            cursor: "not-allowed"
          }}

          /*  PaperComponent={PaperComponent} */
        >
          <br />
        </Dialog>

        <Dialog
          open={this.state.datePickerOpen}
          onClose={this.handleDatePickerClickClose}
          labelledby="draggable-dialog-title"
          PaperComponent={PaperComponent}
        >
          <DialogContent>
            <Row style={{ border: "none" }}>
              <Col style={{ border: "none" }}>
                <MuiPickersUtilsProvider utils={DateFnsUtils}>
                  <DatePicker
                    margin="normal"
                    label="From"
                    value={datePickerSelectedDateFrom}
                    onChange={this.handleDatePickerDateChangeFrom}
                  />
                </MuiPickersUtilsProvider>
              </Col>
              <Col style={{ border: "none" }}>
                <MuiPickersUtilsProvider utils={DateFnsUtils}>
                  <DatePicker
                    margin="normal"
                    label="To"
                    value={datePickerSelectedDateTo}
                    onChange={this.handleDatePickerDateChangeTo}
                  />
                </MuiPickersUtilsProvider>
              </Col>
            </Row>
          </DialogContent>
          <DialogActions>
            <Button onClick={this.handleDatePickerClickClose} color="secondary">
              Cancel
            </Button>
            <Button onClick={this.handleDatePickerOnPick} color="secondary">
              Ok
            </Button>
          </DialogActions>
        </Dialog>
        {/* <p>DummyState{this.state.dummyState}</p> */}
        {/* <button
          onClick={this.toggleLinearProgress}
          style={{ cursor: "pointer" }}
        >
          ToggleLinearProgress
        </button> */}
      </React.Fragment>
    );
  }

  changeDummyStateHandler = newState => {
    // this.setState({ ...this.state, dummyState: newState });
  };

  sliderPointerHandler = newPointerValue => {
    this.setState({ sliderPointer: newPointerValue });
  };

  reportResHandler = newResponse => {
    console.log("[slider new data recieved ]");
    this.setState({
      response: { ...newResponse }
    });
  };

  getReportFromSession() {
    console.log("getReportFromSession() -> invoked");
    try {
      let ReportWRD = JSON.parse(localStorage.getItem("ReportWRD"));
      let ReportARD = JSON.parse(localStorage.getItem("ReportARD"));
      let ReportBRD = JSON.parse(localStorage.getItem("ReportBRD"));
      console.log("from machine ", ReportWRD);
      this.state.response.WithinRange.datasets = ReportWRD;
      this.state.response.AboveRange.datasets = ReportARD;
      this.state.response.BelowRange.datasets = ReportBRD;

      console.log("DataSet", this.state.response.WithinRange.datasets);
      //ReportWithinRngY_MIN,
      // "ReportAbovY_MIN",
      //"ReportBelowRngX_MAX",

      this.state.response.BelowRange.x_max =
        sessionStorage.getItem("ReportBelowRngX_MAX") === null
          ? this.state.response.BelowRange.x_max
          : sessionStorage.getItem("ReportBelowRngX_MAX");

      this.state.response.BelowRange.x_min =
        sessionStorage.getItem("ReportBelowRngX_MIN") === null
          ? this.state.response.BelowRange.x_min
          : sessionStorage.getItem("ReportBelowRngX_MIN");

      this.state.response.BelowRange.y_max =
        sessionStorage.getItem("ReportBelowRngY_MAX") === null
          ? this.state.response.BelowRange.y_max
          : sessionStorage.getItem("ReportBelowRngY_MAX");

      this.state.response.BelowRange.y_min =
        sessionStorage.getItem("ReportBelowRngY_MIN") === null
          ? this.state.response.BelowRange.y_min
          : sessionStorage.getItem("ReportBelowRngY_MIN");

      // Above range
      this.state.response.AboveRange.x_max =
        sessionStorage.getItem("ReportAbovX_MAX") === null
          ? this.state.response.AboveRange.x_max
          : sessionStorage.getItem("ReportAbovX_MAX");
      this.state.response.AboveRange.x_min =
        sessionStorage.getItem("ReportAbovX_MIN") === null
          ? this.state.response.AboveRange.x_min
          : sessionStorage.getItem("ReportAbovX_MIN");
      this.state.response.AboveRange.y_max =
        sessionStorage.getItem("ReportAbovY_MAX") === null
          ? this.state.response.AboveRange.y_max
          : sessionStorage.getItem("ReportAbovY_MAX");
      this.state.response.AboveRange.y_min =
        sessionStorage.getItem("ReportAbovY_MIN") === null
          ? this.state.response.AboveRange.y_min
          : sessionStorage.getItem("ReportAbovY_MIN");

      // Within Range
      this.state.response.WithinRange.x_max =
        sessionStorage.getItem("ReportWithinRngX_MAX") === null
          ? this.state.response.WithinRange.x_max
          : sessionStorage.getItem("ReportWithinRngX_MAX");
      this.state.response.WithinRange.x_min =
        sessionStorage.getItem("ReportWithinRngX_MIN") === null
          ? this.state.response.WithinRange.x_min
          : sessionStorage.getItem("ReportWithinRngX_MIN");
      this.state.response.WithinRange.y_max =
        sessionStorage.getItem("ReportWithinRngY_MAX") === null
          ? this.state.response.WithinRange.y_max
          : sessionStorage.getItem("ReportWithinRngY_MAX");
      this.state.response.WithinRange.y_min =
        sessionStorage.getItem("ReportWithinRngY_MIN") === null
          ? this.state.response.WithinRange.y_min
          : sessionStorage.getItem("ReportWithinRngY_MIN");
      //  this.setState({});
    } catch (err) {
      //mark this error ?
      console.log("Error while accessing form machine", err);
      return "Could not found data  , kindly re-upload the file";
    }
  }
  getDidChartData() {
    $.ajax({
      type: "POST",
      url: "/api/Report",
      success: data => {
        console.log("Response From server", data);
        console.log("data.AboveRange.datasets[]", data.AboveRange.datasets);
        this.state.response.AboveRange.datasets = data.AboveRange.datasets;
        this.state.response.WithinRange.datasets = data.WithinRange.datasets;
        this.state.response.BelowRange.datasets = data.BelowRange.datasets;

        this.setState({ response: data });
        /* arrayOfJsonObjects.map(arrayOfJsonObject => {
          return this.state.solardatas.push(arrayOfJsonObject);
        });

        this.pushDataToArray(this); */

        //this.setState({ solardatas: data.data });
        //solardatas.push(data.data);
      }
    });
  }
}

function PaperComponent(props) {
  return <Paper {...props} />;
}

export default Report;
