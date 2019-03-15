import React from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import Slider from "@material-ui/lab/Slider";
import { Style } from "./Styles.jsx";

class StepSlider extends React.Component {
  state = {
    value: this.props.value
  };

  handleChange = (event, value) => {
    this.setState({ value });
    console.log("value: ", value);
  };

  render() {
    const { classes } = this.props;
    const { value } = this.state;

    return (
      <div className={classes.root}>
        <Slider
          classes={{ container: classes.slider }}
          value={value}
          min={0}
          max={6}
          step={3}
          onChange={this.handleChange}
        />
      </div>
    );
  }
}

StepSlider.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(Style.StepSliderStyle.styles)(StepSlider);
