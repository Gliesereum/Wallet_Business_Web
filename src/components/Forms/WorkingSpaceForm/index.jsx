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
  Divider,
} from 'antd';

import { LinkTo } from '../../../assets/iconComponents';

const b = bem('workingSpaceForm');
const { Item: FormItem } = Form;

class WorkingSpaceForm extends PureComponent {
  state = {
    workers: this.props.workers,
    selectedWorkers: this.props.chosenSpace ? this.props.chosenSpace.workers : [],
    addedWorkers: [],
    removedWorkers: [],
  };

  handleSelectCheckboxes = (records, selected) => {
    const { workers } = this.props.chosenSpace || { workers: [] };
    const { addedWorkers, removedWorkers } = this.state;
    let added = addedWorkers;
    let removed = removedWorkers;

    if (selected && records.length === 1) { // if checked single worker
      if (workers.every(item => item.id !== records[0].id)) {
        added.push(...records); // add to addedWorkers
      } else if (workers.some(item => item.id === records[0].id)) {
        removed = removedWorkers.filter(item => item.id !== records[0].id); // removed from removedWorkers
      }
      this.setState(prevState => ({
        ...prevState,
        selectedWorkers: [
          ...records,
          ...prevState.selectedWorkers,
        ],
        addedWorkers: added,
        removedWorkers: removed,
      }));
    } else if (selected) { // if checked all workers
      for (let i = 0; i < workers.length; i += 1) {
        for (let j = 0; j < records.length; j += 1) {
          if (records[j].id !== workers[i].id && !added.some(item => item.id === records[j].id)) {
            added.push(records[j]);
          }
        }
      }
      this.setState(prevState => ({
        ...prevState,
        selectedWorkers: records,
        addedWorkers: added,
        removedWorkers: [],
      }));
    } else if (records.length === 1) { // if unchecked single worker
      if (workers.every(item => item.id !== records[0].id)) {
        added = addedWorkers.filter(item => item.id !== records[0].id); // remove from addedWorkers
      } else if (workers.some(item => item.id === records[0].id)) {
        removed.push(...records); // add to removedWorkers
      }
      this.setState(prevState => ({
        selectedWorkers: prevState.selectedWorkers.filter(worker => worker.id !== records[0].id),
        addedWorkers: added,
        removedWorkers: removed,
      }));
    } else { // if unchecked all workers
      this.setState(prevState => ({
        ...prevState,
        selectedWorkers: [],
        addedWorkers: [],
        removedWorkers: workers,
      }));
    }
  };

  handleSearch = (e) => {
    const searchStr = e.target.value.toString().toLowerCase();

    if (!this.props.chosenSpace) return false;
    const searchedWorkers = this.props.chosenSpace.workers.filter(({ user: workerUserData }) => {
      function checkIfStrInclude(field) {
        if (field) {
          return field.toLowerCase().indexOf(searchStr) !== -1;
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

  handleDeleteWorkerFromSelected = userId => () => {
    const { removedWorkers: removed, selectedWorkers } = this.state;
    const { chosenSpace } = this.props;
    if (chosenSpace && chosenSpace.workers.length && chosenSpace.workers.some(item => item.id === userId)) {
      const item = selectedWorkers.find(selectedWorker => selectedWorker.id === userId);
      removed.push(item);
    }
    this.setState(prevState => ({
      ...prevState,
      selectedWorkers: prevState.selectedWorkers.filter(user => user.id !== userId),
      addedWorkers: prevState.addedWorkers.filter(user => user.id !== userId),
      removedWorkers: removed,
    }));
  };

  render() {
    const { workers, selectedWorkers } = this.state;
    const { form, chosenSpace, toggleWorkerInfoDrawer } = this.props;

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
        title: 'ФИО сотрудника',
        key: 'fullName',
        width: '35%',
        sorter: (first, second) => {
          if (first.id === 'searchRow' || second.id === 'searchRow') return;
          return first.user.lastName && first.user.lastName.localeCompare(second.user.lastName);
        },
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
                colSpan: 4,
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
        sorter: (first, second) => {
          if (first.id === 'searchRow' || second.id === 'searchRow') return;
          return first.position.localeCompare(second.position);
        },
        sortDirections: ['ascend', 'descend'],
      },
      {
        title: 'Телефон',
        key: 'phone',
        width: '35%',
        sorter: (first, second) => {
          if (first.id === 'searchRow' || second.id === 'searchRow') return;
          return first.user.phone && first.user.phone.localeCompare(second.user.phone);
        },
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

    const rowSelection = {
      onSelect: (record, selected) => this.handleSelectCheckboxes([record], selected),
      onSelectAll: (selected, selectedRows) => this.handleSelectCheckboxes(selectedRows, selected),
      getCheckboxProps: record => ({
        disabled: record.id === 'searchRow',
      }),
      selectedRowKeys: selectedWorkers.map(user => user.id),
    };

    const workersWS = [{ id: 'searchRow' }, ...workers];

    return (
      <Form
        colon={false}
        className={b()}
      >
        <Row gutter={24}>
          <Col lg={12}>
            <FormItem label="Название рабочего места">
              {
                form.getFieldDecorator('name', {
                  initialValue: chosenSpace ? chosenSpace.name : '',
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
                form.getFieldDecorator('description', {
                  initialValue: chosenSpace ? chosenSpace.description : '',
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
          <h1 className={b('workersBox-title')}>Сотрудники</h1>
          <Row
            className={b('workersBox-table')}
            gutter={16}
          >
            <Col lg={16}>
              <Table
                rowClassName={b('workersBox-table-list-row')}
                rowKey={record => record.id}
                className={b('workersBox-table-list')}
                pagination={false}
                columns={columns}
                dataSource={workersWS}
                rowSelection={rowSelection}
                scroll={{ y: 224 }}
              />
            </Col>
            <Col lg={8}>
              <Card
                className={b('workersBox-table-chosenCard')}
                title="Рабочее место"
              >
                <div className={b('workersBox-table-chosenCard-item-body')}>
                  <div className={b('workersBox-table-chosenCard-item-body-title')}>
                    <h1>Список выбранных сотрудников</h1>
                  </div>
                  <div className={b('workersBox-table-chosenCard-item-body-workers')}>
                    <List
                      className={b('workersBox-table-chosenCard-item-body-workers-list')}
                      dataSource={selectedWorkers}
                      renderItem={({ user, id, ...rest }) => (
                        <div className={b('workersBox-table-chosenCard-item-body-workers-list-item')}>
                          <LinkTo />
                          <div
                            className={b('workersBox-table-chosenCard-item-body-workers-list-item-worker')}
                            onClick={toggleWorkerInfoDrawer({ user, ...rest })}
                          >
                            {`${user.lastName} ${user.firstName} ${user.middleName}`}
                          </div>
                          <div className={b('workersBox-table-chosenCard-item-body-workers-list-item-deleteBox')}>
                            <Divider type="vertical" />
                            <Icon
                              className={b('workersBox-table-chosenCard-deleteIcon')}
                              type="close"
                              onClick={this.handleDeleteWorkerFromSelected(id)}
                            />
                          </div>
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
