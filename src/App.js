import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import Login from './Login.js';
import ListBook from "./ListBook.js"

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      userId: null,
      dispalyComponent: <Login OnSetUserId={this.setUserId} />,
    }
  }

  setUserId = (id) => {
    console.log(id);
    this.setState({
      userId: id,
      dispalyComponent: <ListBook userId={id} OnShowBook={this.showBook}/>,
    });
  }

  render() {
    return (
      <div>
      {this.state.dispalyComponent}
      </div>
    );
  }
}

export default App;
