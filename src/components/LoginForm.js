import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import './styles/LoginForm.scss';

class LoginForm extends Component {
  constructor() {
    super();
    this.state = {
      first_name: '',
      last_name: '',
      email: 'joe@joe.com',
      password: 'password',
    };
    this.handleOnSubmit = this.handleOnSubmit.bind(this);
    this.handleOnChange = this.handleOnChange.bind(this);
    this.handleError = this.handleError.bind(this);
  }

  handleError() {
    this.props.updateUserFail(false);
  }

  handleOnSubmit(event) {
    event.preventDefault();
    const { location } = this.props;
    const { email, password } = this.state;
    const { signUp, login } = this.props;

    if (location.pathname === '/signup') {
      signUp(this.state);
    } else {
      login({ email, password });
    }
    this.setState({
      first_name: '',
      last_name: '',
      email: '',
      password: '',
    });
  }

  handleOnChange(event) {
    this.setState({ [event.target.id]: event.target.value });
  }

  render() {
    const { location, isHidden, userFail } = this.props;

    if (!location) {
      return null;
    }

    const type = location.pathname.slice(1);
    const typeClass = `login-form ${type}`;
    const wrapperClass = isHidden ? 'login-hidden' : null;
    const errorClass = userFail ? 'error' : null;
    const { first_name, last_name, email, password } = this.state;
    const linkType = type === 'login' ? '/signup' : '/login';
    const linkTitle = type === 'login' ? 'Register' : 'Login';
    const errorMsg = type === 'login' ? 'Invalid Email or Password' : 'Invalid Name, Email or Password';
    const errorElement = userFail ? <span className="error-msg">{errorMsg}</span> : null;

    return (
      <section className={`${wrapperClass} ${errorClass}`}>
        <form onSubmit={this.handleOnSubmit} className={typeClass}>
          <h2 className="login-title">{type}</h2>
          <input
            id="first_name"
            className="login-input"
            type="text"
            placeholder="Enter first name"
            value={first_name}
            onChange={this.handleOnChange}
          />
          <input
            id="last_name"
            className="login-input"
            type="text"
            placeholder="Enter last name"
            value={last_name}
            onChange={this.handleOnChange}
          />
          <input
            id="email"
            className="login-input"
            type="text"
            placeholder="Enter email"
            value={email}
            onChange={this.handleOnChange}
          />
          <input
            id="password"
            className="login-input"
            type="text"
            placeholder="Enter password"
            value={password}
            onChange={this.handleOnChange}
          />
          {errorElement}
          <section className="login-btn-wrapper">
            <Link onClick={this.handleError} to={linkType} className="register">{linkTitle}</Link>
            <button className="login-btn" type="submit">{type}</button>
          </section>
        </form>
      </section>
    );
  }
}

export default LoginForm;
