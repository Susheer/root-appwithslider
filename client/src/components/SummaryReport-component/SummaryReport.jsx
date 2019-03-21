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

class SummaryReport extends Component {
  state = {
    setRedirectToAuditTrailFlag: false,
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
    console.log("Class Report-> handleSnackBar() invoked ", this.state.open);
  };
  componentWillMount() {
    //this.getChartData();
  }
  setRedirectToAuditTrail = () => {
    this.setState({ setRedirectToAuditTrailFlag: true });
  };
  componentDidMount() {
    // get data from server
    this.getDidChartData();
    //this.loadDataFromMachine();
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
    } else if (this.state.setRedirectToAuditTrailFlag) {
      return (
        <Redirect
          to={{
            pathname: "/audit-trail",
            state: {
              bubbleId: this.props.location.state.bubbleId,
              PageName: "SUMMARY_REPORT"
            }
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
                    variant="outline-dark"
                    style={{ borderRadius: "0", paddingTop: "0px" }}
                    onClick={this.setRedirectToAuditTrail}
                  >
                    Report {this.props.location.state.bubbleId}
                  </BtsrpButton>
                  <BtsrpButton
                    active
                    variant="outline-dark"
                    style={{ borderRadius: "0", paddingTop: "0px" }}
                  >
                    Summary Report
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
                parentName="SUMMARY_REPORT"
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

  getDidChartData() {
    // check from where page is comming
    // if From Report  then load data from server
    // or else storage

    console.log("SUM_Rprt fetching data from server");
    console.log(
      "Request is sent to /api/SummaryReport?ReportId= " +
        this.props.location.state.bubbleId +
        "&DataId=" +
        this.props.location.state.DataId
    );
    $.ajax({
      type: "POST",
      url:
        "/api/SummaryReport?ReportId=" +
        this.props.location.state.bubbleId +
        "&DataId=" +
        this.props.location.state.DataId,
      success: data => {
        console.log("SummaryReport: AjexCall invoked", data);
        console.log(
          "AjexCall to /api/audittrailReportId=",
          this.props.location.state.bubbleId
        );
        if (data.success === "true") {
          console.log("data.AboveRange.datasets[]", data.AboveRange.datasets);
          this.state.response.AboveRange.datasets = data.AboveRange.datasets;
          this.state.response.WithinRange.datasets = data.WithinRange.datasets;
          this.state.response.BelowRange.datasets = data.BelowRange.datasets;

          this.setState({ response: data });
        } else {
          this.handleSnackBar(data.Error[0].details);
        }
        console.log("SummaryReport: AjexCall End");
      },
      error: err => {
        this.handleSnackBar("Something went wrong");
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

export default SummaryReport;
