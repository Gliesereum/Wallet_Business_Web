import React, { Component } from 'react';
import bem from 'bem-join';
// import { connect } from 'react-redux';
import compose from 'recompose/compose';

import { BusinessServiceInfo, BusinessServicesList } from '../../../../../../components';

import {
  // asyncRequest,
  // withToken,
  fetchDecorator,
} from '../../../../../../utils';
import { fetchGetServiceTypes, fetchGetFilters } from '../../../../../../fetches';
// import { actions } from '../../../../../state';
import './index.scss';

const b = bem('businessServices');

class BusinessServices extends Component {
  state = {
    chosenService: null,
  //   classes: [],
  };

  // initLoad = async () => {
  // const { singleBusiness } = this.props;

  // const serviceTypesUrl = `service/by-business-category?businessCategoryId=${singleBusiness.businessCategoryId}`;
  //   const filtersUrl = `filter/by-business-category?businessCategoryId=${singleBusiness.businessCategoryId}`;
  //   const classesUrl = 'class';

  // try {
  //   const [serviseTypesList] = await Promise
  //     .all([
  //       withToken(asyncRequest)({ url: serviceTypesUrl, moduleUrl: 'karma' }),
  //       withToken(asyncRequest)({ url: classesUrl, moduleUrl: 'karma' }),
  //       withToken(asyncRequest)({ url: filtersUrl, moduleUrl: 'karma' }),
  // ]);
  //
  //     this.setState(() => ({
  //       serviceTypes: serviseTypesList || [],
  //       filters: filtersList || [],
  //       classes: classesList || [],
  //     }));
  //   } catch (err) {
  //     notification.error({
  //       duration: 5,
  //       message: err.message || 'Ошибка',
  //       description: 'Возникла ошибка',
  //     });
  //   }
  // };

  // handleRemoveService = item => async () => {
  //   const { removeServicePrice, singleBusiness } = this.props;
  //   const removeServicePriceUrl = `price/${item.id}`;
  //
  //   try {
  //     await withToken(asyncRequest)`({ url: removeServicePriceUrl, method: 'DELETE', moduleUrl: 'karma' });
  //     await removeServicePrice({ servicePriceId: item.id, businessId: singleBusiness.id });
  //   } catch (err) {
  //     notification.error({
  //       duration: 5,
  //       message: err.message || 'Ошибка',
  //       description: 'Возникла ошибка',
  //     });
  //   }
  // };

  changeActiveService = service => () => this.setState({ chosenService: service });

  render() {
    const {
      singleBusiness,
      serviceTypes,
      filters,
      servicePrices,
      isAddMode,
      changeActiveTab,
    } = this.props;
    const { chosenService } = this.state;
    const services = servicePrices[singleBusiness.id];

    return (
      <div className={b()}>
        {
          isAddMode || chosenService ? (
            <BusinessServiceInfo
              serviceTypes={serviceTypes}
              filters={filters}
              chosenService={chosenService}
              changeActiveService={this.changeActiveService}
              changeActiveTab={changeActiveTab}
            />
          ) : (
            <BusinessServicesList
              services={services}
              changeActiveService={this.changeActiveService}
              changeActiveTab={changeActiveTab}
            />
          )
        }
      </div>
    );
  }
}

// const mapDispatchToProps = dispatch => ({
//   removeServicePrice: servicePrice => dispatch(actions.business.$removeServicePrice(servicePrice)),
//   updateServicePrice: servicePrice => dispatch(actions.business.$updateServicePrice(servicePrice)),
//   addServicePrice: servicePrice => dispatch(actions.business.$addServicePrice(servicePrice)),
// });

export default compose(
  fetchDecorator({ actions: [fetchGetServiceTypes, fetchGetFilters], config: { loader: true } }),
)(BusinessServices);
