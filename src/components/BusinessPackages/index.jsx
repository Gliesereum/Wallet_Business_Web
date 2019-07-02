import React, { Component } from 'react';
import bem from 'bem-join';

import BusinessPackagesList from '../BusinessPackagesList';
import BusinessPackagesInfo from '../BusinessPackagesInfo';

import './index.scss';

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
      singleBusiness,
      packages,
      servicePrices,
      changeActiveTab,
    } = this.props;
    const { chosenPackage, isAddPackageMode } = this.state;
    const packagesList = packages[singleBusiness.id] || [];
    const servicePricesList = servicePrices[singleBusiness.id] || [];

    return (
      <div className={b()}>
        {
          isAddPackageMode || (chosenPackage && chosenPackage.id) ? (
            <BusinessPackagesInfo
              singleBusiness={singleBusiness}
              isAddMode={isAddPackageMode}
              chosenPackage={chosenPackage}
              changeActivePackage={this.changeActivePackage}
              servicePricesList={servicePricesList}
            />
          ) : (
            <BusinessPackagesList
              packages={packagesList}
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
