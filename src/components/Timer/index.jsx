import React, { Component } from 'react';

import moment from 'moment';

class Timer extends Component {
  state = {
    time: 0,
    mask: 'mm:ss',
  };

  componentDidMount() {
    this.setState({ time: this.props.time });
    this.startTimer();
  }

  componentWillUnmount() {
    this.removeTimer();
  }

  startTimer = () => {
    this.timer = setInterval(this.tick, 1000);
  };

  restartTimer = () => {
    this.setState({ time: this.props.time });
    this.props.timerFinishHandler(false);
  };

  tick = () => {
    const { timerFinishHandler } = this.props;
    const timeOver = this.state.time < 1000;

    if (timeOver) {
      this.removeTimer();
      if (timerFinishHandler && typeof timerFinishHandler === 'function') {
        timerFinishHandler(true);
      }
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
      <span className="timer">
        {moment(date).format(mask)}
      </span>
    );
  }
}

export default Timer;
