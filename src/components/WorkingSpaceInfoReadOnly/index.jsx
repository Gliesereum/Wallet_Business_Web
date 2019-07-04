import React from 'react';
import bem from 'bem-join';

import {
  Row,
  Col,
  Input,
  Table,
} from 'antd';

import './index.scss';

const b = bem('workingSpaceInfoReadOnly');

const WorkingSpaceInfoReadOnly = ({ chosenSpace }) => {
  const columns = [
    {
      title: 'ФИО работника',
      dataIndex: 'id',
      key: 'fullName',
      width: '35%',
      sorter: (first, second) => first.id.localeCompare(second.id),
      sortDirections: ['ascend', 'descend'],
    },
    {
      title: 'Должность',
      dataIndex: 'position',
      key: 'workPosition',
      width: '30%',
      sorter: (first, second) => first.id.localeCompare(second.id),
      sortDirections: ['ascend', 'descend'],
    },
    {
      title: 'Телефон',
      dataIndex: 'id',
      key: 'phone',
      width: '35%',
      sorter: (first, second) => first.id.localeCompare(second.id),
      sortDirections: ['ascend', 'descend'],
    },
  ];

  return (
    <div className={b()}>
      <Row gutter={24}>
        <Col lg={12}>
          <div className={b('label')}>
            <label htmlFor="nameInput">Название рабочего места</label>
          </div>
          <Input
            id="nameInput"
            disabled
            value={chosenSpace.name}
          />
        </Col>
        <Col lg={12}>
          <div className={b('label')}>
            <label htmlFor="descrInput">Описание рабочего места</label>
          </div>
          <Input
            id="descrInput"
            disabled
            value={chosenSpace.description}
          />
        </Col>
      </Row>

      <div className={b('workersTable')}>
        <h1 className={b('workersTable-title')}>Сотрудники рабочего места</h1>
        <Table
          className={b('workersTable-list')}
          pagination={false}
          columns={columns}
          dataSource={chosenSpace.workers}
          scroll={{ y: 224 }}
        />
      </div>
    </div>
  );
};

export default WorkingSpaceInfoReadOnly;
