import React, { Component } from 'react';
import bem from 'bem-join';

import BusinessWorkingSpacesInfo from '../BusinessWorkingSpacesInfo';
import BusinessWorkingSpacesList from '../BusinessWorkingSpacesList';
import WorkerInfoDrawer from '../WorkerInfoDrawer';

const b = bem('workingSpaces');

class BusinessWorkingSpaces extends Component {
  state = {
    chosenSpace: null,
    isAddWorkingSpaceMode: this.props.isAddBusinessMode,
    workerInfoDrawerVisible: false,
    workerInfo: null,
  };

  changeActiveWorkingSpace = (space, isAddWorkingSpaceMode) => () => this.setState({
    chosenSpace: space,
    isAddWorkingSpaceMode,
  });

  toggleWorkerInfoDrawer = worker => () => this.setState(prevState => ({
    workerInfoDrawerVisible: !prevState.workerInfoDrawerVisible,
    workerInfo: worker || null,
  }));

  render() {
    const { workingSpaces, changeActiveTab, singleBusiness } = this.props;
    const {
      chosenSpace,
      isAddWorkingSpaceMode,
      workerInfoDrawerVisible,
      workerInfo,
    } = this.state;

    return (
      <div className={b()}>
        {
          isAddWorkingSpaceMode || (chosenSpace && chosenSpace.id) ? (
            <BusinessWorkingSpacesInfo
              chosenSpace={chosenSpace}
              singleBusiness={singleBusiness}
              isAddMode={isAddWorkingSpaceMode}
              changeActiveWorkingSpace={this.changeActiveWorkingSpace}
              toggleWorkerInfoDrawer={this.toggleWorkerInfoDrawer}
            />
          ) : (
            <BusinessWorkingSpacesList
              spaces={workingSpaces.sort((first, second) => first.indexNumber - second.indexNumber)}
              changeActiveWorkingSpace={this.changeActiveWorkingSpace}
              changeActiveTab={changeActiveTab}
              toggleWorkerInfoDrawer={this.toggleWorkerInfoDrawer}
            />
          )
        }
        {
          workerInfoDrawerVisible && workerInfo && (
            <WorkerInfoDrawer
              visible={workerInfoDrawerVisible}
              worker={workerInfo}
              onClose={this.toggleWorkerInfoDrawer()}
            />
          )
        }
      </div>
    );
  }
}

export default BusinessWorkingSpaces;
