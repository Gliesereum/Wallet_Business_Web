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
import { actions } from '../../state';

const b = bem('ordersPage');
const { Option } = Select;

class OrdersPage extends Component {
  state = {
    loader: false,
    chosenCorporation: undefined,
    chosenBusiness: undefined,
    businesses: [],
    pagination: this.props.ordersPage ? this.props.ordersPage : {
      number: 0,
      totalPages: 0,
      totalElements: 0,
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
    const businesses = await this.handleGetBusinessByCorporationId(corporationId);

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

  handleGetBusinessByCorporationId = async (corporationId) => {
    let businesses = [];
    try {
      const { data = [] } = await fetchAction({
        url: `business/by-corporation-id?id=${corporationId}`,
        fieldName: 'business',
      })();

      businesses = data;
    } catch (err) {
      notification.error({
        duration: 5,
        message: err.message || 'Ошибка',
        description: 'Ошибка',
      });
    } finally {
      this.setState({ loader: false });
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
        reduxAction: this.props.getOrders,
      })();

      this.setState(prevState => ({
        ...prevState,
        pagination: {
          ...prevState.pagination,
          number: ordersPage.number + 1,
          totalPages: ordersPage.totalPages,
          totalElements: ordersPage.totalElements,
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
      reduxAction: this.props.getOrders,
    })();

    this.setState(prevState => ({
      ...prevState,
      from,
      to,
      pagination: {
        ...prevState.pagination,
        number: 0,
        totalPages: data.totalPages,
        totalElements: data.totalElements,
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
      pagination,
    } = this.state;
    const {
      orders,
      corporations,
      defaultLanguage,
      phrases,
      updateOrderStatus,
    } = this.props;

    return (
      <div className={b()}>
        <ContentHeader
          title={phrases['orders.page.title'][defaultLanguage.isoKey]}
          content={(
            <div className={b('selectorBox')}>
              <Select
                disabled={loader}
                onChange={this.handleCorpChange}
                style={{ width: '280px' }}
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
                style={{ width: '280px' }}
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
        <div className={b('content')}>
          <div className={b('content-options')}>
            <PeriodSelector
              title={phrases['orders.list.title'][defaultLanguage.isoKey]}
              defaultLanguage={defaultLanguage}
              phrases={phrases}
              getFromToData={this.handleRefreshOrdersByFromTo}
            />
          </div>
          <OrdersList
            orders={orders}
            loader={loader}
            pagination={pagination}
            defaultLanguage={defaultLanguage}
            phrases={phrases}
            paginationChange={this.handlePaginationChange}
            updateOrderStatus={updateOrderStatus}
          />
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  corporations: state.corporations.corporations,
  ordersPage: state.business.ordersPage,
  orders: state.business.orders,
  defaultLanguage: state.app.defaultLanguage,
  phrases: state.app.phrases,
});

const mapDispatchToProps = dispatch => ({
  getOrders: orders => dispatch(actions.business.$getOrders(orders)),
  updateOrderStatus: order => dispatch(actions.business.$updateOrderStatus(order)),
});

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
  fetchDecorator({
    actions: [
      ({ corporations, getOrders }) => corporations.length && fetchAction({
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
        reduxAction: getOrders,
      })(),
    ],
    config: { loader: true },
  }),
)(OrdersPage);
