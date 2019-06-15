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
  fetchGetBusinessPackages,
  // fetchGetBusinessOrders,
} from '../../fetches';

import './index.scss';

const b = bem('business');

export const BusinessPageContext = React.createContext();

class BusinessPage extends Component {
  state = {
    disabledTab: {
      isServicesDisabled: null,
      isPackageDisabled: null,
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
        isServicesDisabled: initialTabDisabled,
        isPackageDisabled: !singleBusiness || (singleBusiness && servicePrices && !servicePrices[singleBusiness.id]),
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

  handleAddBusiness = async (business) => {
    await this.props.addNewBusiness(business);

    this.setState(prevState => ({
      disabledTab: {
        ...prevState.disabledTab,
        isServicesDisabled: false,
      },
    }));

    this.changeActiveTab('services', business.id);
  };

  handleUpdateBusiness = async (business) => {
    await this.props.updateBusiness(business);

    this.changeActiveTab('services', business.id);
  };

  handleUpdateBusinessService = () => {
    this.setState(prevState => ({
      disabledTab: {
        ...prevState.disabledTab,
        isPackageDisabled: false,
      },
    }));
  };

  render() {
    const {
      singleBusiness,
      location,
      businessCategories,
      businessTypes,
      corporations,
      servicePrices,
      businessPackages,
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
          isAddBusinessMode,
          singleBusiness,
          updateBusiness: this.handleUpdateBusiness,
          addNewBusiness: this.handleAddBusiness,
          validFieldHandler: this.validFieldHandler,
          chosenCorpId: location.state ? location.state.chosenCorp.id : undefined,
        },
      },
      {
        tabName: 'Услуги',
        keyName: 'services',
        disabled: disabledTab.isServicesDisabled,
        ContentComponent: BusinessServices,
        props: {
          servicePrices,
          isAddBusinessMode,
          changeActiveTab: this.changeActiveTab,
          updateBusinessService: this.handleUpdateBusinessService,
          singleBusiness,
        },
      },
      {
        tabName: 'Пакет Услуг',
        keyName: 'packages',
        disabled: disabledTab.isPackageDisabled,
        ContentComponent: BusinessPackages,
        props: {
          packages: businessPackages,
          servicePrices,
          isAddBusinessMode,
          changeActiveTab: this.changeActiveTab,
          singleBusiness,
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
            {isAddBusinessMode ? 'Добавить бизнес' : 'Изменить бизнес'}
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
  getPriceService: data => dispatch(actions.business.$getPriceService(data)),
  getBusinessPackages: data => dispatch(actions.business.$getBusinessPackages(data)),
  // getBusinessOrders: (id, data) => dispatch(actions.business.$getBusinessOrders(id, data)),
});

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
  fetchDecorator({ actions: [fetchGetPriceServices, fetchGetBusinessPackages], config: { loader: true } }),
  withRouter
)(BusinessPage);
