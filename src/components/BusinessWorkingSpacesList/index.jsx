import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import bem from 'bem-join';

import {
  Icon,
  Divider,
  Row,
  Col,
  Button,
} from 'antd';

import BusinessWorkingSpacesListMode from '../BusinessWorkingSpacesListMode';
import BusinessWorkingSpacesGridMode from '../BusinessWorkingSpacesGridMode';
import EmptyState from '../EmptyState';

import './index.scss';

const b = bem('businessWorkingSpacesList');

class BusinessWorkingSpacesList extends Component {
  state = {
    mode: 'grid',
  };

  handleChangeActiveTab = toTab => () => this.props.changeActiveTab(toTab);

  render() {
    const { spaces, changeActiveWorkingSpace } = this.props;
    const { mode } = this.state;
    const spacesList = [
      {
        addCard: true,
      },
      ...spaces,
    ];

    return (
      <div className={b()}>
        <div className={b('header')}>
          <h1 className={b('header-title')}>Список рабочих мест</h1>
          <div className={b('header-optionsBlock')}>
            <Icon type="unordered-list" className={b('header-optionsBlock-icon', { active: mode === 'grid' })} />
            <Divider className={b('header-optionsBlock-divider')} type="vertical" />
            <Icon type="appstore" className={b('header-optionsBlock-icon', { active: mode === 'list' })} />
          </div>
        </div>
        {
          spaces.length > 1 ? (
            <>
              {
                mode === 'grid' ? (
                  <BusinessWorkingSpacesGridMode
                    spacesList={spacesList}
                    changeActiveWorkingSpace={changeActiveWorkingSpace}
                  />
                ) : (
                  <BusinessWorkingSpacesListMode />
                )
              }
              <Row
                gutter={24}
                className={b('controlBtns')}
              >
                <Col lg={12}>
                  <Button
                    className={b('controlBtns-btn backBtn')}
                    onClick={this.handleChangeActiveTab('schedule')}
                  >
                    <Icon type="left" />
                    Назад
                  </Button>
                </Col>
                <Col lg={12}>
                  <Button
                    className={b('controlBtns-btn')}
                    type="primary"
                  >
                    <Link to="/corporations">
                      Далее
                    </Link>
                  </Button>
                </Col>
              </Row>
            </>
          ) : (
            <EmptyState
              title="У вас нету рабочих мест"
              descrText="Создайте первое рабочее место, куда Вы сможете добавить Ваших работников и куда будут записываться Ваши клиенты"
              addItemText="Создать рабочее место"
              addItemHandler={changeActiveWorkingSpace}
            />
          )
        }
      </div>
    );
  }
}

export default BusinessWorkingSpacesList;
