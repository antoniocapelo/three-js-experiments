import React, { Component } from 'react';
import logo from './logo.svg';
import Postprocessing from './postprocessing/Postprocessing';
import './App.css';

class App extends Component {
  render() {
    return (
        <div role="main" id="viewport"><p>Loading...</p><canvas></canvas>
        <div role="complementary" id="aside">
        <div id="info">
        <p>Press ALT to hide the overlay</p>
        </div>
        </div>
 
        </div>
    );
  }
}

export default App;
