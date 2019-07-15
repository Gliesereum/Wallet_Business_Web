import React, { Component } from 'react';
import { connect } from 'react-redux';
import bem from 'bem-join';

import {
  Select,
  Icon,
  notification,
  Input,
  Table,
} from 'antd';

import EmptyState from '../EmptyState';

import { fetchBusinessesByCorp } from '../../fetches';

import './index.scss';

const b = bem('workersList');
const { Option } = Select;
const { Search } = Input;

class WorkersList extends Component {
  state = {
    businesses: [],
    chosenCorporation: '',
    chosenBusiness: undefined,
    workersByBusiness: [],
    searchProcess: false,
    columnSortOrder: {
      name: 'ascend',
      phone: 'ascend',
      position: 'ascend',
    },
  };

  componentDidMount() {
    const { corporations, workers } = this.props;

    corporations && corporations[0] && this.handleCorpChange(corporations[0].id);
    this.setState({ workersByBusiness: workers, searchedWorkers: workers });
  }

  componentWillReceiveProps(nextProps) {
    this.setState({ workersByBusiness: nextProps.workers, searchedWorkers: nextProps.workers });
  }

  handleCorpChange = async (corporationId) => {
    const { getWorkers } = this.props;

    try {
      const { data: businesses = [] } = await fetchBusinessesByCorp({ corporationId });
      this.setState({
        businesses,
        chosenCorporation: corporationId,
        chosenBusiness: undefined,
      }, () => getWorkers(corporationId));
    } catch (err) {
      notification.error({
        duration: 5,
        message: err.message || 'Ошибка',
        description: 'Возникла ошибка',
      });
    }
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
        render: (text, { user }) => <span>{`${user.lastName} ${user.firstName} ${user.middleName}`}</span>,
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
                />
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

const mapStateToProps = state => ({
  corporations: state.corporations.corporations,
});

export default connect(mapStateToProps)(WorkersList);
