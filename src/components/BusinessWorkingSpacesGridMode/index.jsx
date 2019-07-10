import React from 'react';
import bem from 'bem-join';

import {
  Button,
  Card,
  List,
  Icon,
} from 'antd';

import AddIcon from '../../assets/AddIcon.svg';

import './index.scss';

const b = bem('businessWorkingSpacesGridMode');
const { Item } = List;

const BusinessWorkingSpacesGridMode = ({ spacesList, changeActiveWorkingSpace }) => (
  <List
    className={b()}
    grid={{
      gutter: 12,
      lg: 3,
    }}
    dataSource={spacesList}
    renderItem={item => (
      item.addCard ? (
        <Item
          onClick={changeActiveWorkingSpace(null, true)}
          className={b('item', { addCard: true })}
        >
          <Card>
            <img src={AddIcon} alt="addWorkingSpace" />
            <span>{'Добавить рабочее место'.toUpperCase()}</span>
          </Card>
        </Item>
      ) : (
        <Item className={b('item')}>
          <Card
            title={(
              <div className={b('item-title')}>
                <div className={b('item-title-circle')}>
                  <div className={b('item-title-circle-number')}>{item.indexNumber}</div>
                </div>
                <div className={b('item-title-text')}>{item.name}</div>
              </div>
            )}
          >
            <div className={b('item-body')}>
              <div className={b('item-body-descr')}>
                <h1>Описание места</h1>
                <p>{item.description}</p>
              </div>
              <div className={b('item-body-workers')}>
                <h1>Список сотрудников</h1>
                <List
                  className={b('item-body-workers-list')}
                  dataSource={item.workers}
                  renderItem={({ user }) => (
                    <div className={b('item-body-workers-list-item')}>
                      {
                        user && (
                          <>
                            <div>{`${user.lastName} ${user.firstName} ${user.middleName}`}</div>
                            <Icon type="info-circle" theme="filled" />
                          </>
                        )
                      }
                    </div>
                  )}
                />
                <Button
                  className={b('item-body-workers-btn')}
                  onClick={changeActiveWorkingSpace(item, false)}
                >
                  Редактировать
                </Button>
              </div>
            </div>
          </Card>
        </Item>
      )
    )}
  />
);

export default BusinessWorkingSpacesGridMode;
