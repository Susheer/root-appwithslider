import React, { Component } from "react";

function CardCom(props) {
  return (
    <div onClick={props.onClick} className="text-center" style={props.style}>
      <img
        src={props.icon}
        alt="port-Image"
        height="55px"
        width="55px"
        draggable="false"
        style={{ marginTop: "17%" }}
      />
      <br />
      <span style={{ fontSize: "12px", fontFamily: "Roboto" }}>
        {props.title}
      </span>
    </div>
  );
}
export default CardCom;
