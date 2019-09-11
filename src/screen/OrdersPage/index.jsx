import React, { Component } from 'react';
import { connect } from 'react-redux';
import compose from 'recompose/compose';
import bem from 'bem-join';

import {
  Select,
  Icon,
  notification,
} from 'antd';

import {
  PeriodSelector,
  ContentHeader,
  OrdersList,
} from '../../components';

import { fetchDecorator } from '../../utils';
import { fetchAction } from '../../fetches';

const b = bem('ordersPage');
const { Option } = Select;

class OrdersPage extends Component {
  state = {
    loader: false,
    chosenCorporation: undefined,
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
    this.setState({ loader: true });
    const businesses = await this.handleGetBusinessByCorporationId(corporationId, true);

    this.setState({
      chosenCorporation: corporationId,
      chosenBusiness: undefined,
      businesses,
      from: null,
      to: null,
    });
  };

  handleBusinessChange = async (businessId) => {
    this.setState({ loader: true, chosenBusiness: businessId });

    await this.handleGetOrdersById({ businessId });
  };

  handleGetBusinessByCorporationId = async (corporationId, getOrders = false) => {
    let businesses = [];
    try {
      const { data = [] } = await fetchAction({
        url: `business/by-corporation-id?id=${corporationId}`,
        fieldName: 'business',
      })();
      getOrders && await this.handleGetOrdersById({ corporationId });

      businesses = data;
    } catch (err) {
      notification.error({
        duration: 5,
        message: err.message || 'Ошибка',
        description: 'Ошибка',
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
      const { data: ordersPage = { content: [] } } = await fetchAction({
        url: 'record/by-params-for-business',
        fieldName: 'ordersPage',
        fieldType: {},
        method: 'POST',
        body: {
          page,
          size: 7,
          corporationId: corporationId || null,
          businessIds: businessId ? [businessId] : [],
          from,
          to,
        },
      })();

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
        description: 'Ошибка',
      });
    } finally {
      this.setState({ loader: false });
    }
  };

  handleRefreshOrdersByFromTo = async ({ from, to }) => {
    const { chosenCorporation, chosenBusiness } = this.state;

    const { data } = await fetchAction({
      url: 'record/by-params-for-business',
      fieldName: 'ordersPage',
      fieldType: {},
      method: 'POST',
      body: {
        page: 0,
        size: 7,
        corporationId: chosenBusiness ? null : chosenCorporation,
        businessIds: chosenBusiness ? [chosenBusiness] : [],
        from,
        to,
      },
    })();

    this.setState(prevState => ({
      ...prevState,
      orders: data.content || [],
      from,
      to,
      pagination: {
        ...prevState.pagination,
        current: 0,
        totalPages: data.totalPages,
        total: data.totalElements,
      },
    }));
  };

  handlePaginationChange = (pagination) => {
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
      loader,
      chosenCorporation,
      chosenBusiness,
      businesses,
      orders,
      pagination,
    } = this.state;
    const { corporations } = this.props;

    return (
      <div className={b()}>
        <ContentHeader
          title="Заказы"
          content={(
            <div className={b('selectorBox')}>
              <Select
                disabled={loader}
                onChange={this.handleCorpChange}
                style={{ width: '280px' }}
                value={chosenCorporation}
                placeholder="Выберите компанию"
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
          )}
        />
        <div className={b('content')}>
          <div className={b('content-options')}>
            <PeriodSelector
              getFromToData={this.handleRefreshOrdersByFromTo}
            />
          </div>
          <OrdersList
            orders={orders}
            loader={loader}
            pagination={pagination}
            paginationChange={this.handlePaginationChange}
          />
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
    actions: [
      ({ corporations }) => corporations.length && fetchAction({
        url: 'record/by-params-for-business',
        fieldName: 'ordersPage',
        fieldType: {},
        method: 'POST',
        body: {
          page: 0,
          size: 7,
          corporationId: corporations[0].id || null,
          businessIds: [],
          from: null,
          to: null,
        },
      })(),
    ],
    config: { loader: true },
  }),
)(OrdersPage);
