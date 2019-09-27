import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import bem from 'bem-join';

import {
  Drawer,
  notification,
  Select,
  Button,
} from 'antd';

import ScreenLoading from '../ScreenLoading';
import { TotalPrice } from '../../assets/iconComponents';

import { fetchAction } from '../../fetches';

const b = bem('totalPriceInfoDrawer');
const { Option } = Select;

const totalPricePeriod = {
  TODAY: {
    name: 'TODAY',
    from: new Date().setUTCHours(0, 0, 0, 1),
    to: new Date().setUTCHours(23, 59, 59, 999),
  },
  WEEK: {
    name: 'WEEK',
    from: new Date(new Date().setUTCDate(new Date().getUTCDate() - 7)).setUTCHours(0, 0, 0, 1),
    to: new Date().setUTCHours(23, 59, 59, 999),
  },
  MONTH: {
    name: 'MONTH',
    from: new Date(new Date().setUTCDate(new Date().getUTCDate() - 30)).setUTCHours(0, 0, 0, 1),
    to: new Date().setUTCHours(23, 59, 59, 999),
  },
};

class TotalPriceInfoDrawer extends Component {
  state = {
    loader: false,
    chosenCorporation: '',
    chosenBusiness: undefined,
    businesses: [],
    totalPrice: 0,
    currentTotalPricePeriod: totalPricePeriod.TODAY.name,
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
    });
  };

  handleBusinessChange = async (businessId) => {
    const { currentTotalPricePeriod } = this.state;
    this.setState({ loader: true, chosenBusiness: businessId });

    await this.handleGetTotalPrice({
      businessId,
      from: totalPricePeriod[currentTotalPricePeriod].from,
      to: totalPricePeriod[currentTotalPricePeriod].to,
    });
  };

  handleGetBusinessByCorporationId = async (corporationId, getTotalPrice = false) => {
    let businesses = [];
    const { currentTotalPricePeriod } = this.state;

    try {
      const { data = [] } = await fetchAction({
        url: `business/by-corporation-id?id=${corporationId}`,
        fieldName: 'business',
      })();
      getTotalPrice && this.handleGetTotalPrice({
        corporationId,
        from: totalPricePeriod[currentTotalPricePeriod].from,
        to: totalPricePeriod[currentTotalPricePeriod].to,
      });

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

  handleGetTotalPrice = async ({
    corporationId,
    businessId,
    from = null,
    to = null,
  }) => {
    try {
      const { data: totalPrice = { sum: '' } } = await fetchAction({
        url: 'record/by-params-for-business/payment-info',
        fieldName: 'TotalPrice',
        fieldType: {},
        method: 'POST',
        body: {
          corporationId: !businessId ? corporationId : null,
          businessIds: businessId ? [businessId] : [],
          from,
          to,
        },
      })();
      this.setState({ totalPrice: totalPrice.sum });
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

  handleChangeTotalPricePeriod = period => async () => {
    const { chosenCorporation, chosenBusiness } = this.state;

    this.setState({ currentTotalPricePeriod: period.name, loader: true });

    await this.handleGetTotalPrice({
      corporationId: chosenCorporation,
      businessId: chosenBusiness,
      from: period.from,
      to: period.to,
    });
  };

  render() {
    const {
      loader,
      chosenCorporation,
      chosenBusiness,
      businesses,
      totalPrice,
      currentTotalPricePeriod,
    } = this.state;
    const {
      visible,
      corporations,
      onClose,
      phrases,
      defaultLanguage,
    } = this.props;

    return (
      <Drawer
        visible={visible}
        className={b()}
        width={344}
        mask
        onClose={onClose}
        placement="right"
        title={phrases['header.totalPriceDrawer.proceeds'][defaultLanguage.isoKey]}
      >
        <Select
          onChange={this.handleCorpChange}
          value={chosenCorporation}
          style={{ paddingBottom: '24px', display: 'none' }} // TODO: remove display: none
          className={b('selector')}
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
        <Select
          onChange={this.handleBusinessChange}
          value={chosenBusiness}
          placeholder={phrases['header.totalPriceDrawer.selector.business.placeholder'][defaultLanguage.isoKey]}
          className={b('selector')}
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
        <div className={b('periods')}>
          <div
            className={b('periods-block', { active: currentTotalPricePeriod === totalPricePeriod.TODAY.name })}
            onClick={this.handleChangeTotalPricePeriod(totalPricePeriod.TODAY)}
          >
            {phrases['header.totalPriceDrawer.button.today'][defaultLanguage.isoKey]}
          </div>
          <div
            className={b('periods-block', { active: currentTotalPricePeriod === totalPricePeriod.WEEK.name })}
            onClick={this.handleChangeTotalPricePeriod(totalPricePeriod.WEEK)}
          >
            {phrases['header.totalPriceDrawer.button.week'][defaultLanguage.isoKey]}
          </div>
          <div
            className={b('periods-block', { active: currentTotalPricePeriod === totalPricePeriod.MONTH.name })}
            onClick={this.handleChangeTotalPricePeriod(totalPricePeriod.MONTH)}
          >
            {phrases['header.totalPriceDrawer.button.month'][defaultLanguage.isoKey]}
          </div>
        </div>
        <div className={b('totalPriceBlock')}>
          {
            loader ? (
              <ScreenLoading />
            ) : (
              <>
                <div className={b('totalPriceBlock-sum-text')}>
                  <TotalPrice />
                  <span>
                    {`${phrases['header.totalPriceDrawer.proceeds'][defaultLanguage.isoKey]}:`}
                  </span>
                </div>
                <div className={b('totalPriceBlock-sum-number')}>
                  {totalPrice}
                  {` ${phrases['core.currency.uah'][defaultLanguage.isoKey]}`}
                </div>
              </>
            )
          }
        </div>
        <Link
          to="/orders"
          className={b('seeAllOrdersBtn')}
          onClick={onClose}
        >
          <Button type="primary">
            {phrases['header.totalPriceDrawer.button.seeAllOrders'][defaultLanguage.isoKey]}
          </Button>
        </Link>
      </Drawer>
    );
  }
}

export default TotalPriceInfoDrawer;
