import React, { Component } from "react";
import { connect } from "react-redux";
import { push } from "connected-react-router";

import * as actions from "../../store/actions";
import "./Login.scss";
import { FormattedMessage } from "react-intl";
import { handleLoginApi } from "../../services/userService";

class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: "",
      password: "",
      isShowpass: false,
      errorMessage: "",
    };
  }
  handleOnChangeEmail = (event) => {
    this.setState({
      email: event.target.value,
    });
  };

  handleOnChangePass = (event) => {
    this.setState({ password: event.target.value });
  };

  handleSubmit = async () => {
    this.setState({
      errorMessage: "",
    });
    try {
      let data = await handleLoginApi(this.state.email, this.state.password);
      if (data && data.errCode !== 0) {
        this.setState({
          errorMessage: data.message,
        });
      }
      if (data && data.errCode === 0) {
        this.props.userLoginsuccess(data.user);
      }
    } catch (error) {
      if (error.response) {
        if (error.response.data) {
          this.setState({
            errorMessage: error.response.data.message,
          });
        }
      }
      
    }
  };
  handleShowHidePass = () => {
    this.setState({
      isShowpass: !this.state.isShowpass,
    });
  };

  render() {
    return (
      <div className="login-background">
        <div className="login-container ">
          <div className="login-content">
            <h3 className="Auth-form-title text-center">Sign In</h3>
            <div className="form-group mt-3">
              <label>Email address</label>
              <input
                type="email"
                className="form-control mt-1"
                placeholder="Enter email"
                value={this.state.email}
                onChange={(event) => this.handleOnChangeEmail(event)}
              />
            </div>
            <div className="form-group mt-3">
              <label>Password</label>
              <div className="input-login">
                <input
                  type={this.state.isShowpass ? "text" : "password"}
                  className="form-control mt-1"
                  placeholder="Enter password"
                  value={this.state.password}
                  onChange={(event) => this.handleOnChangePass(event)}
                />
              </div>
            </div>
            <div className="mt-1 " style={{ color: "red", fontSize: "17px" }}>
              {this.state.errorMessage}
            </div>
            <div className="d-grid gap-2 mt-3">
              <button
                type="submit"
                className="btn"
                onClick={() => {
                  this.handleSubmit();
                }}
              >
                Login
              </button>
            </div>
            <p className="login-with text-center mt-2">Or sign in with:</p>
            <div className="social mt-1">
              <i className="fab fa-google-plus google"></i>
              <i className="fab fa-facebook facebook"></i>
              <i className="fab fa-github github"></i>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    language: state.app.language,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    navigate: (path) => dispatch(push(path)),
    // userLoginFail: () => dispatch(actions.userLoginFail()),
    userLoginsuccess: (userInfo) =>
      dispatch(actions.userLoginsuccess(userInfo)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Login);
