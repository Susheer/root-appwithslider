import React from "react";
import "rc-slider/assets/index.css";
import Slider from "rc-slider";

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
function log(value) {
  console.log(value); //eslint-disable-line
}

export function SlideCom(props) {
  return (
    <div style={style}>
      <Slider
        railStyle={{ background: "black", height: "5px" }}
        dotStyle={{ display: "none" }}
        min={0}
        max={30}
        marks={marks}
        step={6}
        onChange={log}
        defaultValue={0}
        activeDotStyle={{ border: "3px solid black ", display: "none" }}
      />
    </div>
  );
}
