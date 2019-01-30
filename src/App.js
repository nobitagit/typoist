import React, { Component } from 'react';
import logo from './logo.svg';
import Practice from './Practice';
import './App.css';

class App extends Component {
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
        </header>
        <Practice />
        <p className="App-intro">
          Try typing with accuracy.
        </p>
      </div>
    );
  }
}

export default App;


