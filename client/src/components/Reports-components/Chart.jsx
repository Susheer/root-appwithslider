import React, { Component } from "react";

import { Col, Row } from "react-bootstrap";
import { Bubble } from "react-chartjs-2";
import { Chart } from "react-chartjs-2";
import SnackbarNotification from "../Util-Component/SnackbarNotification";

import { Redirect } from "react-router-dom";
import * as zoom from "chartjs-plugin-zoom";
import logo from "../../logo.svg";

class Chartjs_2 extends Component {
  state = {
    bubbleId: 0,
    pageIdentity: this.props.parentName,
    redirect: false,
    response: this.props.response,
    open: false,
    snakbarMessage: "data to be display"
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
      callbacks: {
        label: function(tooltipItem, data) {
          var datasetLabel = "";
          // var label = data.labels[tooltipItem.index];
          var label = data.datasets[tooltipItem.datasetIndex].label || "";

          return label;
        }
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
    scales: {
      xAxes: [
        {
          display: false,

          type: "linear",
          position: "bottom"
        }
      ],
      yAxes: [
        {
          display: false,
          /*  ticks: {
            min: -20,
            max: 120
          }, */
          type: "linear",
          position: "bottom"
        }
      ]
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
    //console.log("onClick Handler", element);
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
      let val = data.label.trim().split(" ");
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
    console.log("Chart Data", this.state.response);
  }

  static defaultProps = {
    displayTitle: false,
    displayLegend: true,
    legendPosition: "right",
    location: "City"
  };

  render() {
    return (
      <React.Fragment>
        {this.renderRedirect()}

        <Row>
          <Col
            md={4}
            style={{
              borderRight: "4px solid black",
              borderRadius: "3px"
            }}
          >
            <p
              style={{
                fontWeight: "bolder",
                marginTop: "-40px",
                marginLeft: "60px"
              }}
            >
              Below Range
            </p>
            <Bubble
              ref="chart1"
              type="bubble"
              data={this.state.response.BelowRange}
              options={{
                tooltips: {
                  callbacks: {
                    label: function(tooltipItem, data) {
                      var datasetLabel = "";
                      // var label = data.labels[tooltipItem.index];
                      var label =
                        data.datasets[tooltipItem.datasetIndex].label || "";

                      return label;
                    }
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

                layout: { padding: { left: 10, right: 10, top: 5, bottom: 5 } },
                scales: {
                  xAxes: [
                    {
                      type: "linear",
                      position: "bottom",
                      display: false
                    }
                  ],
                  yAxes: [
                    {
                      display: false
                    }
                  ]
                }
              }}
              legend={{ display: false }}
              getElementAtEvent={this.handleBubble}
            />
          </Col>

          <Col md={4}>
            <p
              style={{
                fontWeight: "bolder",
                marginTop: "-40px",
                marginLeft: "60px"
              }}
            >
              Within Range
            </p>
            <Bubble
              ref={reference => (this.chartReference = reference)}
              type="bubble"
              data={this.state.response.WithinRange}
              options={this.chartOpt}
              legend={{ display: false }}
              getElementAtEvent={this.handleBubble}
            />
          </Col>
          <Col
            md={4}
            style={{ borderLeft: "4px solid black", borderRadius: "3px" }}
          >
            <p
              style={{
                fontWeight: "bolder",
                marginTop: "-40px",
                marginLeft: "60px"
              }}
            >
              Above Range
            </p>
            <Bubble
              type="bubble"
              data={this.state.response.AboveRange}
              options={{
                tooltips: {
                  callbacks: {
                    label: function(tooltipItem, data) {
                      var datasetLabel = "";
                      // var label = data.labels[tooltipItem.index];
                      var label =
                        data.datasets[tooltipItem.datasetIndex].label || "";

                      return label;
                    }
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
                layout: { padding: { left: 0, right: 0, top: 5, bottom: 5 } },
                scales: {
                  xAxes: [
                    {
                      type: "linear",
                      position: "bottom",
                      display: false
                      /*  ticks: {
                        min: -50,
                        max: 120
                      } */
                    }
                  ],
                  yAxes: [
                    {
                      display: false
                      /*  ticks: {
                        min: -20,
                        max: 120
                      } */
                    }
                  ]
                }
              }}
              legend={{ display: false }}
              getElementAtEvent={this.handleBubble}
            />
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
