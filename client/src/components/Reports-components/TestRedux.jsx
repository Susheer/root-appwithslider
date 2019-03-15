import React, { Component } from "react";
import { connect } from "react-redux";
class TestRedux extends Component {
  render() {
    console.log("Redux:Test", this.props);
    return (
      <div>
        <h1>UserName{this.props}</h1>
      </div>
    );
  }
}
const mapStateToProps = state => ({
  product: state.product,
  user: state.user
});

/* const mapActionsToProps = { onUpdateUser: updateUser }; */
export default connect(mapStateToProps /* ,
  mapActionsToProps */)(TestRedux);
