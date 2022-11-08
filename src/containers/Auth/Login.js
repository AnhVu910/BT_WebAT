import React, { Component } from "react";
import { connect } from "react-redux";
import { push } from "connected-react-router";
import { useForm } from "react-hook-form";
import { Form } from "./Validation";
import * as yup from "yup";

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
      formErrors: { email: "", password: "" },
      emailValid: false,
      passwordValid: false,
      formValid: false,
    };
  }
  handleUserInput = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    this.setState({ [name]: value }, () => {
      this.validateField(name, value);
    });
  };
  validateField(fieldName, value) {
    let fieldValidationErrors = this.state.formErrors;
    let emailValid = this.state.emailValid;
    let passwordValid = this.state.passwordValid;

    switch (fieldName) {
      case "email":
        emailValid = value.match(/^([\w.%+-]+)@([\w-]+\.)+([\w]{2,})$/i);
        fieldValidationErrors.email = emailValid ? "" : " is invalid";
        break;
      case "password":
        passwordValid = value.match(
          /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,10}$/i
        );
        fieldValidationErrors.password = passwordValid ? "" : " is invalid";
        break;
      default:
        break;
    }
    this.setState(
      {
        formErrors: fieldValidationErrors,
        emailValid: emailValid,
        passwordValid: passwordValid,
      },
      this.validateForm
    );
  }

  validateForm() {
    this.setState({
      formValid: this.state.emailValid && this.state.passwordValid,
    });
  }
  errorClass(error) {
    return error.length === 0 ? "" : "has-error";
  }

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
            <div
              className={`form-group ${this.errorClass(
                this.state.formErrors.email
              )}`}
            >
              <label>Email address</label>
              <input
                name="email"
                type="email"
                className="form-control mt-1"
                placeholder="Enter email"
                value={this.state.email}
                onChange={this.handleUserInput}
              />
            </div>

            <div
              className={`form-group ${this.errorClass(
                this.state.formErrors.password
              )}`}
              style={{ marginTop: "10px" }}
            >
              <label>Password</label>
              <div className="input-login">
                <input
                  name="password"
                  type={this.state.isShowpass ? "text" : "password"}
                  className="form-control mt-1"
                  placeholder="Enter password"
                  value={this.state.password}
                  onChange={this.handleUserInput}
                />
              </div>
            </div>
            <div className="mt-1" style={{ color: "red", fontSize: "17px" }}>
              <Form formErrors={this.state.formErrors} />
            </div>

            <div className="d-grid gap-2 mt-3">
              <button
                type="submit"
                className="btn"
                disabled={!this.state.formValid}
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
