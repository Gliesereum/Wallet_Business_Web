import React, { Component } from 'react';
import { SketchPicker } from 'react-color';
import bem from 'bem-join';

import {
  Button,
  Input,
  // Select,
} from 'antd';

import widgetDefaultConfig from './widgetDefaultConfig';

const b = bem('widgetSettings');
// const { Option } = Select;

class WidgetSettings extends Component {
  state = {
    buttonText: widgetDefaultConfig.phrases['button.start.label'],
    labelColor: widgetDefaultConfig.theme.coupler.startButton.label,
    displayLabelColorPicker: false,
  };

  handlePickerTrigger = key => () => {
    this.setState(prevState => ({
      ...prevState,
      [`display${key}ColorPicker`]: !prevState[`display${key}ColorPicker`],
    }));
  };

  handleColorChange = (color) => {
    this.setState({ labelColor: color.hex });
  };

  render() {
    const {
      defaultLanguage,
      phrases,
    } = this.props;
    const {
      buttonText,
      labelColor,
      displayLabelColorPicker,
    } = this.state;

    return (
      <div className={b()}>
        <div className={b('settingsBox')}>
          <div className={b('settingsBox-controls')}>
            <label
              className="label"
              htmlFor="buttonText"
            >
              Текст на кнопці
            </label>
            <Input
              id="buttonText"
              value={buttonText}
              placeholder="Ввод"
            />
            <div
              className={b('settingsBox-controls-colorBox')}
              onClick={this.handlePickerTrigger('Label')}
            >
              <div style={{ backgroundColor: labelColor }} />
            </div>
            {
              displayLabelColorPicker && (
                <SketchPicker
                  disableAlpha
                  color={labelColor}
                  onChange={this.handleColorChange}
                />
              )
            }
          </div>
          <div className={b('settingsBox-previewer')}>
            2
          </div>
        </div>
        <div className={b('settingsBox')}>
          <div className={b('settingsBox-controls')}>2</div>
          <div className={b('settingsBox-previewer')}>2</div>
        </div>
        <div className={b('codeBox')}>3</div>
        <Button
          type="primary"
        >
          {phrases['core.button.back'][defaultLanguage.isoKey]}
        </Button>
      </div>
    );
  }
}

export default WidgetSettings;
