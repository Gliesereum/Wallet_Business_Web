import React, {Component} from 'react';
import {connect} from 'react-redux';
import {withRouter} from 'react-router-dom';

import {Tabs} from 'antd';

import {BusinessMainInfo, BusinessServicesList, BusinessPackages, BusinessSchedule, BusinessOrders} from './tabs';
import {actions} from '../../state';

import './styles.scss'

const singleBusinessTabs = [
  {
    tabName: 'Основная информация',
    keyName: 'mainInfo',
    ContentComponent: BusinessMainInfo,
  },
  {
    tabName: 'Услуги',
    keyName: 'services',
    ContentComponent: BusinessServicesList,
  },
  {
    tabName: 'Пакет Услуг',
    keyName: 'packages',
    ContentComponent: BusinessPackages,
  },
  {
    tabName: 'Рассписание',
    keyName: 'schedule',
    ContentComponent: BusinessSchedule,
  },
  {
    tabName: 'Заказы',
    keyName: 'orders',
    ContentComponent: BusinessOrders,
  },
];

class SingleBusinessPage extends Component {

  componentDidMount() {
    const {business, getPriceService, getBusinessPackages} = this.props;

    Promise.all([business.map(business => getPriceService(business.id))]);
    Promise.all([business.map(business => getBusinessPackages(business.id))]);
  }

  render() {
    const {
      match,
      business,
      businessCategories,
      businessTypes,
      corporations,
      servicePrices,
      dataLoading,
      updateBusiness,
      packages,
      updatePackage,
      createPackage,
      deletePackage,
      updateSchedule
    } = this.props;
    const [singleBusiness] = business.filter(item => item.id === match.params.id);
    const packagesList = packages[singleBusiness.id];
    return (
      <Tabs defaultActiveKey="schedule" animated={false}>
        {singleBusinessTabs.map(({tabName, keyName, ContentComponent}) => (
          <Tabs.TabPane tab={tabName} key={keyName}>
            <ContentComponent
              singleBusiness={singleBusiness}
              businessCategories={businessCategories}
              businessTypes={businessTypes}
              corporations={corporations}
              servicePrices={servicePrices}
              dataLoading={dataLoading}
              updateBusiness={updateBusiness}
              packages={packagesList || []}
              updatePackage={updatePackage}
              createPackage={createPackage}
              deletePackage={deletePackage}
              updateSchedule={updateSchedule}
            />
          </Tabs.TabPane>
        ))}
      </Tabs>
    );
  }
}

const mapDispatchToProps = dispatch => ({
  dataLoading: bool => dispatch(actions.app.$dataLoading(bool)),
  updateBusiness: newBusiness => dispatch(actions.business.$updateBusiness(newBusiness)),
  getPriceService: corpId => dispatch(actions.business.$getPriceService(corpId)),
  getBusinessPackages: businessId => dispatch(actions.business.$getBusinessPackages(businessId)),
  updatePackage: businessPackage => dispatch(actions.business.$updateBusinessPackage(businessPackage)),
  createPackage: businessPackage => dispatch(actions.business.$createBusinessPackage(businessPackage)),
  deletePackage: ({businessId, packageId}) => dispatch(actions.business.$deleteBusinessPackage({businessId, packageId})),
  updateSchedule: scheduleList => dispatch(actions.business.$updateSchedule(scheduleList))
});

const mapStateToProps = state => ({
  business: state.business.business,
  businessCategories: state.business.businessCategories,
  businessTypes: state.business.businessTypes,
  servicePrices: state.business.servicePrices,
  corporations: state.corporations.corporations,
  packages: state.business.businessPackages
});

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(SingleBusinessPage));
