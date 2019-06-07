import React, { Component } from 'react';
import bem from 'bem-join';

import {
  List,
  Card,
  Col,
  Button,
  Row,
} from 'antd';

import AddIcon from '../../assets/AddIcon.svg';

import './index.scss';

const b = bem('businessServicesList');
const { Item } = List;

class BusinessServicesList extends Component {
  handleChangeActiveTab = toTab => () => this.props.changeActiveTab(toTab);

  render() {
    const { services, changeActiveService } = this.props;
    if (!services.some(item => item.addCard)) services.push({ addCard: true });

    return (
      <>
        <List
          className={b()}
          grid={{
            gutter: 8,
            lg: 4,
          }}
          dataSource={services}
          renderItem={item => (
            item.addCard ? (
              <Item
                onClick={changeActiveService({})}
                className={b('item', { addCard: true })}
              >
                <Card>
                  <img src={AddIcon} alt="addService" />
                  {'Добавить услугу'.toUpperCase()}
                </Card>
              </Item>
            ) : (
              <Item
                onClick={changeActiveService(item)}
                className={b('item')}
              >
                <Card>{item.name}</Card>
              </Item>
            )
          )
          }
        />
        <Row
          gutter={40}
          className={b('controlBtns')}
        >
          <Col lg={12}>
            <Button
              className={b('controlBtns-btn', { back: true })}
              onClick={this.handleChangeActiveTab('mainInfo')}
            >
              Назад
            </Button>
          </Col>
          <Col lg={12}>
            <Button
              className={b('controlBtns-btn')}
              onClick={this.handleChangeActiveTab('packages')}
              type="primary"
            >
              Далее
            </Button>
          </Col>
        </Row>
      </>
    );
  }
}

export default BusinessServicesList;
