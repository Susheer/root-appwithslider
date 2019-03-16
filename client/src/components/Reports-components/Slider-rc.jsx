import React, { Component } from "react";
import "rc-slider/assets/index.css";
import Slider from "rc-slider";
import { SLIDER_VALUE_SESSION } from "../constants";
import $ from "jquery";

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
  state = {};

  handleSliderQuery = value => {
    let querryId = value;
    $.ajax({
      type: "POST",
      url: "/api/getrange?QueryId=" + value,
      success: data => {
        console.log("/api/getrange?QueryId=" + value);
        if (data.success === "true") {
          //  this.state.response.AboveRange.datasets = data.AboveRange.datasets;
          //this.state.response.WithinRange.datasets = data.WithinRange.datasets;
          //this.state.response.BelowRange.datasets = data.BelowRange.datasets;
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
          window.location.reload();
        } else {
          //this.handleSnackBar(data.Error[0].details);
          console.log("Error" + data.Error[0].details);
        }
      }
    }).done(function(data) {
      // console.log(json);
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

  render() {
    return (
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
        />
      </div>
    );
  }
}

export default SlideCom;
