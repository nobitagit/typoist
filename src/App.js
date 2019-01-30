import React, { Component } from 'react';
import logo from './logo.svg';
import Practice from './Practice';
import './App.css';

class App extends Component {
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <h1 className="App-title">Typoist</h1>
        </header>
        <Practice />
        <p className="App-intro">
          Focus on your accuracy.
        </p>
      </div>
    );
  }
}

export default App;


