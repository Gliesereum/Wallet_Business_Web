import React, { Component } from 'react';
import bem from 'bem-join';

import {
  Select,
  Icon,
  Input,
  Table,
  notification,
  Col,
  Button,
  Row,
} from 'antd';

import EmptyState from '../EmptyState';

import { fetchBusinessesByCorp, fetchClientsByIds } from '../../fetches';

const b = bem('clientsList');
const { Option } = Select;
const { Search } = Input;

class ClientsList extends Component {
  state = {
    clients: [],
    chosenCorporation: '',
    chosenBusiness: undefined,
    businesses: [],
    searchedClients: [],
    searchProcess: false,
    columnSortOrder: {
      name: 'ascend',
      phone: 'ascend',
    },
  };

  componentDidMount() {
    const { corporations, changeChoseCorporationId } = this.props;

    corporations.length && corporations[2] && this.handleCorpChange(corporations[2].id);
    changeChoseCorporationId(corporations[2].id);
  }

  handleCorpChange = async (corporationId) => {
    const businesses = await this.handleGetBusinessByCorporationId(corporationId, true);

    this.props.changeChoseCorporationId(corporationId);
    this.setState({
      chosenCorporation: corporationId,
      chosenBusiness: undefined,
      businesses,
    });
  };

  handleBusinessChange = async (businessId) => {
    await this.handleGetClientsById({ businessId });

    this.setState({
      chosenBusiness: businessId,
    });
  };

  handleGetBusinessByCorporationId = async (corporationId, getClients = false) => {
    let businesses = [];
    try {
      const { data = [] } = await fetchBusinessesByCorp({ corporationId });
      getClients && await this.handleGetClientsById({ corporationId });

      businesses = data;
    } catch (err) {
      notification.error({
        duration: 5,
        message: err.message || 'Ошибка',
        description: 'Возникла ошибка',
      });
    }

    return businesses;
  };

  handleGetClientsById = async ({ corporationId, businessId, queryValue }) => {
    try {
      const { data: clients = [] } = await fetchClientsByIds({ corporationId, businessId, query: queryValue });
      this.setState(prevState => ({
        ...prevState,
        clients: queryValue ? prevState.clients : clients,
        searchedClients: clients,
      }));
    } catch (err) {
      notification.error({
        duration: 5,
        message: err.message || 'Ошибка',
        description: 'Возникла ошибка',
      });
    }
  };

  handleSortColumn = (columnName, prevOrder) => {
    const { searchedClients } = this.state;
    let newSearchedClients = searchedClients;

    if (columnName === 'phone') {
      newSearchedClients = prevOrder === 'ascend'
        ? searchedClients.sort((a, c) => a.phone - c.phone)
        : searchedClients.sort((a, c) => c.phone - a.phone);
    } else if (columnName === 'name') {
      newSearchedClients = prevOrder === 'ascend'
        ? searchedClients.sort((a, c) => a.lastName.localeCompare(c.lastName))
        : searchedClients.sort((a, c) => c.lastName.localeCompare(a.lastName));
    }

    this.setState(prevState => ({
      ...prevState,
      columnSortOrder: {
        ...prevState.columnSortOrder,
        [columnName]: prevOrder === 'ascend' ? 'descend' : 'ascend',
      },
      searchedClients: newSearchedClients,
    }));
  };

  handleSearchClients = async (e) => {
    const { value: queryValue } = e.target;
    const { chosenBusiness, chosenCorporation } = this.state;

    if (!queryValue || queryValue.length < 3) {
      chosenBusiness
        ? await this.handleGetClientsById({ businessId: chosenBusiness })
        : await this.handleGetClientsById({ corporationId: chosenCorporation });
      this.setState({ searchProcess: false });
      return;
    }

    chosenBusiness
      ? await this.handleGetClientsById({ businessId: chosenBusiness, queryValue })
      : await this.handleGetClientsById({ corporationId: chosenCorporation, queryValue });
    this.setState({ searchProcess: true });
  };

  createMailing = () => {
    console.log('createMailing');
  };

  render() {
    const {
      clients,
      chosenCorporation,
      chosenBusiness,
      businesses,
      searchedClients,
      searchProcess,
      columnSortOrder: { name, phone },
    } = this.state;
    const { corporations, changeActiveClient } = this.props;
    const isClientsExist = (clients && clients.length) || searchProcess;

    const columns = [
      {
        title: (
          <div className={b('content-clientsTable-columnHeaderText')}>
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
            maxWidth: 350,
            textOverflow: 'ellipsis',
            overflow: 'hidden',
          },
        }),
        render: (text, client) => <span>{`${client.lastName} ${client.firstName} ${client.middleName}`}</span>,
        width: 350,
      },
      {
        key: 'phone',
        title: (
          <div className={b('content-clientsTable-columnHeaderText')}>
            <span>Телефон</span>
            <Icon type={phone === 'ascend' ? 'arrow-up' : 'arrow-down'} />
          </div>
        ),
        onHeaderCell: () => ({
          onClick: () => this.handleSortColumn('phone', phone),
        }),
        render: (text, client) => <span>{client.phone}</span>,
        width: 240,
      },
      {
        className: 'action-column',
        onCell: client => ({
          onClick: () => changeActiveClient(client, false)(),
        }),
        width: 105,
        render: () => <div>Информация</div>,
      },
      {
        className: 'action-column',
        onCell: client => ({
          onClick: () => console.log(client),
        }),
        width: 105,
        render: () => <div>Связь</div>,
      },
    ];

    return (
      <div className={b()}>
        <div className={b('header')}>
          <p className={b('header-title')}>Просмотр клиентов</p>
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
        <div className={b('content', { isClientsExist })}>
          {
            isClientsExist ? (
              <>
                <div className={b('content-searchBox')}>
                  <label htmlFor="searchClientInput">Поиск по имени или номеру телефона</label>
                  <Search
                    placeholder="Поиск с 3-х символов..."
                    id="searchClientInput"
                    onChange={this.handleSearchClients}
                  />
                </div>
                <Table
                  rowKey={client => client.id}
                  className={b('content-clientsTable')}
                  columns={columns}
                  dataSource={searchedClients}
                  pagination={false}
                  scroll={{ y: 408 }}
                />

                <Row
                  gutter={32}
                  className={b('content-controlBtns')}
                >
                  <Col lg={14}>
                    <div className={b('content-controlBtns-infoBlock')}>
                      <Icon type="info-circle" />
                      <div>Выберите клиентов, для которых нужно создать рассылку </div>
                      <div className={b('content-controlBtns-infoBlock-arrow')} />
                    </div>
                  </Col>
                  <Col lg={10}>
                    <Button
                      disabled // TODO: make createMailing feature
                      className={b('content-controlBtns-btn')}
                      onClick={this.createMailing}
                      type="primary"
                    >
                      Создать рассылку
                    </Button>
                  </Col>
                </Row>
              </>
            ) : (
              <EmptyState
                title="У вас нету зарегистрированных клиентов"
                descrText="Когда клиенты появлятся, вы сможете просмотреть их в этом месте"
                withoutBtn
              />
            )
          }
        </div>
      </div>
    );
  }
}

export default ClientsList;
