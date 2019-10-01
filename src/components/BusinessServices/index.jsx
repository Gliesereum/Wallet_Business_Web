import React, { Component } from 'react';
import bem from 'bem-join';

import BusinessServiceInfo from '../BusinessServiceInfo';
import BusinessServicesList from '../BusinessServicesList';

const b = bem('businessServices');

class BusinessServices extends Component {
  state = {
    chosenService: null,
    isAddServiceMode: this.props.isAddBusinessMode,
  };

  changeActiveService = (service, isAddServiceMode) => () => this.setState({ chosenService: service, isAddServiceMode });

  render() {
    const {
      chosenBusiness,
      servicePrices,
      defaultLanguage,
      phrases,
      changeActiveTab,
      changeTabDisable,
      updateBusinessService,
    } = this.props;
    const { chosenService, isAddServiceMode } = this.state;
    const services = chosenBusiness ? servicePrices[chosenBusiness.id] : [];

    return (
      <div className={b()}>
        {
          // if add service mode or some of service was chosen from servicesList
          isAddServiceMode || (chosenService && chosenService.id) ? (
            <BusinessServiceInfo
              defaultLanguage={defaultLanguage}
              phrases={phrases}
              chosenBusiness={chosenBusiness}
              isAddMode={isAddServiceMode}
              chosenService={chosenService}
              changeTabDisable={changeTabDisable}
              changeActiveService={this.changeActiveService}
              updateBusinessService={updateBusinessService}
            />
          ) : (
            <BusinessServicesList
              defaultLanguage={defaultLanguage}
              phrases={phrases}
              services={services || []}
              changeTabDisable={changeTabDisable}
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
