import React, { Component } from 'react';
import bem from 'bem-join';
import moment from 'moment/moment';
import InputMask from 'react-input-mask';

import { Input, Divider } from 'antd';

const b = bem('fromToInput');
const mask = 'HH:mm';

class FromToInput extends Component {
  static getDerivedStateFromProps(nextProps) {
    if ('value' in nextProps) {
      return {
        ...(nextProps.value || {}),
      };
    }
    return null;
  }

  constructor(props) {
    super(props);

    const value = props.value || {};
    this.state = {
      from: value.from || 0,
      to: value.to || 0,
    };
  }

  handleNumberChange = mode => (e) => {
    const { value } = e.target;
    const { onChange } = this.props;
    const number = parseInt(
      moment.duration(value, 'HH:mm').asMilliseconds() || 0,
      10
    );

    if (Number.isNaN(number)) {
      return;
    }

    if (!('value' in this.props)) {
      this.setState({ [mode]: number });
    }

    if (onChange) {
      onChange(Object.assign({}, this.state, { [mode]: number }));
    }
  };

  render() {
    const { readOnly, asText } = this.props;
    const { from, to } = this.state;
    const fromTime = moment.utc(from).format(mask);
    const toTime = moment.utc(to).format(mask);

    return (
      <div className={b({ asText })}>
        {
          asText ? (
            <div className={b('text-block')}>
              <span className={b('text-block-fromTime')}>{fromTime}</span>
              <Divider type="vertical" />
              <span className={b('text-block-toTime')}>{toTime}</span>
            </div>
          ) : (
            <>
              <div className={b('input-block')}>
                <InputMask
                  className={b('fromTime')}
                  disabled={false}
                  readOnly={readOnly}
                  value={fromTime}
                  mask="99\:99"
                  maskChar={null}
                  alwaysShowMask={false}
                  onChange={this.handleNumberChange('from')}
                >
                  {inputProps => <Input {...inputProps} readOnly={readOnly} />}
                </InputMask>
              </div>
              <div>
                <InputMask
                  className={b('toTime')}
                  disabled={false}
                  readOnly={readOnly}
                  value={toTime}
                  mask="99\:99"
                  maskChar={null}
                  alwaysShowMask={false}
                  onChange={this.handleNumberChange('to')}
                >
                  {inputProps => <Input {...inputProps} readOnly={readOnly} />}
                </InputMask>
              </div>
            </>
          )
        }
      </div>
    );
  }
}

export default FromToInput;
