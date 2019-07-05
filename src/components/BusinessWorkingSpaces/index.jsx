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
    const { workingSpaces, changeActiveTab } = this.props;
    const { chosenSpace, isAddWorkingSpaceMode } = this.state;

    return (
      <div className={b()}>
        {
          isAddWorkingSpaceMode || (chosenSpace && chosenSpace.id) ? (
            <BusinessWorkingSpacesInfo
              chosenSpace={chosenSpace}
              isAddMode={isAddWorkingSpaceMode}
              changeActiveWorkingSpace={this.changeActiveWorkingSpace}
            />
          ) : (
            <BusinessWorkingSpacesList
              spaces={workingSpaces.sort((first, second) => first.indexNumber - second.indexNumber)}
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
