import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import compose from 'recompose/compose';
import bem from 'bem-join';
import qs from 'qs';

import { Tabs } from 'antd';

import {
  BusinessMainInfo,
  BusinessScheduleInfo,
  BusinessPackages,
  BusinessServices,
  BusinessWorkingSpaces,
  ContentHeader,
} from '../../components';

import { actions } from '../../state';
import { fetchDecorator } from '../../utils';
import { fetchAction } from '../../fetches';

const b = bem('businessPage');

class BusinessPage extends Component {
  state = {
    disabledTab: {
      servicesDisable: true,
      packagesDisable: true,
      workingSpaceDisable: true,
    },
  };

  componentDidMount() {
    const {
      location,
      servicePrices,
      chosenBusiness,
      match,
      changeChosenBusiness,
    } = this.props;
    const initialTabDisabled = Boolean(
      location.pathname.match('/add')
      && !chosenBusiness
    );

    if (!chosenBusiness && match.params && match.params.id) {
      changeChosenBusiness(match.params.id);
    }

    this.setState({
      disabledTab: {
        servicesDisable: initialTabDisabled,
        packagesDisable: initialTabDisabled || (chosenBusiness && servicePrices && !servicePrices[chosenBusiness.id]),
        workingSpaceDisable: initialTabDisabled,
      },
    });
  }

  componentWillUnmount() {
    this.props.changeChosenBusiness(null);
  }

  changeActiveTab = (activeTab, id) => {
    const { history, location, changeChosenBusiness } = this.props;

    id && changeChosenBusiness(id);

    history.replace({
      location: location.pathname,
      search: qs.stringify({ activeTab }),
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
      chosenBusiness,
      location,
      businessCategories,
      businessTypes,
      corporations,
      servicePrices,
      businessPackages,
      workingSpaces,
      defaultLanguage,
      phrases,
    } = this.props;

    const { disabledTab } = this.state;
    const { activeTab } = qs.parse(location.search, { ignoreQueryPrefix: true });
    const isAddBusinessMode = location.pathname.match('/add');

    const businessTabs = [
      {
        tabName: phrases['core.button.mainInfo'][defaultLanguage.isoKey],
        keyName: 'mainInfo',
        ContentComponent: BusinessMainInfo,
        props: {
          businessCategories,
          businessTypes,
          corporations,
          changeTabDisable: this.handleChangeTabDisable,
          validFieldHandler: this.validFieldHandler,
          chosenCorpId: location.state ? location.state.chosenCorp.id : undefined,
        },
      },
      {
        tabName: phrases['core.button.schedule'][defaultLanguage.isoKey],
        keyName: 'schedule',
        ContentComponent: BusinessScheduleInfo,
        props: {
          changeActiveTab: this.changeActiveTab,
        },
      },
      {
        tabName: phrases['core.button.services'][defaultLanguage.isoKey],
        keyName: 'services',
        disabled: disabledTab.servicesDisable,
        ContentComponent: BusinessServices,
        props: {
          servicePrices,
          changeTabDisable: this.handleChangeTabDisable,
        },
      },
      {
        tabName: phrases['core.button.package'][defaultLanguage.isoKey],
        keyName: 'packages',
        disabled: disabledTab.packagesDisable,
        ContentComponent: BusinessPackages,
        props: {
          packages: businessPackages,
          servicePrices,
        },
      },
      {
        tabName: phrases['core.button.workingSpaces'][defaultLanguage.isoKey],
        keyName: 'workingSpace',
        disabled: disabledTab.workingSpaceDisable,
        ContentComponent: BusinessWorkingSpaces,
        props: {
          workingSpaces,
        },
      },
    ];

    return (
      <div className={b()}>
        <ContentHeader
          title={
            isAddBusinessMode
              ? phrases['company.page.business.createNewBranch'][defaultLanguage.isoKey]
              : `${phrases['core.button.edit'][defaultLanguage.isoKey]} \u00AB${chosenBusiness && chosenBusiness.name}\u00BB`
          }
          titleCentered
        />
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
                  chosenBusiness={chosenBusiness}
                  isAddBusinessMode={isAddBusinessMode}
                  changeActiveTab={this.changeActiveTab}
                  defaultLanguage={defaultLanguage}
                  phrases={phrases}
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
  defaultLanguage: state.app.defaultLanguage,
  phrases: state.app.phrases,
  businessPackages: state.business.businessPackages,
  corporations: state.corporations.corporations,
  business: state.business.business,
  servicePrices: state.business.servicePrices,
  workingSpaces: state.business.workingSpaces,
  chosenBusiness: state.business.chosenBusiness,
});

const mapDispatchToProps = dispatch => ({
  getPriceService: data => dispatch(actions.business.$getPriceService(data)),
  getBusinessPackages: data => dispatch(actions.business.$getBusinessPackages(data)),
  getWorkingSpaces: data => dispatch(actions.business.$getWorkingSpaces(data)),
  changeChosenBusiness: businessId => dispatch(actions.business.$changeChosenBusiness(businessId)),
});

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
  fetchDecorator({
    actions: [
      fetchAction({
        url: 'business-category/business-type',
        fieldName: 'businessTypes',
      }),
      ({ chosenBusiness, getPriceService, match }) => {
        const { id } = chosenBusiness || ((match && match.params) ? match.params : undefined);
        fetchAction({
          url: `price/by-business/${id}`,
          fieldName: 'servicePrices',
          reduxAction: getPriceService,
        })();
      },
      ({ chosenBusiness, getBusinessPackages, match }) => {
        const { id } = chosenBusiness || ((match && match.params) ? match.params : undefined);
        fetchAction({
          url: `package/by-business/${id}`,
          fieldName: 'businessPackages',
          reduxAction: getBusinessPackages,
        })();
      },
      ({ chosenBusiness, getWorkingSpaces, match }) => {
        const { id } = chosenBusiness || ((match && match.params) ? match.params : undefined);
        fetchAction({
          url: `working-space/${id}`,
          fieldName: 'workingSpaces',
          reduxAction: getWorkingSpaces,
        })();
      },
    ],
    config: { loader: true },
  }),
  withRouter
)(BusinessPage);
