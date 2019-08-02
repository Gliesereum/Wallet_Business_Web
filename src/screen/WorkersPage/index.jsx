import React, { Component } from 'react';
import { connect } from 'react-redux';
import bem from 'bem-join';

import { notification } from 'antd';

import { WorkerInfo, WorkersList } from '../../components';

import { fetchWorkersByCorporationId, fetchBusinessesByCorp } from '../../fetches';

const b = bem('workersPage');

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

  handleGetBusinessByCorporationId = async (corporationId, getWorkers = false) => {
    let businesses = [];
    try {
      const { data = [] } = await fetchBusinessesByCorp({ corporationId });
      getWorkers && await this.handleGetWorkers(corporationId);

      businesses = data;
    } catch (err) {
      notification.error({
        duration: 5,
        message: err.message || 'Ошибка',
        description: 'Возникла ошибка',
      });
    }

    return businesses;
  };

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
    const { corporations } = this.props;
    const {
      chosenWorker,
      isAddWorkerMode,
      workers,
    } = this.state;

    return (
      <div className={b()}>
        {
          isAddWorkerMode || (chosenWorker && chosenWorker.id) ? (
            <WorkerInfo
              chosenWorker={chosenWorker}
              isAddMode={isAddWorkerMode}
              corporations={corporations}
              getBusinessByCorporationId={this.handleGetBusinessByCorporationId}
              changeActiveWorker={this.changeActiveWorker}
            />
          ) : (
            <WorkersList
              workers={workers}
              corporations={corporations}
              getBusinessByCorporationId={this.handleGetBusinessByCorporationId}
              getWorkers={this.handleGetWorkers}
              changeActiveWorker={this.changeActiveWorker}
            />
          )
        }
      </div>
    );
  }
}

const mapStateToProps = state => ({
  corporations: state.corporations.corporations,
});

export default connect(mapStateToProps)(WorkingPage);
