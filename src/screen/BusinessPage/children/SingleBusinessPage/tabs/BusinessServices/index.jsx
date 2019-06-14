import React, { Component } from 'react';
import bem from 'bem-join';

import { BusinessServiceInfo, BusinessServicesList } from '../../../../../../components';

import './index.scss';

const b = bem('businessServices');

class BusinessServices extends Component {
  state = {
    chosenService: null,
    isAddServiceMode: this.props.isAddBusinessMode,
  };

  changeActiveService = (service, isAddServiceMode) => () => this.setState({ chosenService: service, isAddServiceMode });

  render() {
    const {
      singleBusiness,
      servicePrices,
      changeActiveTab,
      updateBusinessService,
    } = this.props;
    const { chosenService, isAddServiceMode } = this.state;
    const services = servicePrices[singleBusiness.id] || [];

    return (
      <div className={b()}>
        {
          // if add service mode or some of service was chosen from servicesList
          isAddServiceMode || (chosenService && chosenService.id) ? (
            <BusinessServiceInfo
              singleBusiness={singleBusiness}
              isAddMode={isAddServiceMode}
              chosenService={chosenService}
              changeActiveService={this.changeActiveService}
              updateBusinessService={updateBusinessService}
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
