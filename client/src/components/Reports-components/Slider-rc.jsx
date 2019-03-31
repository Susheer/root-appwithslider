import React, { Component } from "react";
//import "rc-slider/assets/index.css";
import "./index.css";
//import LensIcon from "@material-ui/icons/Label";
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
    sliderFlag: false,
    onChangeSliderValue: -1
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
      // return;
    }
    //this.handleSnackBar("");
    this.props.enableLinearProgress();
    $.ajax({
      type: "POST",
      url: "/api/getrange?QueryId=" + value,
      success: data => {
        console.log("/api/getrange?QueryId=" + value);

        if (data.success === "true") {
          this.setState({ open: false });
          this.props.reportResHandler(data);
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
            this.props.sliderPointerHandler(value);

            // pass dummay response so that it could clear last data from chart
            // follwoing method will assign chart a dummay  blank response to make chart clean
            // in case data is not found from server
            this.props.reportResHandler(response);

            // following session statement will store value for 15 days in machine
            // so if data not found session slider point will updated
            // and if user reloads page it  didMount will take this value and assigns  back to slierPoint state
            // hence again pointer will be pointing to same position where  it was before page re-load

            sessionStorage.setItem(SLIDER_VALUE_SESSION, value);

            // following line will snackbar on screen to update the user
            // that data is not found

            this.handleSnackBar(data.Error[0].details);
          } else {
            // if statusCode not 404 e.g somthing went wrong in processig request
            //  server side

            this.handleSnackBar(data.Error[0].details);
          }
          // this will print on console failed report
          console.log("[Slider] dummyResponse:", response);
        }
      }
    }).done(({ data }) => {
      this.setState({ sliderFlag: false });
      this.props.disableLinearProgress();
      // this.props.dummyState("vinya");
    });
  };

  onAfterCh(value) {
    // value = this.state.onChangeSliderValue;
    console.log("after chage");
    console.log("onAfterChangeEvent", this.state.onChangeSliderValue);
    if (this.state.onChangeSliderValue === 0) {
      console.log("Forver");
      this.props.sliderPointerHandler(0); // change state in report component
      sessionStorage.setItem(SLIDER_VALUE_SESSION, 0);

      this.handleSliderQuery(0);
    } else if (this.state.onChangeSliderValue === 6) {
      console.log("Year");
      sessionStorage.setItem(SLIDER_VALUE_SESSION, 6);
      this.props.sliderPointerHandler(6); // change state in report component
      this.handleSliderQuery(6);
    } else if (this.state.onChangeSliderValue === 12) {
      console.log("3 Month");
      sessionStorage.setItem(SLIDER_VALUE_SESSION, 12);
      this.props.sliderPointerHandler(12); // change state in report component
      this.handleSliderQuery(12);
    } else if (this.state.onChangeSliderValue === 18) {
      console.log("1 Month");
      sessionStorage.setItem(SLIDER_VALUE_SESSION, 18);
      this.props.sliderPointerHandler(18); // change state in report component
      this.handleSliderQuery(18);
    } else if (this.state.onChangeSliderValue === 24) {
      console.log("15 days");
      sessionStorage.setItem(SLIDER_VALUE_SESSION, 24);
      this.props.sliderPointerHandler(24); // change state in report component
      this.handleSliderQuery(24);
    } else if (this.state.onChangeSliderValue === 30) {
      console.log("week");
      sessionStorage.setItem(SLIDER_VALUE_SESSION, 30);
      this.props.sliderPointerHandler(30); // change state in report component
      this.handleSliderQuery(30);
    } else {
      console.log("not found");
    }
  }

  onBeforeCh(value) {
    //console.log("OnBeforChange", value);
  }
  log = val => {
    // this.setState({ onChangeSliderValue: val });
    this.state.onChangeSliderValue = val;
    this.props.sliderPointerHandler(val);
    console.log("onChangeEvent", this.state.onChangeSliderValue);
  };

  handleSnackBar = message => {
    // this.state.open = true;

    this.setState({
      open: this.state.open ? true : true,
      snakbarMessage: message
    });
  };

  render() {
    let pointerValue = this.props.sliderPointerValue;
    console.log("[SliderRender] sliderPointerValue", pointerValue);
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
            value={pointerValue}
            onChange={this.log}
            onAfterChange={this.onAfterCh.bind(this)}
            onBeforeChange={this.onBeforeCh.bind(this)}
            defaultValue={
              pointerValue
            } /* {
              sessionStorage.getItem(SLIDER_VALUE_SESSION) === null
                ? 0
                : parseInt(sessionStorage.getItem(SLIDER_VALUE_SESSION))
            } */
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
