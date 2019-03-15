import React, { Component } from "react";
import { Link } from "react-router-dom";
class Home extends Component {
  state = {};
  render() {
    return (
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
            network(s)”​ with underpinnings of trust/transparency/ traceability.
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
    );
  }
}

export default Home;
