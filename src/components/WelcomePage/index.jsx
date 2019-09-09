import React, { Component } from 'react';
import bem from 'bem-join/dist/index';

import {
  Modal,
  Button,
} from 'antd';

const b = bem('welcomePage');

class WelcomePage extends Component {
  state = {
    step: 0,
  };

  renderStep = () => {
    const { step } = this.state;

    switch (step) {
      case 0:
        return <div className={b('step')}>first</div>;
      case 1:
        return <div className={b('step')}>second</div>;
      case 2:
        return <div className={b('step')}>third</div>;
      default:
        return <div className={b('step')}>default</div>;
    }
  };

  render() {
    return (
      <Modal
        className={b()}
        visible
        maskClosable={false}
        footer={null}
      >
        <div className={b('stepsContainer')}>
          {this.renderStep()}
          <Button />
        </div>
      </Modal>
    );
  }
}

export default WelcomePage;
