import React, { Component } from 'react';
import bem from 'bem-join';

import {
  Icon,
  List,
  Card,
  Divider,
} from 'antd';

import EmptyState from '../EmptyState';

import AddIcon from '../../assets/AddIcon.svg';

import './index.scss';

const b = bem('businessWorkingSpacesList');
const { Item } = List;

class BusinessWorkingSpacesList extends Component {
  state = {
    mode: 'grid',
  };

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
            <List
              className={b('grid')}
              grid={{
                gutter: 24,
                lg: 3,
              }}
              dataSource={spacesList}
              renderItem={item => (
                item.addCard ? (
                  <Item
                    onClick={changeActiveWorkingSpace(null, true)}
                    className={b('grid-item', { addCard: true })}
                  >
                    <Card>
                      <img src={AddIcon} alt="addWorkingSpace" />
                      <span>{'Добавить рабочее место'.toUpperCase()}</span>
                    </Card>
                  </Item>
                ) : (
                  <Item
                    onClick={changeActiveWorkingSpace(item, false)}
                    className={b('grid-item')}
                  >
                    <Card>{item.name}</Card>
                  </Item>
                )
              )}
            />
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