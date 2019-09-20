import React, { Component } from 'react';
import bem from 'bem-join';

import BusinessPackagesList from '../BusinessPackagesList';
import BusinessPackagesInfo from '../BusinessPackagesInfo';

const b = bem('businessPackages');

class BusinessPackages extends Component {
  state = {
    chosenPackage: null,
    isAddPackageMode: this.props.isAddBusinessMode,
  };

  changeActivePackage = (packageItem, isAddPackageMode) => () => this.setState({
    chosenPackage: packageItem,
    isAddPackageMode,
  });

  render() {
    const {
      chosenBusiness,
      packages,
      servicePrices,
      changeActiveTab,
    } = this.props;
    const { chosenPackage, isAddPackageMode } = this.state;
    const packagesList = chosenBusiness ? packages[chosenBusiness.id] : [];
    const servicePricesList = chosenBusiness ? servicePrices[chosenBusiness.id] : [];

    return (
      <div className={b()}>
        {
          isAddPackageMode || (chosenPackage && chosenPackage.id) ? (
            <BusinessPackagesInfo
              chosenBusiness={chosenBusiness}
              isAddMode={isAddPackageMode}
              chosenPackage={chosenPackage}
              changeActivePackage={this.changeActivePackage}
              servicePricesList={servicePricesList}
            />
          ) : (
            <BusinessPackagesList
              packages={packagesList || []}
              changeActiveTab={changeActiveTab}
              changeActivePackage={this.changeActivePackage}
            />
          )
        }
      </div>
    );
  }
}

export default BusinessPackages;
