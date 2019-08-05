import React, { Component } from 'react';
import bem from 'bem-join';

import {
  Row,
  Col,
  Icon,
  Button,
} from 'antd';

const b = bem('clientInfo');

class ClientInfo extends Component {
  state = {

  };

  connectWithClient = () => {
    console.log('connectWithClient');
  };

  render() {
    const { changeActiveClient, chosenClient } = this.props;
    console.log('chosenClient', chosenClient);

    return (
      <div className={b()}>
        <div className={b('header')}>
          <p className={b('header-title')}>Просмотр профайла сотрудника</p>
        </div>
        <div className={b('content')}>

          <Row
            gutter={40}
            className={b('content-controlBtns')}
          >
            <Col lg={12}>
              <Button
                className={b('content-controlBtns-btn backBtn')}
                onClick={changeActiveClient(null, false)}
              >
                <Icon type="left" />
                К списку клиентов
              </Button>
            </Col>
            <Col lg={12}>
              <Button
                className={b('content-controlBtns-btn')}
                type="primary"
                onClick={this.connectWithClient}
              >
                Связаться с клиентом
              </Button>
            </Col>
          </Row>
        </div>
      </div>
    );
  }
}

export default ClientInfo;
