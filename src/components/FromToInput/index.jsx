import React, { Component } from 'react';
import bem from 'bem-join';
import moment from 'moment/moment';
import TimeField from 'react-simple-timefield';

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

  handleNumberChange = mode => (value) => {
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
    const {
      readOnly,
      asText,
      screen,
      form,
      dayOfWeek,
    } = this.props;
    const { from, to } = this.state;
    const fromTime = moment.utc(from).format(mask);
    const toTime = moment.utc(to).format(mask);
    const isWork = form.getFieldValue(`${dayOfWeek}-isWork`);

    return (
      <div className={b({ asText, businessSchedule: screen === 'business_schedule' })}>
        {
          asText ? (
            <div className={b('text-block')}>
              <span className={b('text-block-fromTime')}>{fromTime}</span>
              <Divider type="vertical" />
              <span className={b('text-block-toTime')}>{toTime}</span>
            </div>
          ) : (
            <>
              {
                isWork ? (
                  <>
                    <div className={b('input-block')}>
                      <TimeField
                        className={b('fromTime')}
                        value={fromTime}
                        onChange={this.handleNumberChange('from')}
                        input={<Input readOnly={readOnly} />}
                      />
                    </div>
                    <div>
                      <TimeField
                        className={b('toTime')}
                        value={toTime}
                        onChange={this.handleNumberChange('to')}
                        input={<Input readOnly={readOnly} />}
                      />
                    </div>
                  </>
                ) : (
                  <div className={b('weekend-block', { readOnly })}>Weekend</div>
                )
              }
            </>
          )
        }
      </div>
    );
  }
}

export default FromToInput;
