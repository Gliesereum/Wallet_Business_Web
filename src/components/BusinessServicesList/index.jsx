import React, { Component } from 'react';
import bem from 'bem-join';

import {
  List,
  Card,
  Col,
  Button,
  Row,
  Icon,
} from 'antd';

import EmptyState from '../EmptyState';

import AddIcon from '../../assets/AddIcon.svg';

import './index.scss';

const b = bem('businessServicesList');
const { Item } = List;

class BusinessServicesList extends Component {
  componentDidMount() {
    const { services, changeTabDisable } = this.props;
    if (services && !services.length) {
      changeTabDisable('packages', true);
    }
  }

  handleChangeActiveTab = toTab => () => this.props.changeActiveTab(toTab);

  renderServicesList = (services) => {
    const { changeActiveService } = this.props;

    return (
      <>
        <List
          className={b('grid')}
          grid={{
            gutter: 8,
            lg: 4,
          }}
          dataSource={services}
          renderItem={item => (
            item.addCard ? (
              <Item
                onClick={changeActiveService(null, true)}
                className={b('grid-item', { addCard: true })}
              >
                <Card>
                  <img src={AddIcon} alt="addService" />
                  {'Добавить услугу'.toUpperCase()}
                </Card>
              </Item>
            ) : (
              <Item
                onClick={changeActiveService(item, false)}
                className={b('grid-item')}
              >
                <Card>{item.name}</Card>
              </Item>
            )
          )}
        />
        <Row
          gutter={40}
          className={b('grid-controlBtns')}
        >
          <Col lg={12}>
            <Button
              className={b('grid-controlBtns-btn backBtn')}
              onClick={this.handleChangeActiveTab('mainInfo')}
            >
              <Icon type="left" />
              Назад
            </Button>
          </Col>
          <Col lg={12}>
            <Button
              className={b('grid-controlBtns-btn')}
              onClick={this.handleChangeActiveTab('packages')}
              type="primary"
            >
              Далее
            </Button>
          </Col>
        </Row>
      </>
    );
  };

  render() {
    const { services, changeActiveService } = this.props;
    const servicesList = [
      ...services,
      {
        addCard: true,
      },
    ];

    return (
      <div className={b()}>
        <h1 className={b('title')}>Список услуг</h1>
        {
          servicesList.length > 1 ? (
            this.renderServicesList(servicesList)
          ) : (
            <EmptyState
              title="У вас нету услуг"
              descrText="Создайте услугу, которую сможете полностью подобрать под свой бизнес и создать на базе этой услуги пакет услуг с акциями или скидками"
              addItemText="Создать услугу"
              addItemHandler={changeActiveService}
            />
          )
        }
      </div>
    );
  }
}

export default BusinessServicesList;
