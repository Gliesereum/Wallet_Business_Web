import React, { Component } from 'react';
import { connect } from 'react-redux';
import bem from 'bem-join';

import { notification } from 'antd';

import { WorkerInfo, WorkersList } from '../../components';

import { fetchWorkersById, fetchBusinessesByCorp } from '../../fetches';

const b = bem('workersPage');

class WorkingPage extends Component {
  state = {
    chosenWorker: null,
    isAddWorkerMode: false,
    workers: [],
    pagination: {
      current: 0,
      totalPages: 0,
      total: 0,
    },
  };

  changeActiveWorker = (worker, isAddWorkerMode) => () => this.setState({
    chosenWorker: worker,
    isAddWorkerMode,
  });

  handleGetBusinessByCorporationId = async (corporationId, getWorkers = false) => {
    let businesses = [];
    try {
      const { data = [] } = await fetchBusinessesByCorp({ corporationId });
      getWorkers && await this.handleGetWorkers({ corporationId });

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

  handleGetWorkers = async ({
    corporationId,
    businessId,
    queryValue,
    page,
  }) => {
    try {
      const { data: workersPage = {} } = await fetchWorkersById({
        corporationId,
        businessId,
        queryValue,
        page,
      });
      this.setState(prevState => ({
        ...prevState,
        workers: queryValue ? prevState.clients : workersPage.content,
        pagination: {
          ...prevState.pagination,
          current: workersPage.number + 1,
          totalPages: workersPage.totalPages,
          total: workersPage.totalElements,
        },
      }));
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
      pagination,
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
              pagination={pagination}
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
