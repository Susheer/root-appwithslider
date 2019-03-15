import React, { Component } from "react";
import { Content } from "react-mdl";

import { Layout, Header } from "react-mdl";

import Nav from "./components/nav";
import Main from "./components/Main";

import { Container } from "react-bootstrap";
/* import { connect } from "react-redux";
import { updateUser } from "./actions/user-actions"; */

class App extends Component {
  /* onUpdateUser = props => {
    this.props.onUpdateUser("sudheer");
  }; */
  render() {
    console.log("Redux:Props", this.props);
    return (
      <Container fluid="true" style={{ padding: "0" }}>
        <Header>
          <Nav />
          {/*  <p style={{ marginTop: "10%" }} onClick={this.onUpdateUser}>
            UpdateUser
          </p>
          <h1>{this.props.user}</h1> */}
        </Header>
        <Content>
          <Main />
        </Content>
      </Container>
    );
  }
}

/* const mapStateToProps = state => {
  return state;
}; */
// returning specific props
/* const mapStateToProps = state => ({
  product: state.product,
  user: state.user
});

const mapActionsToProps = { onUpdateUser: updateUser }; */
export default App;
