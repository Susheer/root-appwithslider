import React, { Component } from "react";

class FComp extends Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleSubmit(e) {
    e.preventDefault();
    console.log("HandleSubmit", this._form.submit());
  }

  render() {
    return (
      <div>
        <form
          action="/api/upload"
          method="post"
          encType="multipart/form-data"
          ref={a => (this._form = a)}
        >
          <p>
            Name:
            <input
              type="file"
              onChange={this.handleSubmit}
              name="name"
              id="name"
            />
          </p>
        </form>
      </div>
    );
  }
}
export default FComp;
