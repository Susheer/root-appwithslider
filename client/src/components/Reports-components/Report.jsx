import "date-fns";
import React, { Component } from "react";
import { Link } from "react-router-dom";
import Button from "@material-ui/core/Button";
//import StepSlider from "./StepSlider";
import Chart from "./Chart";
import CircularProgress from "@material-ui/core/CircularProgress";
import SlideCom from "./Slider-rc";
import { inspect } from "util"; // or directly
import { From_DATE_SESSION, TO_DATE_SESSION } from "../constants";

import SnackbarNotification from "../Util-Component/SnackbarNotification";
import "./report-style.css";
import Draggable from "react-draggable";
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
  Jumbotron,
  Button as BtsrpButton,
  ButtonToolbar,
  ButtonGroup
} from "react-bootstrap";

import { Snackbar } from "@material-ui/core";
import { timingSafeEqual } from "crypto";

class Report extends Component {
  state = {
    fileBeingProcessedSnackbaropen: false,

    vertical: "top",
    horizontal: "center",
    isFileUploaded: false,
    fUploadPercentege: 0,
    showFileUploadProgress: "none", // none or block
    response: {
      WithinRange: { datasets: [] },
      BelowRange: {
        datasets: []
      },
      AboveRange: {
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
        : new Date(localStorage.getItem(TO_DATE_SESSION))
  };

  handleFileBeingProcessedSnackbarClick = () => {
    //this.setState({ fileBeingProcessedSnackbaropen: true });
  };

  handleFileBeingProcessedSnackbarClose = () => {
    this.setState({ fileBeingProcessedSnackbaropen: false });
  };

  handleDatePickerClickOpen = () => {
    this.setState({ datePickerOpen: true });
    console.log("handleDatePickerClickOpen()->Clicked from report component");
  };

  handleDatePickerClickClose = () => {
    let message = this.setState({ datePickerOpen: false });
    message =
      "From:" +
      this.state.datePickerSelectedDateFrom +
      " To:" +
      this.state.datePickerSelectedDateTo;

    // this.handleSnackBar(TO_DATE_SESSION + message);
    this.getFromRange();
  };

  handleDatePickerDateChangeFrom = date => {
    localStorage.setItem(From_DATE_SESSION, date);
    // alert(localStorage.getItem(From_DATE_SESSION));

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
    console.log("Class Report-> handleSnackBar() invoked ", this.state.open);
  };
  componentWillMount() {
    this.getReportFromSession();
  }

  componentDidMount() {
    // this.getDidChartData();
  }

  addFile = event => {
    //  event.preventDefault();
    var data = new FormData();

    data.append("file", event.target.files[0]);

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
                  fUploadPercentege: 0
                });
                this.handleFileBeingProcessedSnackbarClick();
                // this.handleSnackBar("File is uploaded .");
                this.setState({ fileBeingProcessedSnackbaropen: true });
              }

              console.log("Uploaded percent", percentComplete);
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
              //Do something with download progress
              console.log("Downloaded percent", percentComplete);
            }
          },
          false
        );
        return jqXHR;
      }.bind(this),
      success: function(data) {
        //Do something success-ish
        // console.log("Ajex response", data);
        //console.log("data.AboveRange.datasets[]", data["AboveRange"]);
        this.setState({
          fileBeingProcessedSnackbaropen: false
        });
        if (data.success === "true") {
          this.state.response.AboveRange.datasets = data.AboveRange.datasets;
          this.state.response.WithinRange.datasets = data.WithinRange.datasets;
          this.state.response.BelowRange.datasets = data.BelowRange.datasets;

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
        } else {
          try {
            this.handleSnackBar(data.Error[0].details);
          } catch (err) {}
        }
      }.bind(this),
      error: err => {
        alert(err);
      }
    }).done(function(json) {
      // console.log(json);
      window.location.reload();
    });
  };

  getFromRange = () => {
    //  event.preventDefault();
    // var data = new FormData();
    let fDate = new Date(this.state.datePickerSelectedDateFrom.toDateString());
    let toDate = new Date(this.state.datePickerSelectedDateTo.toDateString());
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
          this.state.response.AboveRange.datasets = data.AboveRange.datasets;
          this.state.response.WithinRange.datasets = data.WithinRange.datasets;
          this.state.response.BelowRange.datasets = data.BelowRange.datasets;
          console.log("data is plotting");
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
          console.log("Data fetched from server");
          this.setState({ response: data });
        } else {
          this.handleSnackBar(data.Error[0].details);
        }

        /* arrayOfJsonObjects.map(arrayOfJsonObject => {
          return this.state.solardatas.push(arrayOfJsonObject);
        });

        this.pushDataToArray(this); */

        //this.setState({ solardatas: data.data });
        //solardatas.push(data.data);
      }
    }).done(function(data) {
      // console.log(json);
      window.location.reload();
    });
  };

  render() {
    const {
      datePickerSelectedDateFrom,
      datePickerSelectedDateTo,
      vertical,
      horizontal,
      fileBeingProcessedSnackbaropen
    } = this.state;

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
                style={{ verticalAlign: "middle" }}
                thickness={8}
                disableShrink={true}
                size={20}
                variant="indeterminate"
                color="secondary"
              />
              <span
                id="message-id"
                className="text-center"
                style={{ marginLeft: "12px" }}
              >
                File is being processed. Please wait..
              </span>
            </div>
          }
        />
        <Jumbotron style={{ paddingTop: "10px" }}>
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
          <Row style={{ paddingTop: "12px" }}>
            <Col
              md={{ offset: 1 }}
              style={{ border: "none", paddingTop: "6px" }}
              className="text-center"
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
              md={{ offset: 1 }}
              style={{ border: "none", paddingTop: "6px" }}
              className="text-center"
            >
              <ButtonToolbar
                style={{
                  padding: "0",
                  margin: "0",
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
            <Col
              md={{ offset: 4 }}
              style={{ border: "none", paddingTop: "6px" }}
            />
          </Row>
          <Row style={{ marginTop: "10%" }}>
            <Col xl={2} md={2} sm={2}>
              {/* blank column for space  */}
            </Col>
            <Col xl={8} md={8} sm={8}>
              <Chart
                parentName="REPORT"
                response={this.state.response}
                location="Massachusetts"
              />
            </Col>

            <Col xl={2} md={2} sm={2}>
              {/*   blank col for space */}
            </Col>
          </Row>
          <Row style={{ marginTop: "10%" }}>
            {" "}
            <Col
              md={{ offset: 1 }}
              style={{ border: "none", paddingTop: "6px" }}
              className="text-center"
            >
              {/*  <Container>
                <Row>
                  <Col sm={1} xl={12} md={8}> */}
              <SlideCom />
              {/*   </Col>
                </Row>
              </Container> */}
            </Col>
            <Col
              md={{}}
              className="float-left"
              style={{ border: "none", marginTop: "-25px" }}
            >
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
          </Row>{" "}
        </Jumbotron>
        {/* date picker module start*/}
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
            <Button onClick={this.handleDatePickerClickClose} color="secondary">
              Pick
            </Button>
          </DialogActions>
        </Dialog>
        {/*   <p>ProgressStatus{this.state.showFileUploadProgress}</p> */}
      </React.Fragment>
    );
  }

  getReportFromSession() {
    console.log("getReportFromSession() -> invoked");
    try {
      let ReportWRD = JSON.parse(localStorage.getItem("ReportWRD"));
      let ReportARD = JSON.parse(localStorage.getItem("ReportARD"));
      let ReportBRD = JSON.parse(localStorage.getItem("ReportBRD"));

      //console.log("Response from local Storage", ReportWRD);
      this.state.response.WithinRange.datasets = ReportWRD;
      this.state.response.AboveRange.datasets = ReportARD;

      this.state.response.BelowRange.datasets = ReportBRD;
      //this.state.response.BelowRange.datasets = response.BelowRange.datasets;
      //this.state.response.AboveRange.datasets = response.AboveRange.datasets;
      this.setState();

      //   console.log("After setState", this.state.response.WithinRange);
    } catch (err) {
      //mark this error ?
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
  return (
    <Draggable>
      <Paper {...props} />
    </Draggable>
  );
}

export default Report;
