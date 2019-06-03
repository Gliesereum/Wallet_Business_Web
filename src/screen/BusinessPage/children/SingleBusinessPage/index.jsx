import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import compose from 'recompose/compose';

import { Tabs } from 'antd/lib/index';
import qs from 'qs';

import {
  BusinessMainInfo, BusinessServicesList, BusinessPackages, BusinessSchedule, BusinessOrders,
} from './tabs';
import { BusinessPageContext } from '../../index';
import { actions } from '../../../../state';

import './styles.scss';

class SingleBusinessPage extends Component {
  static contextType = BusinessPageContext;

  changeActiveTab = (activeTab) => {
    const { history, location } = this.props;

    history.replace({
      location: location.pathname,
      search: qs.stringify({ activeTab }),
    });
  };

  render() {
    const {
      match,
      location,
      servicePrices,
      updateBusiness,
      packages,
      updatePackage,
      createPackage,
      deletePackage,
      updateSchedule,
    } = this.props;
    const {
      business,
      businessCategories,
      businessTypes,
      corporations,
      dataLoading,
    } = this.context;

    const { activeTab } = qs.parse(location.search, { ignoreQueryPrefix: true });
    const [singleBusiness] = business.filter(item => item.id === match.params.id);
    const packagesList = singleBusiness ? packages[singleBusiness.id] : [];
    const singleBusinessTabs = [
      {
        tabName: 'Основная информация',
        keyName: 'mainInfo',
        ContentComponent: BusinessMainInfo,
        props: {
          businessCategories,
          businessTypes,
          updateBusiness,
        },
      },
      {
        tabName: 'Услуги',
        keyName: 'services',
        ContentComponent: BusinessServicesList,
        props: {
          servicePrices,
        },
      },
      {
        tabName: 'Пакет Услуг',
        keyName: 'packages',
        ContentComponent: BusinessPackages,
        props: {
          packages: packagesList || [],
          updatePackage,
          createPackage,
          deletePackage,
          servicePrices,
        },
      },
      {
        tabName: 'Рассписание',
        keyName: 'schedule',
        ContentComponent: BusinessSchedule,
        props: {
          updateSchedule,
        },
      },
      {
        tabName: 'Заказы',
        keyName: 'orders',
        ContentComponent: BusinessOrders,
        props: {

        },
      },
    ];

    return (
      <Tabs
        activeKey={activeTab || 'mainInfo'}
        animated={false}
        onChange={this.changeActiveTab}
      >
        {singleBusinessTabs.map(({
          tabName,
          keyName,
          ContentComponent,
          props,
        }) => (
          <Tabs.TabPane
            tab={tabName}
            key={keyName}
          >
            <ContentComponent
              singleBusiness={singleBusiness}
              corporations={corporations}
              dataLoading={dataLoading}
              {...props}
            />
          </Tabs.TabPane>
        ))}
      </Tabs>
    );
  }
}

const mapDispatchToProps = dispatch => ({
  updateBusiness: newBusiness => dispatch(actions.business.$updateBusiness(newBusiness)),
  updatePackage: businessPackage => dispatch(actions.business.$updateBusinessPackage(businessPackage)),
  createPackage: businessPackage => dispatch(actions.business.$createBusinessPackage(businessPackage)),
  deletePackage: ({ businessId, packageId }) => dispatch(actions.business.$deleteBusinessPackage({ businessId, packageId })),
  updateSchedule: scheduleList => dispatch(actions.business.$updateSchedule(scheduleList)),
});

const mapStateToProps = state => ({
  servicePrices: state.business.servicePrices,
  packages: state.business.businessPackages,
});

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
  withRouter,
)(SingleBusinessPage);