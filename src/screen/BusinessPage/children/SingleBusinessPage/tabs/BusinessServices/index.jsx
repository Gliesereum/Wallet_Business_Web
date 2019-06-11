import React, { Component } from 'react';
import bem from 'bem-join';

import { BusinessServiceInfo, BusinessServicesList } from '../../../../../../components';

import './index.scss';

const b = bem('businessServices');

class BusinessServices extends Component {
  state = {
    chosenService: null,
  };

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
      servicePrices,
      isAddMode,
      changeActiveTab,
      updateBusinessService,
    } = this.props;
    const { chosenService } = this.state;
    const services = servicePrices[singleBusiness.id] || [];

    return (
      <div className={b()}>
        {
          isAddMode || chosenService ? (
            <BusinessServiceInfo
              singleBusiness={singleBusiness}
              isAddMode={isAddMode}
              chosenService={chosenService}
              changeActiveService={this.changeActiveService}
              updateBusinessService={updateBusinessService}
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

export default BusinessServices;
