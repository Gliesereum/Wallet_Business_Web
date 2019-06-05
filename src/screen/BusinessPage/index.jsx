import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import compose from 'recompose/compose';
import bem from 'bem-join';
import qs from 'qs';

import {
  Tabs,
} from 'antd';

import { BusinessMainInfo } from '../../components/Forms';
import {
  BusinessPackages,
  BusinessSchedule,
  // BusinessServicesList,
} from './children/SingleBusinessPage/tabs';

import { actions } from '../../state';
// import { fetchDecorator } from '../../utils';
// import { fetchGetPriceServices, fetchGetBusinessPackages, fetchGetBusinessOrders } from '../../fetches';

import './index.scss';

const b = bem('business');

export const BusinessPageContext = React.createContext();

class BusinessPage extends Component {
  changeActiveTab = (activeTab) => {
    const { history, location } = this.props;

    history.replace({
      location: location.pathname,
      search: qs.stringify({ activeTab }),
    });
  };

  render() {
    const {
      location,
      match,
      businessCategories,
      businessTypes,
      corporations,
      addNewBusiness,
      updateBusiness,
      business,
    } = this.props;
    const { activeTab } = qs.parse(location.search, { ignoreQueryPrefix: true });
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
          addNewBusiness,
          updateBusiness,
          isAddMode: Boolean(location.pathname.match('/add')),
          singleBusiness,
        },
      },
      {
        tabName: 'Услуги',
        keyName: 'services',
        ContentComponent: BusinessMainInfo,
        props: {
          // servicePrices,
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
          <h1 className={b('header-title')}>Добавить бизнес</h1>
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
              ContentComponent,
              props,
            }) => (
              <Tabs.TabPane
                tab={tabName}
                key={keyName}
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
});

const mapDispatchToProps = dispatch => ({
  addNewBusiness: newBusiness => dispatch(actions.business.$addNewBusiness(newBusiness)),
  updateBusiness: newBusiness => dispatch(actions.business.$updateBusiness(newBusiness)),
  // getPriceService: data => dispatch(actions.business.$getPriceService(data)),
  // getBusinessPackages: data => dispatch(actions.business.$getBusinessPackages(data)),
  // getBusinessOrders: (id, data) => dispatch(actions.business.$getBusinessOrders(id, data)),
});
//

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
  withRouter
)(BusinessPage);


// export default compose(
//   connect(mapStateToProps, mapDispatchToProps),
//   withRouter,
//   fetchDecorator({ actions: [fetchGetPriceServices, fetchGetBusinessPackages, fetchGetBusinessOrders], config: { loader: true } }),
// )(BusinessPage);
// <div className="karma-app-business">
//   <div className="karma-app-business-header">
//     {!isAddPage && (
//       <div className="karma-app-business-header-addBtn">
//         <Button
//           type="primary"
//           onClick={this.toggleAddModalVisible}
//         >
//           <Icon type="plus" />
//           <span className="karma-app-business-header-addBtn-text">Добавить бизнесс</span>
//         </Button>
//       </div>
//     )}
//   </div>
//   <div className="karma-app-business-contentBox">
//     <BusinessPageContext.Provider
//       value={{
//         business,
//         corporations,
//         businessTypes,
//         businessCategories,
//         dataLoading,
//       }}
//     >
//       {children}
//     </BusinessPageContext.Provider>
//   </div>
//   {addModalVisible && (
//     <Modal
//       visible={addModalVisible}
//       footer={null}
//       closable={false}
//     >
//       <BusinessMainInfo
//         corporations={corporations}
//         businessCategories={businessCategories}
//         businessTypes={businessTypes}
//         addNewBusiness={this.addNewBusiness}
//         dataLoading={dataLoading}
//       />
//     </Modal>
// {/*  )} */}
// {/*</div>*/}
