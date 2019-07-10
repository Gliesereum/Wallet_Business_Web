import React, { Component } from 'react';
import bem from 'bem-join';

import './index.scss';

const b = bem('workers');

class WorkingPage extends Component {
  state = {
    chosenWorker: null,
  };

  render() {
    const { chosenWorker } = this.state;

    return (
      <div className={b()}>
        {
          chosenWorker ? (
            <div>
              SingleWorker Component
            </div>
          ) : (
            <div>
              WorkersList Component
            </div>
          )
        }
      </div>
    );
  }
}

export default WorkingPage;
