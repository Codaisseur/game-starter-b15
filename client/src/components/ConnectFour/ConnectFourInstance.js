import React from "react";
// import { connect } from "react-redux";

export default function ConnectFourInstance(props) {
  return <div>Ping Pong George!</div>;
}

const mapStateToProps = state => {
  return {
    user: state.user
  };
};

// export default connect(
//   mapStateToProps,
//   {}
// )(ConnectFour);
