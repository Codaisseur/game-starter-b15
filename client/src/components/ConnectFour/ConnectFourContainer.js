import React, { Component } from "react";
import ConnectFourInstance from "./ConnectFourInstance";

export default class ConnectFourContainer extends Component {
  state = {};

  render() {
    // console.log(this.state);
    // if (!this.state) return "Loading...";
    return (
      <div>
        <ConnectFourInstance />
      </div>
    );
  }
}
