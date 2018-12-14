import React, { Component } from 'react';

class Login extends Component {
  constructor(props) {
    super(props);
    this.textInput = React.createRef();
    this.setUserId = this.setUserId.bind(this);
  }
  setUserId() {
    const id = this.textInput.current.value;
    this.props.OnSetUserId(id);
  }
  render() {
    return (
        <p>
        <b>User ID:</b> <input ref={this.textInput} type="text"></input>
        <input type="submit" onClick={this.setUserId}></input>
        </p>

    );
  }
}

export default Login;
