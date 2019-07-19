import React, { Component } from 'react';
import bem from 'bem-join';

import {
  Row,
  Col,
  Icon,
  Button,
  notification,
} from 'antd';

import { WorkerForm } from '../Forms';

import { asyncRequest, withToken } from '../../utils';
import { scheduleListDefault, dayTranslate } from '../../mocks';

import './index.scss';

const b = bem('workerInfo');

class WorkerInfo extends Component {
  state = {
    readOnlyMode: !this.props.isAddMode,
    businesses: [],
    workingSpaces: [],
    scheduleList: [],
  };

  async componentDidMount() {
    const { corporations = [], chosenWorker } = this.props;
    await this.initScheduleList();
    if (chosenWorker) {
      await this.handleGetBusinessByCorporationId(chosenWorker.corporationId);
      await this.handleGetWorkingSpacesByBusinessId(chosenWorker.businessId);
    } else if (corporations.length) {
      await this.handleGetBusinessByCorporationId(corporations[0].id);
    }
  }

  initScheduleList = () => {
    const { workTimes } = this.props.chosenWorker || { workTimes: [] };
    const initDaysList = scheduleListDefault.reduce((acc, day) => {
      const [initDay] = workTimes.filter(item => item.dayOfWeek === day.dayOfWeek);
      acc.push({ ...day, ...initDay });
      return acc;
    }, []);
    this.setState({ scheduleList: initDaysList });
  };

  handleGetBusinessByCorporationId = async (corporationId) => {
    const { chosenWorker, getBusinessByCorporationId } = this.props;

    const businesses = await getBusinessByCorporationId(corporationId, true);
    this.setState({ businesses });
    chosenWorker && await this.handleGetWorkingSpacesByBusinessId(chosenWorker.businessId);
  };

  handleGetWorkingSpacesByBusinessId = (businessId) => {
    const { businesses } = this.state;
    const [business] = businesses.filter(item => item.id === businessId);
    this.setState({ workingSpaces: business ? business.spaces : [] });
  };

  handleUpdateWorker = async () => {
    await this.workerForm.props.form.validateFields(
      async (error, {
        corporationId,
        businessId,
        workingSpaceId,
        position,
        firstName,
        lastName,
        middleName,
        phone,
        gender,
        ...workTimesData
      }) => {
        if (!error) {
          const {
            isAddMode,
            chosenWorker,
          } = this.props;

          const isWorkTiemsExist = this.state.scheduleList[0].id;
          const workTimes = [];

          if (isWorkTiemsExist) {
            chosenWorker.workTimes.forEach((item) => {
              workTimes.push({
                ...item,
                from: workTimesData[`${item.dayOfWeek}-workHours`].from,
                to: workTimesData[`${item.dayOfWeek}-workHours`].to,
                isWork: workTimesData[`${item.dayOfWeek}-isWork`],
              });
            });
          } else {
            for (const day in dayTranslate) {
              workTimes.push({
                dayOfWeek: day,
                from: workTimesData[`${day}-workHours`].from,
                to: workTimesData[`${day}-workHours`].to,
                isWork: workTimesData[`${day}-isWork`],
              });
            }
          }

          const url = 'working-space/worker';
          const method = isAddMode ? 'POST' : 'PUT';
          const body = {
            ...chosenWorker,
            corporationId,
            businessId,
            workingSpaceId,
            position,
            user: {
              ...chosenWorker.user,
              firstName,
              lastName,
              middleName,
              phone,
              gender,
            },
            workTimes,
          };

          try {
            await withToken(asyncRequest)({
              url, body, method, moduleUrl: 'karma',
            });
          } catch (err) {
            notification.error({
              duration: 5,
              message: err.message || 'Ошибка',
              description: 'Возникла ошибка',
            });
          }
        }
      }
    );
  };

  render() {
    const {
      isAddMode,
      chosenWorker,
      corporations,
      changeActiveWorker,
    } = this.props;
    const {
      readOnlyMode,
      businesses,
      workingSpaces,
      scheduleList,
    } = this.state;

    let headerTitle = 'Редактирование профайла сотрудника';
    if (readOnlyMode) {
      headerTitle = 'Просмотр профайла сотрудника';
    } else if (isAddMode) {
      headerTitle = 'Создание профайла сотрудника';
    }

    return (
      <div className={b()}>
        <div className={b('header')}>
          <h1 className={b('header-title')}>{headerTitle}</h1>
        </div>
        <div className={b('content')}>
          <WorkerForm
            wrappedComponentRef={form => this.workerForm = form}
            corporations={corporations}
            businesses={businesses}
            workingSpaces={workingSpaces}
            scheduleList={scheduleList}
            dayTranslate={dayTranslate}
            chosenWorker={chosenWorker}
            readOnlyMode={readOnlyMode}
            getBusinessByCorporationId={this.handleGetBusinessByCorporationId}
            getWorkingSpacesByBusinessId={this.handleGetWorkingSpacesByBusinessId}
            onCorpChange={this.handleCorpChange}
          />
          <Row
            gutter={40}
            className={b('content-controlBtns')}
          >
            <Col lg={8}>
              <Button
                className={b('content-controlBtns-btn backBtn')}
                onClick={changeActiveWorker(null, false)}
              >
                <Icon type="left" />
                К списку рабочих мест
              </Button>
            </Col>
            <Col lg={8}>
              <Button
                className={b('content-controlBtns-btn deleteBtn')}
              >
                Інфо блок
              </Button>
            </Col>
            <Col lg={8}>
              <Button
                className={b('content-controlBtns-btn')}
                type="primary"
                onClick={this.handleUpdateWorker}
              >
                Сохранить
              </Button>
            </Col>
          </Row>
        </div>
      </div>
    );
  }
}

export default WorkerInfo;
