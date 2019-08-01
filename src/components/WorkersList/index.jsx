import React, { Component } from 'react';
import bem from 'bem-join';

import {
  Select,
  Icon,
  Input,
  Table,
  Col,
  Button,
  Row,
} from 'antd';

import EmptyState from '../EmptyState';

import { genders, dayTranslateTemporary } from '../../mocks';

const b = bem('workersList');
const { Option } = Select;
const { Search } = Input;

const generateDate = (date, withTimestamp = false) => {
  if (!date) return 'Невалидная дата';

  const dateInMS = new Date(date);
  const YYYY = dateInMS.getFullYear();
  const MM = String(dateInMS.getMonth() + 1).padStart(2, '0'); // month of the year
  const DD = String(dateInMS.getDate()).padStart(2, '0'); // day of the month

  let dateString = `${DD} / ${MM} / ${YYYY}`;
  if (withTimestamp) {
    const hh = String(dateInMS.getHours()).padStart(2, '0');
    const mm = String(dateInMS.getMinutes()).padStart(2, '0');
    dateString = `${dateString} - ${hh}:${mm}`;
  }

  return dateString;
};

const generateSchedule = (from, to, isWork) => {
  if (!isWork) return 'Выходной';
};

class WorkersList extends Component {
  state = {
    businesses: [],
    chosenCorporation: '',
    chosenBusiness: undefined,
    workersByBusiness: [],
    searchProcess: false,
    expandedRowKeys: [], // for Icon type regulation
    columnSortOrder: {
      name: 'ascend',
      phone: 'ascend',
      position: 'ascend',
    },
  };

  componentDidMount() {
    const { corporations, workers } = this.props;

    corporations.length && corporations[0] && this.handleCorpChange(corporations[0].id); // TODO: change to [0]
    this.setState({ workersByBusiness: workers, searchedWorkers: workers });
  }

  componentWillReceiveProps(nextProps) {
    this.setState({ workersByBusiness: nextProps.workers, searchedWorkers: nextProps.workers });
  }

  handleCorpChange = async (corporationId) => {
    const businesses = await this.props.getBusinessByCorporationId(corporationId, true);

    this.setState({
      chosenCorporation: corporationId,
      chosenBusiness: undefined,
      businesses,
    });
  };

  handleBusinessChange = businessId => this.setState({
    chosenBusiness: businessId,
    workersByBusiness: this.props.workers.filter(worker => businessId === worker.businessId),
  });

  handleSortColumn = (columnName, prevOrder) => {
    const { searchedWorkers } = this.state;
    let newSearchedWorkers = searchedWorkers;

    if (columnName === 'phone') {
      newSearchedWorkers = prevOrder === 'ascend'
        ? searchedWorkers.sort((a, c) => a.user.phone - c.user.phone)
        : searchedWorkers.sort((a, c) => c.user.phone - a.user.phone);
    } else if (columnName === 'name' || columnName === 'position') {
      newSearchedWorkers = prevOrder === 'ascend'
        ? searchedWorkers.sort((a, c) => a.user && a.user.lastName.localeCompare(c.user.lastName))
        : searchedWorkers.sort((a, c) => c.user && c.user.lastName.localeCompare(a.user.lastName));
    }

    this.setState(prevState => ({
      ...prevState,
      columnSortOrder: {
        ...prevState.columnSortOrder,
        [columnName]: prevOrder === 'ascend' ? 'descend' : 'ascend',
      },
      searchedWorkers: newSearchedWorkers,
    }));
  };

  handleSearchWorkers = (e) => {
    const { value } = e.target;
    const { workersByBusiness } = this.state;
    if (!value || value === '') {
      this.setState({ searchProcess: false, searchedWorkers: workersByBusiness });
      return;
    }

    const type = parseInt(value, 10) ? 'number' : 'string';
    let searchedWorkers = [];

    if (type === 'number') {
      searchedWorkers = workersByBusiness.filter(({ user }) => (user.phone ? user.phone.includes(value) : false));
    } else if (type === 'string') {
      searchedWorkers = workersByBusiness.filter(({ user }) => (
        `${user.lastName} ${user.firstName} ${user.middleName}`.toUpperCase().includes(value.toUpperCase())
      ));
    }

    this.setState({ searchProcess: true, searchedWorkers });
  };

  handleExpandRow = record => ({
    onClick: () => this.setState((prevState) => {
      let newExpandedRowKeys = prevState.expandedRowKeys;

      if (prevState.expandedRowKeys.includes(record.id)) {
        newExpandedRowKeys = newExpandedRowKeys.filter(key => key !== record.id);
      } else {
        newExpandedRowKeys.push(record.id);
      }

      return {
        expandedRowKeys: newExpandedRowKeys,
      };
    }),
  });

  renderExpandedRow = (worker) => {
    const { workTimes, position, user } = worker;
    const schedules = dayTranslateTemporary.map((day, index) => ({
      from: workTimes.length ? workTimes[index].from : 0,
      to: workTimes.length ? workTimes[index].to : 0,
      isWork: workTimes.length ? workTimes[index].isWork : false,
      dayOfWeek: workTimes.length ? workTimes[index].dayOfWeek : day.translate,
    }));

    return (
      <Row
        className={b('expandTable')}
        type="flex"
        justify="space-between"
      >
        <Col
          lg={10}
          className={b('expandTable-row')}
        >
          <h1 className={b('expandTable-row-header')}>Данные работника</h1>
          <Row
            type="flex"
            justify="space-between"
          >
            <Col lg={11}>
              <div className={b('expandTable-row-userInfo-box')}>
                <div className="title">Должность:</div>
                <div className="data">{position}</div>
              </div>
              <div className={b('expandTable-row-userInfo-box')}>
                <div className="title">Профайл создано:</div>
                <div className="data">{generateDate(user.createDate)}</div>
              </div>
              <div className={b('expandTable-row-userInfo-box')}>
                <div className="title">Последняя активность:</div>
                <div className="data">{generateDate(user.lastActivity, true)}</div>
              </div>
            </Col>
            <Col lg={11}>
              <div className={b('expandTable-row-userInfo-box')}>
                <div className="title">Пол:</div>
                <div className="data">{user.gender ? genders[user.gender] : genders.UNKNOWN}</div>
              </div>
              <div className={b('expandTable-row-userInfo-box')}>
                <div className="title">Последняя сессия:</div>
                <div className="data">{generateDate(user.lastSignIn, true)}</div>
              </div>
            </Col>
          </Row>
        </Col>
        <Col
          lg={10}
          className={b('expandTable-row')}
        >
          <h1 className={b('expandTable-row-header')}>Дни и время работы</h1>
          <Row
            type="flex"
            justify="space-between"
          >
            <Col lg={11}>
              {
                schedules.slice(0, 4).map(day => (
                  <div
                    key={day.dayOfWeek}
                    className={b('expandTable-row-userInfo-box')}
                  >
                    <div className="title">{`${day.dayOfWeek}:`}</div>
                    <div className="data">{generateSchedule(day.from, day.to, day.isWork)}</div>
                  </div>
                ))
              }
            </Col>
            <Col lg={11}>
              {
                schedules.slice(4).map(day => (
                  <div
                    key={day.dayOfWeek}
                    className={b('expandTable-row-userInfo-box')}
                  >
                    <div className="title">{`${day.dayOfWeek}:`}</div>
                    <div className="data">{generateSchedule(day.from, day.to, day.isWork)}</div>
                  </div>
                ))
              }
            </Col>
          </Row>
        </Col>
      </Row>
    );
  };

  render() {
    const {
      changeActiveWorker,
      corporations,
    } = this.props;
    const {
      chosenCorporation,
      chosenBusiness,
      businesses,
      workersByBusiness,
      searchedWorkers,
      searchProcess,
      expandedRowKeys,
      columnSortOrder: { name, phone, position },
    } = this.state;
    const isWorkersExist = (workersByBusiness && workersByBusiness.length) || searchProcess;

    const columns = [
      {
        title: (
          <div className={b('content-workersTable-columnHeaderText')}>
            <span>Имя</span>
            <Icon type={name === 'ascend' ? 'arrow-up' : 'arrow-down'} />
          </div>
        ),
        key: 'name',
        onHeaderCell: () => ({
          onClick: () => this.handleSortColumn('name', name),
        }),
        onCell: () => ({
          style: {
            whiteSpace: 'nowrap',
            maxWidth: 325,
            textOverflow: 'ellipsis',
            overflow: 'hidden',
          },
        }),
        render: (text, { user }) => <span>{`${user.lastName} ${user.firstName} ${user.middleName}`}</span>,
        width: 325,
      },
      {
        title: (
          <div className={b('content-workersTable-columnHeaderText')}>
            <span>Телефон</span>
            <Icon type={phone === 'ascend' ? 'arrow-up' : 'arrow-down'} />
          </div>
        ),
        key: 'phone',
        onHeaderCell: () => ({
          onClick: () => this.handleSortColumn('phone', phone),
        }),
        render: (text, { user }) => <span>{user.phone}</span>,
        width: 175,
      },
      {
        title: (
          <div className={b('content-workersTable-columnHeaderText')}>
            <span>Рабочее место</span>
            <Icon type={position === 'ascend' ? 'arrow-up' : 'arrow-down'} />
          </div>
        ),
        dataIndex: 'position',
        onHeaderCell: () => ({
          onClick: () => this.handleSortColumn('position', position),
        }),
        width: 225,
      },
      {
        className: 'edit-column',
        onCell: record => ({
          onClick: () => changeActiveWorker(record, false)(),
        }),
        width: 125,
        render: () => <div>Редактировать</div>,
      },
      {
        title: '',
        align: 'right',
        width: 45,
        render: record => <Icon type={expandedRowKeys.includes(record.id) ? 'up' : 'down'} />,
      },
    ];
    return (
      <div className={b()}>
        <div className={b('header')}>
          <h1 className={b('header-title')}>Просмотр сотрудников</h1>
          <div className={b('header-selectorBox')}>
            <Select
              onChange={this.handleCorpChange}
              style={{ width: '280px' }}
              value={chosenCorporation}
            >
              {
                corporations.map(item => (
                  <Option
                    key={item.id}
                    value={item.id}
                  >
                    {item.name}
                  </Option>
                ))
              }
            </Select>
            <Icon
              type="right"
              className={b('header-selectorBox-rightArrow')}
            />
            <Select
              onChange={this.handleBusinessChange}
              style={{ width: '280px' }}
              value={chosenBusiness}
              placeholder="Выберите бизнес"
            >
              {
                businesses.length && businesses.map(item => (
                  <Option
                    key={item.id}
                    value={item.id}
                  >
                    {item.name}
                  </Option>
                ))
              }
            </Select>
          </div>
        </div>
        <div className={b('content', { isWorkersExist })}>
          {
            isWorkersExist ? (
              <>
                <div className={b('content-searchBox')}>
                  <label htmlFor="searchWorkerInput">Поиск по имени или номеру телефона</label>
                  <Search
                    placeholder="Поиск..."
                    id="searchWorkerInput"
                    onChange={this.handleSearchWorkers}
                  />
                </div>
                <Table
                  rowKey={record => record.id}
                  className={b('content-workersTable')}
                  columns={columns}
                  dataSource={searchedWorkers}
                  pagination={false}
                  expandedRowRender={record => this.renderExpandedRow(record)}
                  expandIconAsCell={false} // need for hidden default expand icon
                  expandRowByClick
                  onRow={this.handleExpandRow}
                  scroll={{ y: 368 }}
                />

                <Row
                  gutter={32}
                  className={b('content-controlBtns')}
                >
                  <Col lg={14}>
                    <div className={b('content-controlBtns-infoBlock')}>
                      <Icon type="info-circle" />
                      <div>Если профайл сотрудника отсутствует, его необходимо создать</div>
                      <div className={b('content-controlBtns-infoBlock-arrow')} />
                    </div>
                  </Col>
                  <Col lg={10}>
                    <Button
                      className={b('content-controlBtns-btn')}
                      onClick={changeActiveWorker(null, true)}
                      type="primary"
                    >
                      Создать профайл сотрудника
                    </Button>
                  </Col>
                </Row>
              </>
            ) : (
              <EmptyState
                title="У вас нету зарегистрированных сотрудников"
                descrText="Создайте работника, чтобы просматривать и редактировать информацию о нем"
                addItemText="Создать сотрудника"
                addItemHandler={changeActiveWorker}
              />
            )
          }
        </div>
      </div>
    );
  }
}

export default WorkersList;
