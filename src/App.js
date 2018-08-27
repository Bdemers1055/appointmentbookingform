import React, { Component } from 'react';
import Form from './components/form';
import './App.css';


class App extends Component {
  render() {
    return (
      <div className="App">
      <h1 className="heading">Book an Appointment</h1>
        <Form />
      </div>
    );
  }
}

export default App;