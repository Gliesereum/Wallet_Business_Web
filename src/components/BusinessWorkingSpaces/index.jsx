import React, { Component } from 'react';
import bem from 'bem-join';

import BusinessWorkingSpacesInfo from '../BusinessWorkingSpacesInfo';
import BusinessWorkingSpacesList from '../BusinessWorkingSpacesList';

import './index.scss';

const b = bem('workingSpaces');

class BusinessWorkingSpaces extends Component {
  state = {
    chosenSpace: null,
    isAddWorkingSpaceMode: this.props.isAddBusinessMode,
  };

  changeActiveWorkingSpace = (space, isAddWorkingSpaceMode) => () => this.setState({
    chosenSpace: space,
    isAddWorkingSpaceMode,
  });

  render() {
    const { singleBusiness, changeActiveTab } = this.props;
    const { chosenSpace, isAddWorkingSpaceMode } = this.state;
    console.log(singleBusiness.spaces.sort((first, second) => first - second));
    return (
      <div className={b()}>
        {
          isAddWorkingSpaceMode || (chosenSpace && chosenSpace.id) ? (
            <BusinessWorkingSpacesInfo
              singleBusiness={singleBusiness}
              chosenSpace={chosenSpace}
              isAddMode={isAddWorkingSpaceMode}
              changeActiveWorkingSpace={this.changeActiveWorkingSpace}
            />
          ) : (
            <BusinessWorkingSpacesList
              spaces={singleBusiness.spaces.sort((first, second) => first.indexNumber - second.indexNumber)}
              changeActiveWorkingSpace={this.changeActiveWorkingSpace}
              changeActiveTab={changeActiveTab}
            />
          )
        }
      </div>
    );
  }
}

export default BusinessWorkingSpaces;
