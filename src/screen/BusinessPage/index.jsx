import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import compose from 'recompose/compose';
import bem from 'bem-join';
import qs from 'qs';

import { Tabs } from 'antd';

import { BusinessMainInfo } from '../../components/Forms';
import {
  BusinessPackages,
  BusinessSchedule,
  BusinessServices,
} from './children/SingleBusinessPage/tabs';

import { actions } from '../../state';
import { fetchDecorator } from '../../utils';
import {
  fetchGetPriceServices,
  // fetchGetBusinessPackages,
  // fetchGetBusinessOrders,
} from '../../fetches';

import './index.scss';

const b = bem('business');

export const BusinessPageContext = React.createContext();

class BusinessPage extends Component {
  state = {
    currentBusiness: null,
    disabledTab: Boolean(this.props.location.pathname.match('/add')),
  };

  changeActiveTab = (activeTab) => {
    const { history, location } = this.props;

    history.replace({
      location: location.pathname,
      search: qs.stringify({ activeTab }),
    });
  };

  handleAddBusiness = (business) => {
    this.setState({ currentBusiness: business, disabledTab: false });

    this.props.addNewBusiness(business);
  };

  render() {
    const {
      location,
      match,
      businessCategories,
      businessTypes,
      corporations,
      updateBusiness,
      business,
      servicePrices,
    } = this.props;
    const { currentBusiness, disabledTab } = this.state;
    const { activeTab } = qs.parse(location.search, { ignoreQueryPrefix: true });
    const isAddMode = Boolean(location.pathname.match('/add'));
    const [singleBusiness] = business.filter(item => item.id === match.params.id);

    const businessTabs = [
      {
        tabName: 'Основная информация',
        keyName: 'mainInfo',
        ContentComponent: BusinessMainInfo,
        props: {
          businessCategories,
          businessTypes,
          corporations,
          isAddMode,
          singleBusiness,
          updateBusiness,
          addNewBusiness: this.handleAddBusiness,
          validFieldHandler: this.validFieldHandler,
          changeActiveTab: this.changeActiveTab,
          chosenCorp: location.state.chosenCorp,
        },
      },
      {
        tabName: 'Услуги',
        keyName: 'services',
        disabled: disabledTab,
        ContentComponent: BusinessServices,
        props: {
          servicePrices,
          isAddMode,
          singleBusiness: isAddMode ? currentBusiness : singleBusiness,
        },
      },
      {
        tabName: 'Пакет Услуг',
        keyName: 'packages',
        ContentComponent: BusinessPackages,
        props: {
          // packages: packagesList || [],
          // updatePackage,
          // createPackage,
          // deletePackage,
          // servicePrices,
        },
      },
      {
        tabName: 'Рассписание',
        keyName: 'schedule',
        ContentComponent: BusinessSchedule,
        props: {
          // updateSchedule,
        },
      },
    ];

    return (
      <div className={b()}>
        <div className={b('header')}>
          <h1 className={b('header-title')}>
            {isAddMode ? 'Добавить бизнес' : 'Изменить бизнес'}
          </h1>
        </div>
        <Tabs
          className={b('tabsContainer')}
          activeKey={activeTab || 'mainInfo'}
          animated={false}
          onChange={this.changeActiveTab}
        >
          {
            businessTabs.map(({
              tabName,
              keyName,
              disabled = false,
              ContentComponent,
              props,
            }) => (
              <Tabs.TabPane
                tab={tabName}
                key={keyName}
                disabled={disabled}
              >
                <ContentComponent
                  {...props}
                />
              </Tabs.TabPane>
            ))
          }
        </Tabs>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  business: state.business.business,
  corporations: state.corporations.corporations,
  businessCategories: state.business.businessCategories,
  businessTypes: state.business.businessTypes,
  servicePrices: state.business.servicePrices,
});

const mapDispatchToProps = dispatch => ({
  addNewBusiness: newBusiness => dispatch(actions.business.$addNewBusiness(newBusiness)),
  updateBusiness: newBusiness => dispatch(actions.business.$updateBusiness(newBusiness)),
  getPriceService: data => dispatch(actions.business.$getPriceService(data)),
  // getBusinessPackages: data => dispatch(actions.business.$getBusinessPackages(data)),
  // getBusinessOrders: (id, data) => dispatch(actions.business.$getBusinessOrders(id, data)),
});

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
  fetchDecorator({ actions: [fetchGetPriceServices], config: { loader: true } }),
  withRouter
)(BusinessPage);
