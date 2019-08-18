import React, { Component } from 'react';
import { connect } from 'react-redux';
import compose from 'recompose/compose';
import bem from 'bem-join';

// import { OrdersList, OrdersChart } from '../../components'; // TODO: add charts

import {
  Select,
  Icon,
  notification,
  Table,
} from 'antd';

import { EmptyState, PeriodSelector } from '../../components';

import { fetchDecorator, getDate } from '../../utils';
import {
  fetchBusinessesByCorp,
  fetchOrdersByIds,
} from '../../fetches';
import { recordTranslate } from '../../mocks';

const b = bem('ordersPage');
const { Option } = Select;

class OrdersPage extends Component {
  state = {
    chosenCorporation: '',
    chosenBusiness: undefined,
    orders: [],
    businesses: [],
    pagination: {
      current: 0,
      totalPages: 0,
      total: 0,
    },
    from: null,
    to: null,
  };

  componentDidMount() {
    const { corporations } = this.props;

    if (corporations.length && corporations[0]) {
      this.handleCorpChange(corporations[0].id);
    }
  }

  handleCorpChange = async (corporationId) => {
    const businesses = await this.handleGetBusinessByCorporationId(corporationId, true);

    this.setState({
      chosenCorporation: corporationId,
      chosenBusiness: undefined,
      businesses,
    });
  };

  handleBusinessChange = async (businessId) => {
    await this.handleGetOrdersById({ businessId });

    this.setState({
      chosenBusiness: businessId,
    });
  };

  handleGetBusinessByCorporationId = async (corporationId, getOrders = false) => {
    let businesses = [];
    try {
      const { data = [] } = await fetchBusinessesByCorp({ corporationId });
      getOrders && await this.handleGetOrdersById({ corporationId });

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

  handleGetOrdersById = async ({
    corporationId,
    businessId,
    from,
    to,
    page,
  }) => {
    try {
      const { data: ordersPage = { content: [] } } = await fetchOrdersByIds({
        corporationId,
        businessId,
        page,
        from,
        to,
      });

      this.setState(prevState => ({
        ...prevState,
        orders: ordersPage.content,
        pagination: {
          ...prevState.pagination,
          current: ordersPage.number + 1,
          totalPages: ordersPage.totalPages,
          total: ordersPage.totalElements,
        },
      }));
    } catch (err) {
      notification.error({
        duration: 5,
        message: err.message || 'Ошибка',
        description: 'Возникла ошибка',
      });
    }
  };

  handleRefreshOrdersByFromTo = async ({ from, to }) => {
    const { chosenCorporation, chosenBusiness } = this.state;

    const { data } = await fetchOrdersByIds({
      corporationId: chosenCorporation,
      businessId: chosenBusiness,
      from,
      to,
    });
    this.setState({
      orders: data.content || [],
      from,
      to,
    });
  };

  handleTableChange = (pagination) => {
    const {
      chosenBusiness,
      chosenCorporation,
      from,
      to,
    } = this.state;

    this.handleGetOrdersById({
      corporationId: chosenCorporation,
      businessId: chosenBusiness,
      page: pagination.current - 1,
      from,
      to,
    });
  };

  render() {
    const {
      chosenCorporation,
      chosenBusiness,
      businesses,
      orders,
      pagination,
    } = this.state;
    const {
      corporations,
    } = this.props;
    const isOrdersExist = orders && orders.length;

    const columns = [
      {
        key: 'orderNumber',
        title: 'Заказ',
        render: (text, { recordNumber }) => <span>{recordNumber}</span>,
        width: 70,
      },
      {
        key: 'businessName',
        title: 'Бизнес',
        render: (text, { business }) => <span>{business.name}</span>,
      },
      {
        key: 'date',
        title: 'Дата',
        render: (text, { begin }) => <span>{getDate(begin)}</span>,
      },
      {
        key: 'time',
        title: 'Время',
        render: (text, { begin }) => <span>{getDate(begin, true)}</span>,
      },
      {
        key: 'status',
        className: 'status-column',
        title: 'Статус',
        render: (text, { statusProcess }) => (
          <div>
            <span>{recordTranslate.statusProcess[statusProcess]}</span>
            {recordTranslate.statusIcon[statusProcess]()}
          </div>
        ),
      },
      {
        key: 'client',
        title: 'Клиент',
        render: (text, { client }) => <span>{client ? `${client.firstName} ${client.middleName}` : ''}</span>,
      },
      {
        key: 'price',
        title: 'Сумма',
        render: (text, { price }) => <span>{`${price} грн`}</span>,
      },
    ];

    return (
      <div className={b()}>
        <div className={b('wrapper')}>
          <div className={b('header')}>
            <p className={b('header-title')}>Заказы</p>
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
          <div className={b('content')}>
            {
              isOrdersExist ? (
                <>
                  <div className={b('content-options')}>
                    <PeriodSelector
                      getFromToData={this.handleRefreshOrdersByFromTo}
                    />
                  </div>
                  <div className={b('content-orders')}>
                    <Table
                      rowKey={record => record.id}
                      className={b('content-orders-ordersTable', { isEmpty: !isOrdersExist })}
                      columns={columns}
                      dataSource={orders}
                      pagination={pagination.totalPages > 1
                        ? {
                          ...pagination,
                          pageSize: 5,
                          className: b('content-orders-pagination'),
                        }
                        : false
                      }
                      onChange={this.handleTableChange}
                    />
                  </div>
                </>
              ) : (
                <EmptyState
                  title="У вас нету заказов"
                  descrText="Когда клиенты сделают заказы, вы сможете просмотреть их в этом месте"
                  withoutBtn
                />
              )
            }
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  corporations: state.corporations.corporations,
});

export default compose(
  connect(mapStateToProps),
  fetchDecorator({
    actions: [fetchOrdersByIds],
    config: { loader: true },
  }),
)(OrdersPage);
