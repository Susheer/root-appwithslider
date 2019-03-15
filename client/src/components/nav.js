import React, { Component } from "react";
import { Link } from "react-router-dom";
import { Navigation } from "react-mdl";

class Nav extends Component {
  render() {
    return (
      <Navigation className="nav" style={{ display: "none", margin: "0" }}>
        <ul style={{ display: "none" }}>
          <li className="logo">
            <Link to="/">
              {" "}
              {/*  Artis <span>Chain</span>
            </Link> */}
              <img
                style={{ height: "40px", width: "100px" }}
                src={require("../images/artislogo-landscape-navbar (1).png")}
              />
            </Link>
          </li>
        </ul>
        <ul>
          <li>{/* <Link to="/About">About</Link> */}</li>
          <li>{/* <Link to="/Contact">Contact</Link> */}</li>
          <li>{/*  <Link to="/Login">Login</Link> */}</li>
        </ul>
      </Navigation>
    );
  }
}

export default Nav;
