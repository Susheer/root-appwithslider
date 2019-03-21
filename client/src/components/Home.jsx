import React, { Component } from "react";
import { Link } from "react-router-dom";
import logo from "../images/artislogo-landscape-navbar (1).png";
class Home extends Component {
  state = {};
  render() {
    return (
      <React.Fragment>
        <div
          className="homepage-logo"
          style={{
            padding: "0",
            marginTop: "6%",

            marginLeft: "5%"
          }}
        >
          <img
            src={logo}
            alt="ArtisChain"
            style={{ height: "66px", width: "180px" }}
          />
        </div>
        <div className="head">
          <h1>
            Business
            <br /> Is Inherently,
            <br /> Social
          </h1>
          <div>
            <p>
              ArtisChain platform empower users to set-up their own one click,
              on-demand, cloud native, blockchain enabled “trusted business
              network(s)”​ with underpinnings of trust/transparency/
              traceability.
            </p>
            <div>
              <Link className="contact" to="/Report">
                Get Started
              </Link>
              {/* <a className="contact" href="#">
              
            </a> */}
            </div>
          </div>
        </div>
      </React.Fragment>
    );
  }
}

export default Home;
