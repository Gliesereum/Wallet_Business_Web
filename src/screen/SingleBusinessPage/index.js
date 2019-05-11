import React, {Component} from 'react';
import {connect} from 'react-redux';
import {withRouter} from 'react-router-dom';

import {Tabs} from 'antd';

import { BusinessMainInfo } from '../../components';
import BusinessServicesList from './BusinessServicesList';
import BusinessPackages from './BusinessPackages';
import BusinessSchedule from './BusinessSchedule';
import BusinessOrders from './BusinessOrders';
import {BusinessPageContext} from '../BusinessPage';
import {actions} from '../../state';

class SingleBusinessPage extends Component {
  static contextType = BusinessPageContext;

  render() {
    const {
      match,
      servicePrices,
      updateBusiness,
    } = this.props;
    const {
      business,
      businessCategories,
      businessTypes,
      corporations,
      dataLoading,
    } = this.context;
    const [singleBusiness] = business.filter(item => item.id === match.params.id);

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

        },
      },
      {
        tabName: 'Рассписание',
        keyName: 'schedule',
        ContentComponent: BusinessSchedule,
        props: {

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
        defaultActiveKey="services"
        animated={false}
      >
        {singleBusinessTabs.map(({tabName, keyName, ContentComponent, props}) => (
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
});

const mapStateToProps = state => ({
  servicePrices: state.business.servicePrices,
});

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(SingleBusinessPage));
