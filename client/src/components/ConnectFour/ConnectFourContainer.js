import React, { Component } from "react";
import ConnectFour from "./ConnectFour";

export default class ConnectFourContainer extends Component {
  state = {};

  render() {
    console.log(this.state);
    if (!this.state.dogTypes) return "Loading...";
    return (
      <div>
        <ConnectFour />
      </div>
    );
  }
}
