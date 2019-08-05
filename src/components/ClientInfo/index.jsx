import React, { Component } from 'react';
import bem from 'bem-join';

import {
  Row,
  Col,
  Icon,
  Button,
  Avatar,
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
        <div className={b('infoWrapper')}>
          <div className={b('ordersInfo')}>
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
          <div className={b('clientInfo')}>
            <Avatar
              src={chosenClient.avatarUrl}
              size={104}
              className={b('clientInfo-avatar')}
            />
            <div className={b('clientInfo-publicInfo')}>
              <div className={b('clientInfo-publicInfo-block')}>
                <div className="title">Фамилия:</div>
                <div className="data">{chosenClient.lastName}</div>
              </div>
              <div className={b('clientInfo-publicInfo-block')}>
                <div className="title">Имя:</div>
                <div className="data">{chosenClient.firstName}</div>
              </div>
              <div className={b('clientInfo-publicInfo-block')}>
                <div className="title">Отчество:</div>
                <div className="data">{chosenClient.middleName}</div>
              </div>
              <div className={b('clientInfo-publicInfo-block')}>
                <div className="title">Номер телефона:</div>
                <div className="data">{chosenClient.phone}</div>
              </div>
            </div>
            <div className={b('clientInfo-privateInfo')}>
              d
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default ClientInfo;
