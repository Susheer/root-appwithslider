import React, { Component } from "react";
import portImage from "../images/port.png";
import bunkerImage from "../images/bunker.png";
import CardCom from "./Card-component";
//import "bootstrap/dist/css/bootstrap.min.css";
import { Col, Row, Container } from "react-bootstrap";

class Insights extends Component {
  state = {
    showInsights: true
  };

  toggleInsightHandler = () => {
    let toggle = this.state.showInsights;
    this.setState({
      showInsights: !toggle
    });
  };

  render() {
    const style = {
      width: "128px",
      height: "120px",
      padding: "10px",
      background: "white",
      boxShadow: "5px 10px #888888"
    };
    let btnTitle = "Show Insights";
    let insights = null;
    if (this.state.showInsights) {
      btnTitle = "Hide Insights";
      insights = (
        <Container fluid style={{ border: "none" }}>
          <Row className="justify-content-md-center">
            <Col
              md="auto"
              sm={12}
              style={{ border: "none" }}
              className="justify-content-md-center"
            >
              <CardCom
                icon={portImage}
                onClick={this.toggleInsightHandler}
                style={style}
                title="Filter on Ships"
              />
            </Col>

            <Col
              md="auto"
              sm={12}
              style={{ border: "none" }}
              className="justify-content-md-center"
            >
              <CardCom icon={portImage} style={style} title="Filter on Ships" />
            </Col>

            <Col md="auto" sm={12} className="justify-content-md-center">
              <CardCom
                icon={bunkerImage}
                style={style}
                title="Filter on Bunker supplier"
              />
            </Col>
          </Row>
        </Container>
      );
    }
    return (
      <div>
        <button onClick={this.toggleInsightHandler}>{btnTitle}</button>
        <div>{insights}</div>
      </div>
    );
  }
}

export default Insights;
