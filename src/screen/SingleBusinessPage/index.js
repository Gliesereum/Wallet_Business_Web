import React, {Component} from 'react';
import {connect} from 'react-redux';
import {withRouter} from 'react-router-dom';

import {Tabs} from 'antd';

import BusinessMainInfo from './BusinessMainInfo';
import BusinessServicesList from './BusinessServicesList';
import BusinessPackages from './BusinessPackages';
import BusinessSchedule from './BusinessSchedule';
import BusinessOrders from './BusinessOrders';
import {actions} from '../../state';

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

  async componentDidMount() {
    const {business, getPriceService} = this.props;

    await Promise.all([business.map(business => getPriceService(business.id))])
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
    } = this.props;
    const [singleBusiness] = business.filter(item => item.id === match.params.id);

    return (
      <Tabs
        defaultActiveKey="mainInfo"
        animated={false}
      >
        {singleBusinessTabs.map(({tabName, keyName, ContentComponent}) => (
          <Tabs.TabPane
            tab={tabName}
            key={keyName}
          >
            <ContentComponent
              singleBusiness={singleBusiness}
              businessCategories={businessCategories}
              businessTypes={businessTypes}
              corporations={corporations}
              servicePrices={servicePrices}
              dataLoading={dataLoading}
              updateBusiness={updateBusiness}
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
});

const mapStateToProps = state => ({
  business: state.business.business,
  businessCategories: state.business.businessCategories,
  businessTypes: state.business.businessTypes,
  servicePrices: state.business.servicePrices,
  corporations: state.corporations.corporations,
});

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(SingleBusinessPage));
