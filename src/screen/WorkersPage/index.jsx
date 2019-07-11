import React, { Component } from 'react';
import bem from 'bem-join';

import { WorkerInfo, WorkersList } from '../../components';

import './index.scss';

const b = bem('workers');

class WorkingPage extends Component {
  state = {
    chosenWorker: null,
    isAddWorkerMode: false,
  };

  changeActiveWorker = (worker, isAddWorkerMode) => () => this.setState({
    chosenWorker: worker,
    isAddWorkerMode,
  });

  render() {
    const { chosenWorker, isAddWorkerMode } = this.state;

    return (
      <div className={b()}>
        {
          chosenWorker ? (
            <WorkerInfo
              isAddMode={isAddWorkerMode}
              changeActiveWorker={this.changeActiveWorker}
            />
          ) : (
            <WorkersList
              workers={[]}
              changeActiveWorker={this.changeActiveWorker}
            />
          )
        }
      </div>
    );
  }
}

export default WorkingPage;
