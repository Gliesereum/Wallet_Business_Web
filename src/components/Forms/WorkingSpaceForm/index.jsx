import React, { PureComponent } from 'react';
import bem from 'bem-join';

import {
  Row,
  Col,
  Form,
  Input,
  Table,
  Card,
  List,
  Icon,
} from 'antd';

import './index.scss';

const b = bem('workingSpaceForm');
const { Item: FormItem } = Form;

class WorkingSpaceForm extends PureComponent {
  state = {
    workers: this.props.chosenSpace.workers,
  };

  handleSearch = (e) => {
    const searchStr = e.target.value.toString();

    const searchedWorkers = this.props.chosenSpace.workers.filter(({ user: workerUserData }) => {
      function checkIfStrInclude(field) {
        if (field) {
          return field.indexOf(searchStr) !== -1;
        }
        return false;
      }

      if (
        workerUserData
        && (
          checkIfStrInclude(workerUserData.firstName)
          || checkIfStrInclude(workerUserData.lastName)
          || checkIfStrInclude(workerUserData.middleName)
          || checkIfStrInclude(workerUserData.phone)
        )
      ) {
        return workerUserData;
      }
      return false;
    });

    this.setState({ workers: searchedWorkers });
  };

  render() {
    const { workers } = this.state;
    const { form, chosenSpace } = this.props;

    const renderContent = (value, row, index) => {
      const obj = {
        children: value,
        props: {},
      };
      if (index === 0) {
        obj.props.colSpan = 0;
      }
      return obj;
    };

    const columns = [
      {
        title: 'ФИО работника',
        key: 'fullName',
        width: '35%',
        sorter: (first, second) => first.user.lastName && first.user.lastName.localeCompare(second.user.lastName),
        sortDirections: ['ascend', 'descend'],
        render: (text, { user }, index) => {
          if (index === 0) {
            return {
              children: (
                <div>
                  <Input
                    onChange={this.handleSearch}
                    placeholder="Поиск..."
                    suffix={<Icon type="search" />}
                  />
                </div>
              ),
              props: {
                colSpan: 3,
              },
            };
          }
          return <span>{`${user.lastName} ${user.firstName} ${user.middleName}`}</span>;
        },
      },
      {
        title: 'Должность',
        dataIndex: 'position',
        key: 'workPosition',
        width: '30%',
        render: renderContent,
        sorter: (first, second) => first.position.localeCompare(second.position),
        sortDirections: ['ascend', 'descend'],
      },
      {
        title: 'Телефон',
        key: 'phone',
        width: '35%',
        sorter: (first, second) => first.user.phone && first.user.phone.localeCompare(second.user.phone),
        sortDirections: ['ascend', 'descend'],
        render: (text, { user }, index) => {
          if (index === 0) {
            return {
              children: null,
              props: {
                colSpan: 0,
              },
            };
          }
          return <span>{user.phone}</span>;
        },
      },
    ];

    const workersWS = [{ id: 'searchRow' }, ...workers];

    return (
      <Form
        colon={false}
        className={b()}
      >
        <Row
          gutter={24}
          className={b('inputsBlock')}
        >
          <Col lg={12}>
            <FormItem label="Название рабочего места">
              {
                form.getFieldDecorator('name', {
                  initialValue: chosenSpace.name,
                  rules: [
                    { required: true, message: 'Поле обязательное для заполнения' },
                  ],
                })(
                  <Input
                    placeholder="Ввод..."
                  />
                )
              }
            </FormItem>
          </Col>
          <Col lg={12}>
            <FormItem label="Описание рабочего места">
              {
                form.getFieldDecorator('name', {
                  initialValue: chosenSpace.description,
                })(
                  <Input
                    placeholder="Ввод..."
                  />
                )
              }
            </FormItem>
          </Col>
        </Row>

        <div className={b('workersBox')}>
          <h1 className={b('workersBox-title')}>Сотрудники рабочего места</h1>
          <Row
            className={b('workersBox-table')}
            gutter={16}
          >
            <Col lg={16}>
              <Table
                rowKey={record => record.id}
                className={b('workersBox-table-list')}
                pagination={false}
                columns={columns}
                dataSource={workersWS}
                scroll={{ y: 224 }}
              />
            </Col>
            <Col lg={8}>
              <Card
                className={b('workersBox-table-chosenCard')}
                title="Рабочая локация"
              >
                <div className={b('workersBox-table-chosenCard-item-body')}>
                  <div className={b('workersBox-table-chosenCard-item-body-title')}>
                    <h1>Список выбраных работников</h1>
                  </div>
                  <div className={b('workersBox-table-chosenCard-item-body-workers')}>
                    <List
                      className={b('workersBox-table-chosenCard-item-body-workers-list')}
                      dataSource={workers}
                      renderItem={({ user }) => (
                        <div className={b('workersBox-table-chosenCard-item-body-workers-list-item')}>
                          <div>{`${user.lastName} ${user.firstName} ${user.middleName}`}</div>
                          <Icon type="info-circle" theme="filled" />
                        </div>
                      )}
                    />
                  </div>
                </div>
              </Card>
            </Col>
          </Row>
        </div>
      </Form>
    );
  }
}

export default Form.create({})(WorkingSpaceForm);
