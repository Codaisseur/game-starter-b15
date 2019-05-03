import React, { PureComponent } from "react";
import Card from "@material-ui/core/Card";
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";
import "./SignupForm.css";
import TextField from "@material-ui/core/TextField";

export default class SignupForm extends PureComponent {
  state = {};

  handleSubmit = e => {
    e.preventDefault();
    console.log(this.state);
    this.props.onSubmit(this.state);
  };

  handleChange = event => {
    const { name, value } = event.target;

    this.setState({
      [name]: value
    });
  };

  render() {
    return (
      <Grid
        container
        spacing={0}
        direction="column"
        alignItems="center"
        justify="center"
        style={{ minHeight: "50vh" }}
      >
        <Card
          className="signup-form"
          style={{
            alignContent: "center",
            width: 400,
            boxShadow: "none",
            height: 300
          }}
        >
          <form onSubmit={this.handleSubmit}>
            <TextField
              id="email"
              name="email"
              type="email"
              label="EMAIL"
              value={this.state.email}
              onChange={this.handleChange}
              fullWidth="true"
              margin="normal"
            />
            <TextField
              id="password"
              type="password"
              name="password"
              label="PASSWORD"
              value={this.state.password}
              onChange={this.handleChange}
              fullWidth="true"
              margin="normal"
            />
            <TextField
              id="password"
              type="password"
              name="confirmPassword"
              label="CONFIRM PASSWORD"
              value={this.state.confirmPassword}
              onChange={this.handleChange}
              fullWidth="true"
              margin="normal"
            />
            {this.state.password &&
              this.state.confirmPassword &&
              this.state.password !== this.state.confirmPassword && (
                <p style={{ color: "red" }}>The passwords do not match!</p>
              )}
            <Button
              fullWidth="true"
              style={{
                marginTop: 30,
                background: "white",
                color: "black"
              }}
            >
              {" "}
              SUBMIT
            </Button>

            {/* <button type="submit">Sign up</button> */}
          </form>
        </Card>
      </Grid>
    );
  }
}
