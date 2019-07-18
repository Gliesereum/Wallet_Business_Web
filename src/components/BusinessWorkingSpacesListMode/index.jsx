import React from 'react';
import bem from 'bem-join';

import { Table, Button, List } from 'antd';

import './index.scss';

import AddIcon from '../../assets/AddIcon.svg';

const b = bem('businessWorkingSpacesListMode');

const BusinessWorkingSpacesListMode = ({ spacesList, changeActiveWorkingSpace }) => {
  const columns = [
    {
      title: 'Название рабочего места',
      dataIndex: 'name',
      key: 'name',
      width: '25%',
    },
    {
      title: 'Описание рабочего места',
      dataIndex: 'description',
      key: 'description',
      width: '30%',
    },
    {
      title: 'Список сотрудников',
      dataIndex: 'workers',
      key: 'workers',
      render: (text, record) => (
        <List className={b('table-row-userList')}>
          {
            record.workers && record.workers.map(({ user }) => (
              <div
                key={user.id}
                className={b('table-row-userList-item')}
              >
                {`${user.lastName} ${user.firstName} ${user.middleName}`}
              </div>
            ))
          }
        </List>
      ),
      width: '30%',
    },
    {
      title: '',
      key: 'edit',
      render: (text, record) => (
        <Button
          className={b('table-row-editBtn')}
          onClick={changeActiveWorkingSpace(record.self, false)}
        >
          Редактировать
        </Button>
      ),
      width: '15%',
    },
  ];

  const spaces = spacesList.map(item => ({
    name: item.name,
    description: item.description,
    workers: item.workers,
    key: item.id || 0,
    self: item,
  }));

  return (
    <div className={b()}>
      <div
        className={b('addBox')}
        onClick={changeActiveWorkingSpace(null, true)}
      >
        <img src={AddIcon} alt="addService" />
        <span>{'Добавить рабочее место'.toUpperCase()}</span>
      </div>
      <Table
        rowClassName={b('table-row')}
        pagination={false}
        columns={columns}
        dataSource={spaces}
        scroll={{ y: 360 }}
        className={b('table')}
      />
    </div>
  );
};

export default BusinessWorkingSpacesListMode;
