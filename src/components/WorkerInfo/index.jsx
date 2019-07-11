import React, { Component } from 'react';

class WorkerInfo extends Component {
  state = {
    readOnlyMode: !this.props.isAddMode,
  };

  render() {
    const { readOnlyMode } = this.state;

    return (
      <div>
        {
          readOnlyMode ? (
            <div>WorkingInfoReadOnly</div>
          ) : (
            <div>WorkingForm</div>
          )
        }
      </div>
    );
  }
}

export default WorkerInfo;
