import React, { Component } from 'react';
import bem from 'bem-join';

import {
  Row,
  Col,
  Icon, Button,
} from 'antd';

import { WorkerForm } from '../Forms';
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
    if (chosenWorker) {
      await this.handleGetBusinessByCorporationId(chosenWorker.corporationId);
      await this.handleGetWorkingSpacesByBusinessId(chosenWorker.businessId);
    } else if (corporations.length) {
      await this.handleGetBusinessByCorporationId(corporations[0].id);
    }
    await this.initScheduleList();
  }

  initScheduleList = () => {
    const { workTimes } = this.props.chosenWorker || { workTimes: {} };
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

  handleUpdateWorker = () => {
    console.log('handleUpdateWorker');
  };

  render() {
    const {
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

    return (
      <div className={b()}>
        <div className={b('content')}>
          {
            readOnlyMode ? (
              <WorkerForm
                corporations={corporations}
                businesses={businesses}
                workingSpaces={workingSpaces}
                scheduleList={scheduleList}
                dayTranslate={dayTranslate}
                chosenWorker={chosenWorker}
                getBusinessByCorporationId={this.handleGetBusinessByCorporationId}
                getWorkingSpacesByBusinessId={this.handleGetWorkingSpacesByBusinessId}
                onCorpChange={this.handleCorpChange}
              />
            ) : (
              <div>WorkingForm</div>
            )
          }
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
