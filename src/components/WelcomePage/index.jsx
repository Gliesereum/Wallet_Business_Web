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
    const { phrases, defaultLanguage } = this.props;

    switch (step) {
      case 0:
        return (
          <div className={b('step')}>
            <div className={b(`step-image imageStep${step}`)} />
            <div className={b('step-content')}>
              <div className={b('step-content-title')}>
                {phrases['welcomePage.steps.first.title'][defaultLanguage.isoKey]}
              </div>
              <div className={b('step-content-text')}>
                {phrases['welcomePage.steps.first.text'][defaultLanguage.isoKey]}
              </div>
            </div>
          </div>
        );
      case 1:
        return (
          <div className={b('step')}>
            <div className={b(`step-image imageStep${step}`)} />
            <div className={b('step-content')}>
              <div className={b('step-content-title')}>
                {phrases['welcomePage.steps.second.title'][defaultLanguage.isoKey]}
              </div>
              <div className={b('step-content-text')}>
                {phrases['welcomePage.steps.second.text'][defaultLanguage.isoKey]}
              </div>
            </div>
          </div>
        );
      case 2:
        return (
          <div className={b('step')}>
            <div className={b(`step-image imageStep${step}`)} />
            <div className={b('step-content')}>
              <div className={b('step-content-title')}>
                {phrases['welcomePage.steps.third.title'][defaultLanguage.isoKey]}
              </div>
              <div className={b('step-content-text')}>
                {phrases['welcomePage.steps.third.text'][defaultLanguage.isoKey]}
              </div>
            </div>
          </div>
        );
      default:
        return (
          <div className={b('step')}>
            <div className={b('step-image imageStep0')} />
            <div className={b('step-content')}>
              <div className={b('step-content-title')}>
                {phrases['welcomePage.steps.first.title'][defaultLanguage.isoKey]}
              </div>
              <div className={b('step-content-text')}>
                {phrases['welcomePage.steps.first.text'][defaultLanguage.isoKey]}
              </div>
            </div>
          </div>
        );
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
