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
} from '../../components';

import { actions } from '../../state';
import { fetchDecorator } from '../../utils';
import { fetchAction } from '../../fetches';

const b = bem('businessPage');

class BusinessPage extends Component {
  state = {
    disabledTab: {
      servicesDisable: null,
      packagesDisable: null,
      workingSpaceDisable: null,
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
        workingSpaceDisable: !singleBusiness,
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
      workingSpaces,
      defaultLanguage,
      language,
    } = this.props;

    const { disabledTab } = this.state;
    const { activeTab } = qs.parse(location.search, { ignoreQueryPrefix: true });
    const isAddBusinessMode = location.pathname.match('/add');

    const businessTabs = [
      {
        tabName: language.phrases['core.button.mainInfo'][defaultLanguage.isoKey],
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
        tabName: language.phrases['core.button.schedule'][defaultLanguage.isoKey],
        keyName: 'schedule',
        ContentComponent: BusinessScheduleInfo,
        props: {
          changeActiveTab: this.changeActiveTab,
        },
      },
      {
        tabName: language.phrases['core.button.services'][defaultLanguage.isoKey],
        keyName: 'services',
        disabled: disabledTab.servicesDisable,
        ContentComponent: BusinessServices,
        props: {
          servicePrices,
          changeTabDisable: this.handleChangeTabDisable,
        },
      },
      {
        tabName: language.phrases['core.button.package'][defaultLanguage.isoKey],
        keyName: 'packages',
        disabled: disabledTab.packagesDisable,
        ContentComponent: BusinessPackages,
        props: {
          packages: businessPackages,
          servicePrices,
        },
      },
      {
        tabName: language.phrases['core.button.workingSpaces'][defaultLanguage.isoKey],
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
        <div className={b('header')}>
          <p className={b('header-title')}>
            {isAddBusinessMode
              ? language.phrases['company.page.business.createNewBranch'][defaultLanguage.isoKey]
              : `${language.phrases['core.button.edit'][defaultLanguage.isoKey]} \u00AB${singleBusiness.name}\u00BB`}
          </p>
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
                  defaultLanguage={defaultLanguage}
                  language={language}
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
    defaultLanguage: state.app.defaultLanguage,
    language: state.app.language,
    businessPackages: state.business.businessPackages,
    corporations: state.corporations.corporations,
    servicePrices: state.business.servicePrices,
    workingSpaces: state.business.workingSpaces,
    singleBusiness,
  };
};

const mapDispatchToProps = dispatch => ({
  getPriceService: data => dispatch(actions.business.$getPriceService(data)),
  getBusinessPackages: data => dispatch(actions.business.$getBusinessPackages(data)),
  getWorkingSpaces: data => dispatch(actions.business.$getWorkingSpaces(data)),
});

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
  fetchDecorator({
    actions: [
      fetchAction({
        url: 'business-category/business-type',
        fieldName: 'businessTypes',
      }),
      ({ singleBusiness, getPriceService }) => singleBusiness && fetchAction({
        url: `price/by-business/${singleBusiness.id}`,
        fieldName: 'servicePrices',
        reduxAction: getPriceService,
      })(),
      ({ singleBusiness, getBusinessPackages }) => singleBusiness && fetchAction({
        url: `package/by-business/${singleBusiness.id}`,
        fieldName: 'businessPackages',
        reduxAction: getBusinessPackages,
      })(),
      ({ singleBusiness, getWorkingSpaces }) => singleBusiness && fetchAction({
        url: `working-space/${singleBusiness.id}`,
        fieldName: 'workingSpaces',
        reduxAction: getWorkingSpaces,
      })(),
    ],
    config: { loader: true },
  }),
  withRouter
)(BusinessPage);
