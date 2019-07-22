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
      key: 'fullName',
      width: '35%',
      sorter: (first, second) => first.user.lastName && first.user.lastName.localeCompare(second.user.lastName),
      sortDirections: ['ascend', 'descend'],
      render: (text, { user }) => (
        <span>{`${user.lastName} ${user.firstName} ${user.middleName}`}</span>
      ),
    },
    {
      title: 'Должность',
      dataIndex: 'position',
      key: 'workPosition',
      width: '30%',
      sorter: (first, second) => first.position.localeCompare(second.position),
      sortDirections: ['ascend', 'descend'],
    },
    {
      title: 'Телефон',
      key: 'phone',
      width: '35%',
      sorter: (first, second) => first.user.phone && first.user.phone.localeCompare(second.user.phone),
      sortDirections: ['ascend', 'descend'],
      render: (text, { user }) => (
        <span>{user.phone}</span>
      ),
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
            readOnly
            value={chosenSpace ? chosenSpace.name : ''}
          />
        </Col>
        <Col lg={12}>
          <div className={b('label')}>
            <label htmlFor="descrInput">Описание рабочего места</label>
          </div>
          <Input
            id="descrInput"
            readOnly
            value={chosenSpace ? chosenSpace.description : ''}
          />
        </Col>
      </Row>

      <div className={b('workersTable')}>
        <h1 className={b('workersTable-title')}>Сотрудники рабочего места</h1>
        <Table
          rowKey={record => record.id}
          className={b('workersTable-list')}
          pagination={false}
          columns={columns}
          dataSource={chosenSpace ? chosenSpace.workers : []}
          scroll={{ y: 224 }}
        />
      </div>
    </div>
  );
};

export default WorkingSpaceInfoReadOnly;
