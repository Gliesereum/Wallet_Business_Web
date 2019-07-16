import React, { Component } from 'react';
import bem from 'bem-join';

import {
  Row,
  Col,
  Icon, Button,
} from 'antd';

import { WorkerForm } from '../Forms';

import './index.scss';

const b = bem('workerInfo');

class WorkerInfo extends Component {
  state = {
    readOnlyMode: !this.props.isAddMode,
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
    const { readOnlyMode } = this.state;

    return (
      <div className={b()}>
        <div className={b('content')}>
          {
            readOnlyMode ? (
              <WorkerForm
                corporations={corporations}
                chosenWorker={chosenWorker}
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
