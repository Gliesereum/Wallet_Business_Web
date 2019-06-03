import React, { Component } from 'react';

import moment from 'moment';

import './index.scss';

class Timer extends Component {
  state = {
    time: 0,
    mask: 'mm:ss',
  };

  componentDidMount() {
    this.setState({ time: this.props.time });
    this.timer = setInterval(this.tick, 1000);
  }

  componentWillUnmount() {
    this.removeTimer();
  }

  tick = () => {
    const timeOver = this.state.time < 1000;

    if (timeOver) {
      this.removeTimer();
      return;
    }

    this.setState(state => ({ time: state.time - 1000 }));
  };

  removeTimer = () => {
    clearInterval(this.timer);
  };

  render() {
    const date = new Date(this.state.time);
    const { mask } = this.state;

    return (
      <span>
        {moment(date).format(mask)}
      </span>
    );
  }
}

export default Timer;
