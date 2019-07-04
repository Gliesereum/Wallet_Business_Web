import React from 'react';
import bem from 'bem-join';

import { Table, Button } from 'antd';

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
      width: '30%',
    },
    {
      title: '',
      key: 'edit',
      render: (text, record) => (
        <Button
          className={b('table-editBtn')}
          onClick={changeActiveWorkingSpace(record, false)}
        >
          Редактировать
        </Button>
      ),
      width: '15%',
    },
  ];

  const spaces = spacesList.map(item => ({
    ...item,
    key: item.id || 0,
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
