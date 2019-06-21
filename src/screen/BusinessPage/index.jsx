import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import compose from 'recompose/compose';
import bem from 'bem-join';
import qs from 'qs';

import { Tabs } from 'antd';

import { BusinessMainInfo } from '../../components/Forms';
import { BusinessScheduleInfo } from '../../components';
import {
  BusinessPackages,
  BusinessServices,
} from './children/SingleBusinessPage/tabs';

import { actions } from '../../state';
import { fetchDecorator } from '../../utils';
import {
  fetchGetPriceServices,
  fetchGetBusinessPackages,
} from '../../fetches';

import './index.scss';

const b = bem('business');

export const BusinessPageContext = React.createContext();

class BusinessPage extends Component {
  state = {
    disabledTab: {
      servicesDisable: null,
      packagesDisable: null,
    },
  };

  componentDidMount() {
    const { location, servicePrices, singleBusiness } = this.props;
    const initialTabDisabled = Boolean(
      location.pathname.match('/add')
      && !(
        location.search
      && qs.parse(location.search, { ignoreQueryPrefix: true })
        .newBusiness)
    );

    this.setState({
      disabledTab: {
        servicesDisable: initialTabDisabled,
        packagesDisable: !singleBusiness || (singleBusiness && servicePrices && !servicePrices[singleBusiness.id]),
      },
    });
  }

  changeActiveTab = (activeTab, id) => {
    const { history, location } = this.props;
    const { newBusiness } = qs.parse(this.props.location.search, { ignoreQueryPrefix: true });

    history.replace({
      location: location.pathname,
      search: qs.stringify({ activeTab, newBusiness: newBusiness || id }),
    });
  };

  handleChangeTabDisable = (tabName, disable = false) => this.setState(prevState => ({
    disabledTab: {
      ...prevState.disabledTab,
      [`${tabName}Disable`]: disable,
    },
  }));

  render() {
    const {
      singleBusiness,
      location,
      businessCategories,
      businessTypes,
      corporations,
      servicePrices,
      businessPackages,
      addNewBusiness,
      updateBusiness,
      removeBusiness,
    } = this.props;
    const { disabledTab } = this.state;
    const { activeTab } = qs.parse(location.search, { ignoreQueryPrefix: true });
    const isAddBusinessMode = location.pathname.match('/add');

    const businessTabs = [
      {
        tabName: 'Основная информация',
        keyName: 'mainInfo',
        ContentComponent: BusinessMainInfo,
        props: {
          businessCategories,
          businessTypes,
          corporations,
          updateBusiness,
          addNewBusiness,
          removeBusiness,
          changeTabDisable: this.handleChangeTabDisable,
          validFieldHandler: this.validFieldHandler,
          chosenCorpId: location.state ? location.state.chosenCorp.id : undefined,
        },
      },
      {
        tabName: 'Услуги',
        keyName: 'services',
        disabled: disabledTab.servicesDisable,
        ContentComponent: BusinessServices,
        props: {
          servicePrices,
          changeTabDisable: this.handleChangeTabDisable,
        },
      },
      {
        tabName: 'Пакет Услуг',
        keyName: 'packages',
        disabled: disabledTab.packagesDisable,
        ContentComponent: BusinessPackages,
        props: {
          packages: businessPackages,
          servicePrices,
        },
      },
      {
        tabName: 'Рассписание',
        keyName: 'schedule',
        ContentComponent: BusinessScheduleInfo,
        props: {
          changeActiveTab: this.changeActiveTab,
          packagesDisable: disabledTab.packagesDisable,
        },
      },
    ];

    return (
      <div className={b()}>
        <div className={b('header')}>
          <h1 className={b('header-title')}>
            {isAddBusinessMode ? 'Добавить бизнес' : `Редактировать \u00AB${singleBusiness.name}\u00BB`}
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
                  singleBusiness={singleBusiness}
                  isAddBusinessMode={isAddBusinessMode}
                  changeActiveTab={this.changeActiveTab}
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

const mapStateToProps = (state, { match, location }) => {
  const [singleBusiness] = state.business.business.filter((item) => {
    if (match.params && match.params.id) {
      return item.id === match.params.id;
    }
    const { newBusiness: newBusinessId } = qs.parse(location.search, { ignoreQueryPrefix: true });
    return item.id === newBusinessId;
  });
  return {
    businessPackages: state.business.businessPackages,
    corporations: state.corporations.corporations,
    businessCategories: state.business.businessCategories,
    businessTypes: state.business.businessTypes,
    servicePrices: state.business.servicePrices,
    singleBusiness,
  };
};

const mapDispatchToProps = dispatch => ({
  addNewBusiness: newBusiness => dispatch(actions.business.$addNewBusiness(newBusiness)),
  updateBusiness: newBusiness => dispatch(actions.business.$updateBusiness(newBusiness)),
  removeBusiness: businessId => dispatch(actions.business.$removeBusiness(businessId)),
  getPriceService: data => dispatch(actions.business.$getPriceService(data)),
  getBusinessPackages: data => dispatch(actions.business.$getBusinessPackages(data)),
  // getBusinessOrders: (id, data) => dispatch(actions.business.$getBusinessOrders(id, data)),
});

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
  fetchDecorator({ actions: [fetchGetPriceServices, fetchGetBusinessPackages], config: { loader: true } }),
  withRouter
)(BusinessPage);
