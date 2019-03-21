import React, { Component, Fragment } from "react";
import "rc-slider/assets/index.css";

import Slider from "rc-slider";
import { SLIDER_VALUE_SESSION } from "../constants";
import $ from "jquery";
import SnackbarNotification from "../Util-Component/SnackbarNotification";
const style = { width: "100%" };
const fontStyle = {
  paddingTop: "5px",
  fontSize: "14px",
  color: "black",
  fontFamily: "arial",
  fontWeight: "bold"
};
const marks = {
  "0": (
    <strong
      style={{
        paddingTop: "5px",
        fontSize: "14px",
        marginLeft: "50px",
        paddingLeft: "10px",
        color: "black",
        fontFamily: "arial",
        fontWeight: "bold"
      }}
    >
      Forever
    </strong>
  ),
  6: <strong style={fontStyle}>Year</strong>,
  12: <strong style={fontStyle}>3 Month</strong>,
  18: <strong style={fontStyle}>1 Month</strong>,
  24: <strong style={fontStyle}>15 Days</strong>,
  30: (
    <strong
      style={{
        paddingTop: "5px",
        fontSize: "14px",
        marginRight: "42px",
        color: "black",
        fontFamily: "arial",
        fontWeight: "bold"
      }}
    >
      Week
    </strong>
  )
};

class SlideCom extends Component {
  state = {
    open: false,
    snakbarMessage: "Slider data to be displayed",
    sliderFlag: false
  };

  handleSliderInput = value => {
    if (value === 0) {
      this.handleSnackBar("Fetching request based on FOREVER");
    } else if (value === 6) {
      this.handleSnackBar("Fetching data based on Year");
    } else if (value === 12) {
      this.handleSnackBar("Fetching data based on 3 Month");
    } else if (value === 18) {
      this.handleSnackBar("Fetching data based on 1 Month");
    } else if (value === 24) {
      this.handleSnackBar("Fetching data based on 15 Days");
    } else if (value === 30) {
      this.handleSnackBar("Fetching data based on Week");
    }
  };
  handleSliderQuery = value => {
    this.setState({ sliderFlag: true });

    if (value) {
      this.handleSliderInput(value);
    } else if (value === 0) {
      this.handleSliderInput(value);
    } else {
      this.handleSnackBar("Sorry: Seems you missed out somthing");
      return;
    }
    //this.handleSnackBar("");
    $.ajax({
      type: "POST",
      url: "/api/getrange?QueryId=" + value,
      success: data => {
        console.log("/api/getrange?QueryId=" + value);
        if (data.success === "true") {
          //  this.state.response.AboveRange.datasets = data.AboveRange.datasets;
          //this.state.response.WithinRange.datasets = data.WithinRange.datasets;
          //this.state.response.BelowRange.datasets = data.BelowRange.datasets;

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
          window.location.reload();
        } else {
          //this.handleSnackBar(data.Error[0].details);
          console.log("Error" + data.Error[0].details);
          this.handleSnackBar("Failed" + data.Error[0].details);
        }
      }
    }).done(({ data }) => {
      // console.log(json);
      this.setState({ sliderFlag: false });
      console.log("request completed");
    });
  };

  log = value => {
    if (value === 0) {
      console.log("Forver");

      sessionStorage.setItem(SLIDER_VALUE_SESSION, 0);
      this.handleSliderQuery(0);
    } else if (value === 6) {
      console.log("Year");
      sessionStorage.setItem(SLIDER_VALUE_SESSION, 6);
      this.handleSliderQuery(6);
    } else if (value === 12) {
      console.log("3 Month");
      sessionStorage.setItem(SLIDER_VALUE_SESSION, 12);
      this.handleSliderQuery(12);
    } else if (value === 18) {
      console.log("1 Month");
      sessionStorage.setItem(SLIDER_VALUE_SESSION, 18);
      this.handleSliderQuery(18);
    } else if (value === 24) {
      console.log("15 days");
      sessionStorage.setItem(SLIDER_VALUE_SESSION, 24);
      this.handleSliderQuery(24);
    } else if (value === 30) {
      console.log("week");
      sessionStorage.setItem(SLIDER_VALUE_SESSION, 30);
      this.handleSliderQuery(30);
    } else {
      console.log("not found");
    }
  };

  handleSnackBar = message => {
    this.state.open = true;

    this.setState({
      open: this.state.open,
      snakbarMessage: message
    });
  };

  render() {
    return (
      <React.Fragment>
        <div style={style}>
          <Slider
            railStyle={{ background: "black", height: "5px" }}
            dotStyle={{ display: "none" }}
            min={0}
            max={30}
            marks={marks}
            step={6}
            onChange={this.log}
            defaultValue={
              sessionStorage.getItem(SLIDER_VALUE_SESSION) === null
                ? 0
                : parseInt(sessionStorage.getItem(SLIDER_VALUE_SESSION))
            }
            activeDotStyle={{ border: "3px solid black ", display: "none" }}
            disabled={this.state.sliderFlag}
          />
        </div>
        <SnackbarNotification
          message={this.state.snakbarMessage}
          state={this.state}
        />
      </React.Fragment>
    );
  }
}

export default SlideCom;
