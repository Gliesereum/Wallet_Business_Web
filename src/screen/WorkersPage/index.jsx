import React, { Component } from 'react';
import bem from 'bem-join';

import { notification } from 'antd';

import { WorkerInfo, WorkersList } from '../../components';

import { fetchWorkersByCorporationId } from '../../fetches';

import './index.scss';

const b = bem('workers');

class WorkingPage extends Component {
  state = {
    chosenWorker: null,
    isAddWorkerMode: false,
    workers: [],
  };

  changeActiveWorker = (worker, isAddWorkerMode) => () => this.setState({
    chosenWorker: worker,
    isAddWorkerMode,
  });

  handleGetWorkers = async (corporationId) => {
    try {
      const { data: workers = [] } = await fetchWorkersByCorporationId({ corporationId });
      this.setState({ workers });
    } catch (err) {
      notification.error({
        duration: 5,
        message: err.message || 'Ошибка',
        description: 'Возникла ошибка',
      });
    }
  };

  render() {
    const { chosenWorker, isAddWorkerMode, workers } = this.state;

    return (
      <div className={b()}>
        {
          isAddWorkerMode || (chosenWorker && chosenWorker.id) ? (
            <WorkerInfo
              isAddMode={isAddWorkerMode}
              changeActiveWorker={this.changeActiveWorker}
            />
          ) : (
            <WorkersList
              workers={workers}
              getWorkers={this.handleGetWorkers}
              changeActiveWorker={this.changeActiveWorker}
            />
          )
        }
      </div>
    );
  }
}

export default WorkingPage;
