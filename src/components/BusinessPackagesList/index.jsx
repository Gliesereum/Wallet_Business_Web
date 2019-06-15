import React, { PureComponent } from 'react';
import bem from 'bem-join';

import {
  Button,
  Card,
  Col,
  Icon,
  List,
  Row,
} from 'antd';

import EmptyState from '../EmptyState';

import AddIcon from '../../assets/AddIcon.svg';

import './index.scss';

const b = bem('businessPackagesList');
const { Item } = List;

class BusinessPackagesList extends PureComponent {
  handleChangeActiveTab = toTab => () => this.props.changeActiveTab(toTab);

  renderPackagesList = (packagesList) => {
    const { changeActivePackage } = this.props;

    return (
      <>
        <List
          className={b('grid')}
          grid={{
            gutter: 8,
            lg: 4,
          }}
          dataSource={packagesList}
          renderItem={item => (
            item.addCard ? (
              <Item
                onClick={changeActivePackage(null, true)}
                className={b('grid-item', { addCard: true })}
              >
                <Card>
                  <img src={AddIcon} alt="addPackage" />
                  {'Добавить пакет услуг'.toUpperCase()}
                </Card>
              </Item>
            ) : (
              <Item
                onClick={changeActivePackage(item, false)}
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
              onClick={this.handleChangeActiveTab('services')}
            >
              <Icon type="left" />
              Назад
            </Button>
          </Col>
          <Col lg={12}>
            <Button
              className={b('grid-controlBtns-btn')}
              onClick={this.handleChangeActiveTab('schedule')}
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
    const { packages, changeActivePackage } = this.props;
    const packagesList = [
      ...packages,
      {
        addCard: true,
      },
    ];

    return (
      <div className={b()}>
        <h1 className={b('title')}>Список пакетов услуг</h1>
        {
          packagesList.length > 1 ? (
            this.renderPackagesList(packagesList)
          ) : (
            <EmptyState
              title="У вас нету пакетов услуг"
              descrText="Сучасна методологія розробки в значній мірі обумовлює важливість своєчасного виконання надзавдання. Тому, створіть послугу!"
              addItemText="Создать пакет услуг"
              addItemHandler={changeActivePackage}
            />
          )
        }
      </div>
    );
  }
}

export default BusinessPackagesList;
