import React, {Component} from 'react';
import mock from '../mock';
export default class Greeter extends Component {

  render() {
    return (
      <div>
        <h1>webpack + react demo</h1>
        <p>{mock.greetText}</p>
      </div>
    );
  }
}