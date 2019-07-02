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
    const { singleBusiness } = this.props;
    const { chosenSpace, isAddWorkingSpaceMode } = this.state;

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
              spaces={singleBusiness.spaces}
              changeActiveWorkingSpace={this.changeActiveWorkingSpace}
            />
          )
        }
      </div>
    );
  }
}

export default BusinessWorkingSpaces;
