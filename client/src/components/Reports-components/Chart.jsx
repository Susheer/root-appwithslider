import React, { Component } from "react";

import { Col, Row } from "react-bootstrap";
import { Bubble } from "react-chartjs-2";
import { Chart } from "react-chartjs-2";
import SnackbarNotification from "../Util-Component/SnackbarNotification";

import { Redirect } from "react-router-dom";
import * as zoom from "chartjs-plugin-zoom";
//import {} from "../constants";
//import { min } from "date-fns";
//import { func } from "prop-types";

const TotleNumber = ({ value }) => (
  <div
    className="badge badge-info"
    style={{
      marginTop: "57px",
      marginLeft: "100px",
      fontSize: "24px",
      fontFamily: "arial"
    }}
  >
    {value}
  </div>
);

const Note = ({ value }) => (
  <div>
    <br />
    <br />

    <p className="text-center">
      <span className="font-weight-bold">Note:</span> {value}
    </p>
  </div>
);

class Chartjs_2 extends Component {
  state = {
    bubbleId: 0,
    displayNote: false,
    pageIdentity: this.props.parentName,
    redirect: false,
    response: this.props.response,
    open: false,
    snakbarMessage: "Please wait...",
    xmax: 0,
    disableAboveRangeChart: false,
    disableWithinRangeChart: false,
    disableBelowRangeChart: false
  };
  setRedirect = bubble => {
    this.setState({ bubbleId: bubble, redirect: true });
  };

  keepTooltipOpenPlugin = {
    beforeRender: function(chart) {
      // We are looking for bubble which owns "keepTooltipOpen" parameter.
      var datasets = chart.data.datasets;

      chart.pluginTooltips = [];

      for (let i = 0; i < datasets.length; i++) {
        for (let j = 0; j < datasets[i].data.length; j++) {
          if (
            datasets[i].data[j].keepTooltipOpen &&
            !chart.getDatasetMeta(i).hidden
          ) {
            //When we find one, we are pushing all informations to create the tooltip.
            chart.ctx.strokeStyle = "red";
            chart.pluginTooltips.push(
              new Chart.Tooltip(
                {
                  _chart: chart.chart,
                  _chartInstance: chart,
                  _data: chart.data,
                  _options: chart.options.tooltips,
                  _active: [chart.getDatasetMeta(i).data[j]]
                },
                chart
              )
            );
          }
        }
      }
    }, // end beforeRender

    afterDatasetsDraw: function(chart, easing) {
      // Draw tooltips

      Chart.helpers.each(chart.pluginTooltips, function(tooltip) {
        tooltip.initialize();
        tooltip.update();
        tooltip.pivot();
        tooltip.transition(easing).draw();
      });
    }, // end afterDatasetsDraw
    afterUpdate: function(chart) {
      // chart.config.data.datasets[0]._meta[0].data[0]._model.pointStyle = logo;
    }
  };

  componentWillMount() {
    Chart.pluginService.register(this.keepTooltipOpenPlugin);
  }

  chartReference = {};
  chartOpt = {
    tooltips: {
      displayColors: false,
      callbacks: {
        label: function(tooltipItem, data) {
          var datasetLabel = "";
          // var label = data.labels[tooltipItem.index];
          var label = data.datasets[tooltipItem.datasetIndex].label || "";
          if (data.datasets.length === 1) {
            // console.log("One tooltips found", data.datasets[0]);
            // object exists in data array
            if (data.datasets[0].data.length === 1) {
              // check if tooltips key is exists
              let flag = Object.keys(data.datasets[0].data[0]).includes(
                "keepTooltipOpen"
              );

              if (flag) {
                console.log("[Chart.js] point detected");
                let arr = label.split(",");
                label = arr;
              }
            }
          } else {
            let arr2 = label.split(",");
            label = arr2;
          }

          return label;
        }
      },
      custom: function(tooltip) {
        if (!tooltip) return;
        tooltip.displayColors = false;
      }
    },
    maintainAspectRatio: false,
    pan: {
      enabled: true,
      mode: "xy"
    },
    zoom: {
      enabled: true,
      mode: "xy"
    },
    layout: {
      padding: { left: 0, right: 0, top: 0, bottom: 0 }
    },
    maintainAspectRatio: false,
    responsive: true
  };

  renderRedirect = () => {
    if (this.state.redirect) {
      if (this.state.pageIdentity) {
        switch (this.state.pageIdentity) {
          case "REPORT":
            /*  alert(
              "Report id " +
                this.state.bubbleId +
                " page ientity " +
                this.state.pageIdentity
            ); */
            return (
              <Redirect
                to={{
                  pathname: "/audit-trail",
                  state: { bubbleId: this.state.bubbleId, PageName: "REPORT" }
                }}
              />
            );

          case "AUDIT_TRAIL":
            /* alert(
              "Data id " +
                this.state.bubbleId +
                " page ientity " +
                this.state.pageIdentity +
                "SessionId as ReportiD" +
                sessionStorage.getItem("report_id")
            ); */
            return (
              <Redirect
                to={{
                  pathname: "/SummaryReport",
                  state: {
                    DataId: this.state.bubbleId, // bubble id as data id
                    bubbleId: sessionStorage.getItem("report_id"),
                    PageName: "AUDIT_TRAIL"
                  }
                }}
              />
            );
        }
      }
    }
  };
  handleSnackBar = () => {
    this.state.open = true;

    this.setState({
      open: this.state.open,
      snakbarMessage: this.state.snakbarMessage
    });
    console.log("Class Chart-> handleSnackBar() invoked ", this.state.open);
  };

  handleBubble = element => {
    console.log("onClick Handler", this.chartReference);
    if (element.length > 0) {
      // Logs it
      // console.log("data is t", element[0]._chart.config.data);

      // Here we get the data linked to the clicked bubble ...
      var datasetLabel =
        element[0]._chart.config.data.datasets[element[0]._datasetIndex].label;
      //console.log("dataLinked to the bubble->", datasetLabel);
      // data gives you `x`, `y` and `r` values
      /* var data =
        element[0]._chart.config.data.datasets[element[0]._datasetIndex].data[
          element[0]._index
        ]; */

      var data =
        element[0]._chart.config.data.datasets[element[0]._datasetIndex];
    }
    //alert("dateToBe" + data);
    if (typeof data !== "undefined") {
      this.state.snakbarMessage =
        "X:" + data.x + " Y:" + data.y + " Index:" + data.r;

      //console.log("snakbar bar message", this.state.snakbarMessage);
      /*  this.handleSnackBar(); */
      {
        /* <button onClick={this.setRedirect}>Redirect</button> */
      }
      // console.log("BubbleId", data.label.trim().slice(-1));

      let data1 = data.label.trim().split(",")[0];
      console.warn("PointClicked", data1);
      let val = data1.trim().split(" ");
      if (val) {
        if (val.length === 1) {
          this.setRedirect(val[0].trim());
          // console.log("bubble lable for length 0", val[0]);
        } else if (val.length === 2) {
          this.setRedirect(val[1].trim());
          //  console.log("bubble lable for length 1", val[1]);
        }
      } else {
        this.handleSnackBar("Column not found");
        return;
      }
    }
  };
  componentDidMount() {
    // console.log(this.chartReference);
    console.log("[Chart]: Chart Data", this.state.response);
  }

  static defaultProps = {
    displayTitle: false,
    displayLegend: true,
    legendPosition: "right",
    location: "City"
  };

  render() {
    const { AboveRange, WithinRange, BelowRange } = this.props.response;
    let Alen, Blen, Wlen;
    console.warn("AboveRange in render ", AboveRange);
    console.warn("BelowRange range in render", BelowRange);
    console.warn("WithinRange in render", WithinRange);
    let RngConditionText = " if > 200 ";

    console.log("PageIdentity", this.state.pageIdentity);
    if (this.state.pageIdentity === "REPORT") {
      Alen = AboveRange.datasets.length;
      Blen = BelowRange.datasets.length;
      Wlen = WithinRange.datasets.length;
      let len = {
        AboveLength: Alen,
        BelowLen: Blen,
        WithinLen: Wlen
      };

      if (Alen > 200) {
        this.state.disableAboveRangeChart = true;
      } else {
        this.state.disableAboveRangeChart = false;
      }
      if (Blen > 200) {
        this.state.disableBelowRangeChart = true;
      } else {
        this.state.disableBelowRangeChart = false;
      }
      if (Wlen > 200) {
        this.state.disableWithinRangeChart = true;
      } else {
        this.state.disableWithinRangeChart = false;
      }
      if (
        this.state.disableBelowRangeChart ||
        this.state.disableBelowRangeChart ||
        this.state.disableAboveRangeChart
      ) {
        this.state.displayNote = true;
      } else {
        this.state.displayNote = false;
      }
      console.log("------------Report page-------------- ");
      console.log("TotalLength", len);
    }

    return (
      <React.Fragment>
        {this.renderRedirect()}

        <Row className="chartTable">
          <Col xl={4} md={4} sm={4} className="chartBelowRange">
            <div style={{}} className="text-center chartBeloRangeCaption">
              <p>Below Range</p>
            </div>
            <div>
              {this.state.disableBelowRangeChart ? (
                <TotleNumber value={Blen} />
              ) : (
                <Bubble
                  ref="chart1"
                  type="bubble"
                  data={BelowRange}
                  options={{
                    responsive: true,
                    aspectRatio: false,
                    tooltips: {
                      displayColors: false,
                      callbacks: {
                        label: function(tooltipItem, data) {
                          var datasetLabel = "";
                          // var label = data.labels[tooltipItem.index];
                          var label =
                            data.datasets[tooltipItem.datasetIndex].label || "";

                          if (data.datasets.length === 1) {
                            // console.log("One tooltips found", data.datasets[0]);
                            // object exists in data array
                            if (data.datasets[0].data.length === 1) {
                              // check if tooltips key is exists
                              let flag = Object.keys(
                                data.datasets[0].data[0]
                              ).includes("keepTooltipOpen");

                              if (flag) {
                                console.log("[Chart.js] point detected");
                                let arr = label.split(",");
                                label = arr;
                              }
                            }
                          }
                          return label;
                        }
                      },
                      custom: function(tooltip) {
                        if (!tooltip) return;
                        tooltip.displayColors = false;
                      }
                    },
                    animation: {
                      duration: 0
                    },
                    hover: {
                      animationDuration: 0
                    },
                    maintainAspectRatio: false,
                    pan: {
                      enabled: true,
                      mode: "xy"
                    },
                    zoom: {
                      enabled: true,
                      mode: "xy"
                    },

                    layout: {
                      padding: {}
                    },
                    scales: {
                      xAxes: [
                        {
                          type: "linear",
                          position: "bottom",
                          display: false,
                          ticks: {
                            // below range
                            max: parseInt(BelowRange.x_max),

                            min: parseInt(BelowRange.x_min) //BelowRange.x_min
                          }
                        }
                      ],
                      yAxes: [
                        {
                          type: "linear",
                          display: false,
                          ticks: {
                            min: parseInt(BelowRange.y_min),
                            max: parseInt(BelowRange.y_max) //
                          }
                        }
                      ]
                    }
                  }}
                  legend={{ display: false }}
                  getElementAtEvent={this.handleBubble}
                />
              )}
            </div>
          </Col>

          <Col md={4} className="chartWithinRange">
            <div className="chartWithinRangeCaption text-center">
              <p>Within Range</p>
            </div>
            <div>
              {this.state.disableWithinRangeChart ? (
                <TotleNumber value={Wlen} />
              ) : (
                <Bubble
                  ref={reference => (this.chartReference = reference)}
                  type="bubble"
                  data={WithinRange}
                  options={{
                    ...this.chartOpt,
                    responsive: true,
                    aspectRatio: false,
                    animation: {
                      duration: 0
                    },
                    hover: {
                      animationDuration: 0
                    },
                    scales: {
                      xAxes: [
                        {
                          type: "linear",
                          position: "bottom",
                          display: false,
                          ticks: {
                            // below range
                            max: parseInt(WithinRange.x_max),

                            min: parseInt(WithinRange.x_min) //BelowRange.x_min
                          }
                        }
                      ],
                      yAxes: [
                        {
                          type: "linear",
                          display: false,
                          ticks: {
                            min: parseInt(WithinRange.y_min),
                            max: parseInt(WithinRange.y_max) //
                          }
                        }
                      ]
                    }
                  }}
                  legend={{ display: false }}
                  getElementAtEvent={this.handleBubble}
                />
              )}
            </div>
          </Col>
          <Col md={4} className="chartAboveRange">
            <div className="chartAboveRangeCaption text-center">
              <p>Above Range</p>
            </div>
            <div>
              {this.state.disableAboveRangeChart ? (
                <TotleNumber value={Alen} />
              ) : (
                <Bubble
                  type="bubble"
                  data={AboveRange}
                  options={{
                    responsive: true,
                    aspectRatio: false,
                    tooltips: {
                      displayColors: false,
                      callbacks: {
                        label: function(tooltipItem, data) {
                          var datasetLabel = "";
                          // var label = data.labels[tooltipItem.index];
                          var label =
                            data.datasets[tooltipItem.datasetIndex].label || "";
                          if (data.datasets.length === 1) {
                            // console.log("One tooltips found", data.datasets[0]);
                            // object exists in data array
                            if (data.datasets[0].data.length === 1) {
                              // check if tooltips key is exists
                              let flag = Object.keys(
                                data.datasets[0].data[0]
                              ).includes("keepTooltipOpen");

                              if (flag) {
                                console.log("[Chart.js] point detected");
                                let arr = label.split(",");
                                label = arr;
                              }
                            }
                          } else {
                            let arr2 = label.split(",");
                            label = arr2;
                          }

                          return label;
                        }
                      },
                      custom: function(tooltip) {
                        if (!tooltip) return;
                        tooltip.displayColors = false;
                      }
                    },
                    animation: {
                      duration: 0
                    },
                    hover: {
                      animationDuration: 0
                    },
                    maintainAspectRatio: false,
                    pan: {
                      enabled: true,
                      mode: "x"
                    },
                    zoom: {
                      enabled: true,
                      mode: "x"
                    },
                    layout: { padding: {} },
                    scales: {
                      xAxes: [
                        {
                          type: "linear",
                          position: "bottom",
                          display: false,
                          ticks: {
                            // AboveRange

                            max: parseInt(AboveRange.x_max), //,
                            min: parseInt(AboveRange.x_min) //
                          }
                        }
                      ],
                      yAxes: [
                        {
                          display: false,
                          ticks: {
                            max: parseInt(AboveRange.y_max), //,
                            min: parseInt(AboveRange.y_min)
                          }
                        }
                      ]
                    }
                  }}
                  legend={{ display: false }}
                  getElementAtEvent={this.handleBubble}
                />
              )}
            </div>
          </Col>
        </Row>

        <Row className="justify-content-md-center">
          <Col md="auto">
            <div className="text-center" style={{ marginTop: "12px" }}>
              {this.state.displayNote ? (
                <Note value="Number of reports are more then 200 , please use slider" />
              ) : (
                <div>
                  <br />
                  <br />
                </div>
              )}
            </div>
          </Col>
        </Row>
        <SnackbarNotification
          message={this.state.snakbarMessage}
          state={this.state}
        />
      </React.Fragment>
    );
  }
}

export default Chartjs_2;
