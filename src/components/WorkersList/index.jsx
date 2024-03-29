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
import ScreenLoading from '../ScreenLoading';
import ContentHeader from '../ContentHeader';

import { genders, dayTranslateTemporary, dayTranslate } from '../../mocks';

const b = bem('workersList');
const { Option } = Select;
const { Search } = Input;

const generateDate = (date, withTimestamp = false) => {
  if (!date) return '';

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

const generateSchedule = (from, to, isWork, dayOffLocalize) => {
  if (!isWork) return dayOffLocalize;

  const dateInMSFrom = new Date(from);
  const fromHours = String(dateInMSFrom.getUTCHours()).padStart(2, '0');
  const fromMinutes = String(dateInMSFrom.getUTCMinutes()).padStart(2, '0');

  const dateInMsTo = new Date(to);
  const toHours = String(dateInMsTo.getUTCHours()).padStart(2, '0');
  const toMinutes = String(dateInMsTo.getUTCMinutes()).padStart(2, '0');

  return `${fromHours}:${fromMinutes} - ${toHours}:${toMinutes}`;
};

class WorkersList extends Component {
  state = {
    loader: false, // TODO: refactor in next realise
    businesses: [],
    chosenCorporation: undefined,
    chosenBusiness: undefined,
    searchedWorkers: [],
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

    corporations.length && corporations[0] && this.handleCorpChange(corporations[0].id);
    this.setState({ searchedWorkers: workers });
  }

  componentWillReceiveProps(nextProps) {
    this.setState({ searchedWorkers: nextProps.workers });
  }

  toggleLoader = bool => this.setState({ loader: bool });

  handleCorpChange = async (corporationId) => {
    this.toggleLoader(true);
    const businesses = await this.props.getBusinessByCorporationId(corporationId, true, this.toggleLoader);

    this.setState({
      chosenCorporation: corporationId,
      chosenBusiness: undefined,
      businesses,
    });
  };

  handleBusinessChange = async (businessId) => {
    this.toggleLoader(true);
    const { getWorkers } = this.props;

    await getWorkers({ businessId, loaderHandler: this.toggleLoader });
    this.setState({ chosenBusiness: businessId });
  };

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
    const { workers } = this.props;
    if (!value || value === '') {
      this.setState({ searchProcess: false, searchedWorkers: workers });
      return;
    }

    const type = parseInt(value, 10) ? 'number' : 'string';
    let searchedWorkers = [];

    if (type === 'number') {
      searchedWorkers = workers.filter(({ user }) => (user.phone ? user.phone.includes(value) : false));
    } else if (type === 'string') {
      searchedWorkers = workers.filter(({ user }) => (
        `${user.lastName} ${user.firstName} ${user.middleName}`.toUpperCase().includes(value.toUpperCase())
      ));
    }

    this.setState({ searchProcess: true, searchedWorkers });
  };

  handleTableChange = (pagination) => {
    const { chosenBusiness, chosenCorporation } = this.state;
    const { getWorkers } = this.props;

    this.toggleLoader(true);

    getWorkers({
      corporationId: chosenCorporation,
      businessId: chosenBusiness,
      page: pagination.current - 1,
      loaderHandler: this.toggleLoader,
    });
  };

  handleExpandRow = worker => ({
    onClick: () => this.setState((prevState) => {
      let newExpandedRowKeys = prevState.expandedRowKeys;

      if (prevState.expandedRowKeys.includes(worker.id)) {
        newExpandedRowKeys = newExpandedRowKeys.filter(key => key !== worker.id);
      } else {
        newExpandedRowKeys.push(worker.id);
      }

      return {
        expandedRowKeys: newExpandedRowKeys,
      };
    }),
  });

  renderExpandedRow = (worker) => {
    const { workTimes = [], position, user = {} } = worker;
    const schedules = dayTranslateTemporary.reduce((acc, day) => {
      const [dayOfWeek] = workTimes.filter(item => item.dayOfWeek === day.dayOfWeek);
      acc.push({ ...day, ...dayOfWeek });
      return acc;
    }, []);
    const { defaultLanguage, phrases } = this.props;

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
          <h1 className={b('expandTable-row-header')}>Данные сотрудника</h1>
          <Row
            type="flex"
            justify="space-between"
          >
            <Col lg={11}>
              <div className={b('expandTable-row-userInfo-box')}>
                <div className="title">Должность:</div>
                <div className="data">{position}</div>
              </div>
              {
                user.createDate && (
                  <div className={b('expandTable-row-userInfo-box')}>
                    <div className="title">Профайл создан:</div>
                    <div className="data">{generateDate(user.createDate)}</div>
                  </div>
                )
              }
              {
                user.lastActivity && (
                  <div className={b('expandTable-row-userInfo-box')}>
                    <div className="title">Последняя активность:</div>
                    <div className="data">{generateDate(user.lastActivity, true)}</div>
                  </div>
                )
              }
            </Col>
            <Col lg={11}>
              <div className={b('expandTable-row-userInfo-box')}>
                <div className="title">Пол:</div>
                <div className="data">{user.gender ? genders[user.gender] : genders.UNKNOWN}</div>
              </div>
              {
                user.lastSignIn && (
                  <div className={b('expandTable-row-userInfo-box')}>
                    <div className="title">Последняя сессия:</div>
                    <div className="data">{generateDate(user.lastSignIn, true)}</div>
                  </div>
                )
              }
            </Col>
          </Row>
        </Col>
        <Col
          lg={10}
          className={b('expandTable-row')}
        >
          <h1 className={b('expandTable-row-header')}>Дни и часы работы </h1>
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
                    <div className="title">
                      {`${phrases[`core.day.${dayTranslate[day.dayOfWeek]}`][defaultLanguage.isoKey]}:`}
                    </div>
                    <div className="data">
                      {generateSchedule(day.from, day.to, day.isWork, phrases['core.day.dayOff'][defaultLanguage.isoKey])}
                    </div>
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
                    <div className="title">
                      {`${phrases[`core.day.${dayTranslate[day.dayOfWeek]}`][defaultLanguage.isoKey]}:`}
                    </div>
                    <div className="data">
                      {generateSchedule(day.from, day.to, day.isWork, phrases['core.day.dayOff'][defaultLanguage.isoKey])}
                    </div>
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
      workers,
      pagination,
      defaultLanguage,
      phrases,
    } = this.props;
    const {
      chosenCorporation,
      chosenBusiness,
      businesses,
      searchedWorkers,
      searchProcess,
      expandedRowKeys,
      columnSortOrder: { name, phone, position },
      loader,
    } = this.state;
    const isWorkersExist = (workers && workers.length) || searchProcess;

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
        onCell: worker => ({
          onClick: () => changeActiveWorker(worker, false)(),
        }),
        width: 125,
        render: () => <div>Редактировать</div>,
      },
      {
        title: '',
        align: 'right',
        width: 45,
        render: worker => <Icon type={expandedRowKeys.includes(worker.id) ? 'up' : 'down'} />,
      },
    ];
    return (
      <div className={b()}>
        <ContentHeader
          title="Список сотрудников"
          content={(
            <div className={b('selectorBox')}>
              <Select
                disabled={loader}
                onChange={this.handleCorpChange}
                style={{ display: 'none' }}
                value={chosenCorporation}
                placeholder={phrases['core.selector.placeholder.choseCompany'][defaultLanguage.isoKey]}
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
                className={b('selectorBox-rightArrow')}
              />
              <Select
                disabled={loader}
                onChange={this.handleBusinessChange}
                style={{ width: '100%' }}
                value={chosenBusiness}
                placeholder={phrases['core.selector.placeholder.choseBranch'][defaultLanguage.isoKey]}
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
          )}
        />
        <div className={b('content', { isWorkersExist })}>
          {
            loader ? (
              <ScreenLoading />
            ) : (
              <>
                {
                  isWorkersExist ? (
                    <>
                      <div className={b('content-searchBox')}>
                        <label htmlFor="searchWorkerInput">Поиск по имени / номеру телефона </label>
                        <Search
                          placeholder="Поиск..."
                          id="searchWorkerInput"
                          onChange={this.handleSearchWorkers}
                        />
                      </div>
                      <Table
                        rowKey={worker => worker.id}
                        className={b('content-workersTable')}
                        columns={columns}
                        dataSource={searchedWorkers}
                        expandedRowRender={worker => this.renderExpandedRow(worker)}
                        expandIconAsCell={false} // need for hidden default expand icon
                        expandRowByClick
                        onRow={this.handleExpandRow}
                        pagination={pagination.totalPages > 1
                          ? {
                            ...pagination,
                            pageSize: 7,
                            className: b('content-pagination'),
                          }
                          : false
                        }
                        onChange={this.handleTableChange}
                        scroll={{ y: 337 }}
                      />

                      <Row
                        gutter={32}
                        className={b('content-controlBtns')}
                      >
                        <Col lg={14}>
                          <div className={b('content-controlBtns-infoBlock')}>
                            <Icon type="info-circle" />
                            <div>Если сотрудник отсутствует в списке, необходимо внести его в систему</div>
                            <div className={b('content-controlBtns-infoBlock-arrow')} />
                          </div>
                        </Col>
                        <Col lg={10}>
                          <Button
                            className={b('content-controlBtns-btn')}
                            onClick={changeActiveWorker(null, true)}
                            type="primary"
                          >
                            Создать профиль сотрудника
                          </Button>
                        </Col>
                      </Row>
                    </>
                  ) : (
                    <EmptyState
                      title="У вас пока нет зарегистрированных сотрудников"
                      descrText="Создайте сотрудника, чтобы просматривать и редактировать информацию о нем"
                      addItemText="Создать сотрудника"
                      addItemHandler={changeActiveWorker}
                    />
                  )
                }
              </>
            )
          }
        </div>
      </div>
    );
  }
}

export default WorkersList;
