import "date-fns";
import React, { Component } from "react";
import { Link, Redirect } from "react-router-dom";
import Button from "@material-ui/core/Button";
//import StepSlider from "./StepSlider";
import Chart from "../Reports-components/Chart";
//this.props.location.state.bubbleId
import SnackbarNotification from "../Util-Component/SnackbarNotification";
//import "./report-style.css";
import Draggable from "react-draggable";
import Paper from "@material-ui/core/Paper";
import Dialog from "@material-ui/core/Dialog";
import DialogContent from "@material-ui/core/DialogContent";
import DialogActions from "@material-ui/core/DialogActions";
import { MuiPickersUtilsProvider, DatePicker } from "material-ui-pickers";

import DateFnsUtils from "@date-io/date-fns";
import $ from "jquery";

import {
  Row,
  Col,
  Jumbotron,
  Button as BtsrpButton,
  ButtonToolbar,
  ButtonGroup
} from "react-bootstrap";

class AuditTrail extends Component {
  state = {
    redirect: false,
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

    datePickerSelectedDateFrom: new Date("2014-08-18T21:11:54"),
    datePickerSelectedDateTo: new Date("2019-04-18T21:11:54")
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
    this.handleSnackBar(message);
  };

  handleDatePickerDateChangeFrom = date => {
    this.setState({ datePickerSelectedDateFrom: date });
  };
  handleDatePickerDateChangeTo = date => {
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
    //this.getChartData();
  }

  componentDidMount() {
    if (this.props.location.state.PageName === "REPORT") {
      // get data from server
      sessionStorage.setItem("report_id", this.props.location.state.bubbleId);
      this.getDidChartData();
      //this.loadDataFromMachine();
    } else if (this.props.location.state.PageName === "SUMMARY_REPORT") {
      this.loadDataFromMachine();
    }
  }
  setRedirect = () => {
    this.setState({ redirect: true });
  };
  renderRedirect = () => {
    if (this.state.redirect) {
      return (
        <Redirect
          to={{
            pathname: "/report"
          }}
        />
      );
    }
    //alert("render redirect");
  };

  render() {
    const { datePickerSelectedDateFrom, datePickerSelectedDateTo } = this.state;
    return (
      <React.Fragment>
        {this.renderRedirect()}
        <SnackbarNotification
          message={this.state.snakbarMessage}
          state={this.state}
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
            {/* data col*/}
            <Col
              className="text-center"
              md={12}
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
                    variant="outline-dark"
                    style={{ borderRadius: "0", paddingTop: "0px" }}
                    onClick={this.setRedirect}
                  >
                    All
                  </BtsrpButton>
                  <BtsrpButton
                    active
                    variant="outline-dark"
                    style={{ borderRadius: "0", paddingTop: "0px" }}
                  >
                    Report {this.props.location.state.bubbleId}
                  </BtsrpButton>
                </ButtonGroup>
              </ButtonToolbar>
            </Col>
            {/* data col end */}
          </Row>
          <Row style={{ marginTop: "10%" }}>
            <Col xl={2} md={2} sm={2}>
              {/* blank column for space  */}
            </Col>
            <Col xl={8} md={8} sm={8}>
              <Chart
                parentName="AUDIT_TRAIL"
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

              {/*   </Col>
                </Row>
              </Container> */}
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
        {/*   <p>ProgressStatus{this.props.location.state.bubbleId}</p> */}
      </React.Fragment>
    );
  }

  loadDataFromMachine() {
    console.log("Loadig data from machine - invoked");
    //SecondAbovX_MAX,SecondAbovX_MIN,SecondAbovY_MAX,SecondAbovY_MIN,SecondWithinRngX_MAX
    // SecondWithinRngX_MIN,SecondWithinRngY_MAX,SecondWithinRngY_MIN
    //SecondBelowRngX_MAX,SecondBelowRngY_MAX,SecondBelowRngY_MAX,SecondBelowRngY_MIN
    try {
      let AuditTrailWRD = JSON.parse(localStorage.getItem("AuditTrailWRD"));
      let AuditTrailARD = JSON.parse(localStorage.getItem("AuditTrailARD"));
      let AuditTrailBRD = JSON.parse(localStorage.getItem("AuditTrailBRD"));

      this.state.response.WithinRange.datasets = AuditTrailWRD;
      this.state.response.AboveRange.datasets = AuditTrailARD;
      this.state.response.BelowRange.datasets = AuditTrailBRD;

      this.state.response.BelowRange.x_max =
        sessionStorage.getItem("SecondBelowRngX_MAX") === null
          ? this.state.response.BelowRange.x_max
          : sessionStorage.getItem("SecondBelowRngX_MAX");

      this.state.response.BelowRange.x_min =
        sessionStorage.getItem("SecondBelowRngX_MIN") === null
          ? this.state.response.BelowRange.x_min
          : sessionStorage.getItem("SecondBelowRngX_MIN");

      this.state.response.BelowRange.y_max =
        sessionStorage.getItem("SecondBelowRngY_MAX") === null
          ? this.state.response.BelowRange.y_max
          : sessionStorage.getItem("SecondBelowRngY_MAX");

      this.state.response.BelowRange.y_min =
        sessionStorage.getItem("SecondBelowRngY_MIN") === null
          ? this.state.response.BelowRange.y_min
          : sessionStorage.getItem("SecondBelowRngY_MIN");

      //SecondAbovX_MAX,SecondAbovX_MIN
      this.state.response.AboveRange.x_max =
        sessionStorage.getItem("SecondAbovX_MAX") === null
          ? this.state.response.AboveRange.x_max
          : sessionStorage.getItem("SecondAbovX_MAX");
      this.state.response.AboveRange.x_min =
        sessionStorage.getItem("SecondAbovX_MIN") === null
          ? this.state.response.AboveRange.x_min
          : sessionStorage.getItem("SecondAbovX_MIN");
      this.state.response.AboveRange.y_max =
        sessionStorage.getItem("SecondAbovY_MAX") === null
          ? this.state.response.AboveRange.y_max
          : sessionStorage.getItem("SecondAbovY_MAX");
      this.state.response.AboveRange.y_min =
        sessionStorage.getItem("SecondAbovY_MIN") === null
          ? this.state.response.AboveRange.y_min
          : sessionStorage.getItem("SecondAbovY_MIN");

      // SecondWithinRngX_MIN,SecondWithinRngY_MAX,SecondWithinRngY_MIN
      this.state.response.WithinRange.x_max =
        sessionStorage.getItem("SecondWithinRngX_MAX") === null
          ? this.state.response.WithinRange.x_max
          : sessionStorage.getItem("SecondWithinRngX_MAX");
      this.state.response.WithinRange.x_min =
        sessionStorage.getItem("SecondWithinRngX_MIN") === null
          ? this.state.response.WithinRange.x_min
          : sessionStorage.getItem("SecondWithinRngX_MIN");
      this.state.response.WithinRange.y_max =
        sessionStorage.getItem("SecondWithinRngY_MAX") === null
          ? this.state.response.WithinRange.y_max
          : sessionStorage.getItem("SecondWithinRngY_MAX");
      this.state.response.WithinRange.y_min =
        sessionStorage.getItem("SecondWithinRngY_MIN") === null
          ? this.state.response.WithinRange.y_min
          : sessionStorage.getItem("SecondWithinRngY_MIN");
      this.setState({});
      console.log("Audit-trail$LoadDataFromMachine()$->Loaded");
      //   console.log("After setState", this.state.response.WithinRange);
    } catch (err) {
      //mark this error ?

      console.error(
        "Audit-Trail loadDataFromMachine()->Error in fetching data ",
        err
      );
    }
  }

  getDidChartData() {
    // call this method when loading data from server
    // if success==="true"
    // store data to instanse as will stire it local storage
    // then refresh
    // and call load data from machine do next work then

    // if success===false then just show then message to the page itself
    // dont call loadDataFrom machine

    localStorage.setItem("AuditTrailWRD", null);
    localStorage.setItem("AuditTrailARD", null);
    localStorage.setItem("AuditTrailBRD", null);
    console.log("fetching data from server");
    $.ajax({
      type: "POST",
      url: "/api/audittrail?ReportId=" + this.props.location.state.bubbleId,
      success: data => {
        console.log(
          "AjexCall to /api/audittrailReportId=",
          this.props.location.state.bubbleId
        );
        console.log("Audit-trail: $.ajex()'s block:", data);

        if (data.success === "true") {
          console.log("Audit-trail:$.ajex():success_block:true");

          this.state.response.AboveRange.datasets = data.AboveRange.datasets;
          this.state.response.WithinRange.datasets = data.WithinRange.datasets;
          this.state.response.BelowRange.datasets = data.BelowRange.datasets;

          this.state.response.AboveRange.x_max = data.AboveRange.x_max;
          this.state.response.AboveRange.x_min = data.AboveRange.x_min;
          this.state.response.AboveRange.y_max = data.AboveRange.y_max;
          this.state.response.AboveRange.y_min = data.AboveRange.y_min;

          this.state.response.BelowRange.x_max = data.BelowRange.x_max;
          this.state.response.BelowRange.x_min = data.BelowRange.x_min;
          this.state.response.BelowRange.y_max = data.BelowRange.y_max;
          this.state.response.BelowRange.y_min = data.BelowRange.y_min;

          this.state.response.WithinRange.x_max = data.WithinRange.x_max;
          this.state.response.WithinRange.x_min = data.WithinRange.x_min;
          this.state.response.WithinRange.y_max = data.WithinRange.y_max;
          this.state.response.WithinRange.y_min = data.BelowRange.y_min;

          try {
            console.info("data.WithinRange.x_max", data.WithinRange.x_max);
            console.info("data.AboveRange.x_max", data.AboveRange.x_max);
            //Above Range X,Y (MIN , Max)
            // key

            sessionStorage.setItem(
              "SecondAbovX_MAX",
              Math.ceil(data.AboveRange.x_max)
            );
            console.info(
              "session -",
              sessionStorage.getItem("SecondAbovX_MAX")
            );
            sessionStorage.setItem(
              "SecondAbovX_MIN",
              Math.ceil(data.AboveRange.x_min)
            );
            sessionStorage.setItem(
              "SecondAbovY_MAX",
              Math.ceil(data.AboveRange.y_max)
            );
            sessionStorage.setItem(
              "SecondAbovY_MIN",
              Math.ceil(data.AboveRange.x_min)
            );
            //WithinRange Range X,Y (MIN , Max)
            sessionStorage.setItem(
              "SecondWithinRngX_MAX",
              Math.ceil(data.WithinRange.x_max)
            );
            sessionStorage.setItem(
              "SecondWithinRngX_MIN",
              Math.ceil(data.WithinRange.x_min)
            );
            sessionStorage.setItem(
              "SecondWithinRngY_MAX",
              Math.ceil(data.WithinRange.y_max)
            );
            sessionStorage.setItem(
              "SecondWithinRngY_MIN",
              Math.ceil(data.WithinRange.y_min)
            );

            //BelowRange Range X,Y (MIN , Max)
            sessionStorage.setItem(
              "SecondBelowRngX_MAX",
              Math.ceil(data.BelowRange.x_max)
            );
            sessionStorage.setItem(
              "SecondBelowRngX_MIN",
              Math.ceil(data.BelowRange.x_min)
            );
            sessionStorage.setItem(
              "SecondBelowRngY_MAX",
              Math.ceil(data.BelowRange.y_max)
            );
            sessionStorage.setItem(
              "SecondBelowRngY_MIN",
              Math.ceil(data.BelowRange.y_min)
            );
            // B
          } catch (err) {
            console.error("Audit-trail: error while saveing to ls");
          }
          //  this.setState({ response: data });
          localStorage.setItem(
            "AuditTrailWRD",
            JSON.stringify(data.WithinRange.datasets)
          );
          localStorage.setItem(
            "AuditTrailARD",
            JSON.stringify(data.AboveRange.datasets)
          );
          localStorage.setItem(
            "AuditTrailBRD",
            JSON.stringify(data.BelowRange.datasets)
          );
        } else {
          this.handleSnackBar(data.Error[0].details);
        }
        //  this.handleSnackBar("Audit-trail: Response came from server ");
        // window.location.reload();
        this.setState({});
      },
      error: err => {
        this.handleSnackBar("Server connection failed. ");
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

export default AuditTrail;
