import React, { Component } from 'react';
import bem from 'bem-join/dist/index';

import {
  Modal,
  Button,
} from 'antd';

const b = bem('welcomePage');

class WelcomePage extends Component {
  state = {
    visible: true,
    step: 0,
  };

  destroyWelcomeModal = () => {
    const { setShowPropWelcomePage } = this.props;

    this.setState({ visible: false });
    setShowPropWelcomePage(false, true);
  };

  goToNextSlide = () => {
    const { step } = this.state;

    if (step === 2) {
      this.destroyWelcomeModal();
      return;
    }

    this.setState(prevState => ({
      ...prevState,
      step: prevState.step + 1,
    }));
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
    const { visible, step } = this.state;
    const {
      defaultLanguage,
      phrases,
    } = this.props;

    return (
      <Modal
        className={b()}
        visible={visible}
        maskClosable={false}
        footer={null}
        onCancel={this.destroyWelcomeModal}
      >
        <div className={b('stepsContainer')}>
          {this.renderStep()}
          <Button
            type="primary"
            onClick={this.goToNextSlide}
          >
            {
              step === 2
                ? phrases['core.button.start'][defaultLanguage.isoKey]
                : phrases['core.button.goForward'][defaultLanguage.isoKey]
            }
          </Button>
        </div>
      </Modal>
    );
  }
}

export default WelcomePage;
