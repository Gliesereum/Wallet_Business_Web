import React, { Component } from 'react';
import { connect } from 'react-redux';
import bem from 'bem-join';

import { notification } from 'antd';

import { WorkerInfo, WorkersList } from '../../components';

import { fetchAction } from '../../fetches';

const b = bem('workersPage');

class WorkersPage extends Component {
  state = {
    chosenWorker: null,
    isAddWorkerMode: false,
    workers: [],
    pagination: {
      current: 0,
      totalPages: 0,
      total: 0,
    },
    admins: [],
  };

  changeActiveWorker = (worker, isAddWorkerMode) => () => this.setState({
    chosenWorker: worker,
    isAddWorkerMode,
  });

  handleGetBusinessByCorporationId = async (corporationId, getWorkers = false, loaderHandler) => {
    let businesses = [];
    try {
      const { data = [] } = await fetchAction({
        url: `business/by-corporation-id?id=${corporationId}`,
        fieldName: 'business',
      })();
      getWorkers && await this.handleGetWorkers({ corporationId, loaderHandler });

      businesses = data;
    } catch (err) {
      notification.error({
        duration: 5,
        message: err.message || 'Ошибка',
        description: 'Ошибка',
      });
    }

    return businesses;
  };

  handleGetWorkers = async ({
    corporationId,
    businessId,
    queryValue,
    page = 0,
    loaderHandler,
  }) => {
    try {
      const { data: admins = [] } = await fetchAction({
        url: `business-administrator/${businessId ? 'by-business' : 'by-corporation'}?id=${businessId || corporationId}`,
        fieldName: 'admins',
      })();
      const { data: workersPage = {} } = await fetchAction({
        url: `worker/${corporationId ? 'by-corporation?corporationId' : 'by-business?businessId'}=${businessId || corporationId}&page=${page}&size=7`,
        fieldName: 'workersPage',
        fieldType: {},
      })();
      this.setState(prevState => ({
        ...prevState,
        workers: queryValue ? prevState.clients : workersPage.content,
        pagination: {
          ...prevState.pagination,
          current: workersPage.number + 1,
          totalPages: workersPage.totalPages,
          total: workersPage.totalElements,
        },
        admins,
      }));
    } catch (err) {
      notification.error({
        duration: 5,
        message: err.message || 'Ошибка',
        description: 'Ошибка',
      });
    } finally {
      loaderHandler(false);
    }
  };

  render() {
    const { corporations, defaultLanguage, phrases } = this.props;
    const {
      chosenWorker,
      isAddWorkerMode,
      workers,
      pagination,
      admins,
    } = this.state;

    return (
      <div className={b()}>
        {
          isAddWorkerMode || (chosenWorker && chosenWorker.id) ? (
            <WorkerInfo
              chosenWorker={chosenWorker}
              isAddMode={isAddWorkerMode}
              corporations={corporations}
              defaultLanguage={defaultLanguage}
              phrases={phrases}
              getBusinessByCorporationId={this.handleGetBusinessByCorporationId}
              changeActiveWorker={this.changeActiveWorker}
              admins={admins}
            />
          ) : (
            <WorkersList
              workers={workers}
              pagination={pagination}
              corporations={corporations}
              defaultLanguage={defaultLanguage}
              phrases={phrases}
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
  defaultLanguage: state.app.defaultLanguage,
  phrases: state.app.phrases,
});

export default connect(mapStateToProps)(WorkersPage);
