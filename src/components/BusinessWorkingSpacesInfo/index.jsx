import React, { Component } from 'react';
import bem from 'bem-join';

import {
  Row,
  Col,
  Button,
  Icon,
} from 'antd';

import { WorkingSpaceForm } from '../Forms';
import WorkingSpaceInfoReadOnly from '../WorkingSpaceInfoReadOnly';

import './index.scss';

const b = bem('workingSpaceInfo');

class BusinessWorkingSpacesInfo extends Component {
  state = {
    readOnlyMode: true,
  };

  handleToggleReadOnlyMode = bool => () => this.setState({ readOnlyMode: bool });

  render() {
    const { chosenSpace, changeActiveWorkingSpace } = this.props;
    const { readOnlyMode } = this.state;

    return (
      <div className={b()}>
        {
          readOnlyMode ? (
            <WorkingSpaceInfoReadOnly
              chosenSpace={chosenSpace}
            />
          ) : (
            <WorkingSpaceForm
              chosenSpace={chosenSpace}
            />
          )
        }
        <Row
          gutter={40}
          className={b('controlBtns')}
        >
          <Col lg={8}>
            {
              readOnlyMode ? (
                <Button
                  className={b('controlBtns-btn backBtn')}
                  onClick={changeActiveWorkingSpace(null, false)}
                >
                  <Icon type="left" />
                  К списку рабочих мест
                </Button>
              ) : (
                <Button
                  className={b('controlBtns-btn backBtn')}
                  onClick={this.handleToggleReadOnlyMode(true)}
                >
                  <Icon type="left" />
                  Отмена
                </Button>
              )
            }
          </Col>
          <Col lg={8}>
            {
              readOnlyMode ? (
                <Button
                  className={b('controlBtns-btn deleteBtn')}
                >
                  Удалить рабочее место
                </Button>
              ) : (
                <Button
                  className={b('controlBtns-btn deleteBtn')}
                >
                  Інфо блок
                </Button>
              )
            }
          </Col>
          <Col lg={8}>
            {
              readOnlyMode ? (
                <Button
                  className={b('controlBtns-btn')}
                  type="primary"
                  onClick={this.handleToggleReadOnlyMode(false)}
                >
                  Редактировать рабочее место
                </Button>
              ) : (
                <Button
                  className={b('controlBtns-btn')}
                  type="primary"
                >
                  Сохранить
                </Button>
              )
            }
          </Col>
        </Row>
      </div>
    );
  }
}

export default BusinessWorkingSpacesInfo;
