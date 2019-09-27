import React, { Component } from 'react';
import bem from 'bem-join';
import moment from 'moment/moment';

import 'antd/dist/antd.css';
import {
  Select,
  DatePicker,
  Row,
  Col,
} from 'antd';

const b = bem('periodSelector');
const { Option } = Select;
const { RangePicker } = DatePicker;

const getTimePeriod = days => Date.now() - (1000 * 3600 * 24 * days);

class PeriodSelector extends Component {
  state = {
    periodSelect: 'custom',
  };

  handlePeriodChange = async (value) => {
    const { getFromToData } = this.props;

    if (value === 'week') { // get records of client by 7 days
      await getFromToData({ from: getTimePeriod(7), to: Date.now() });
    }
    if (value === 'month') { // get records of client by 30 days
      await getFromToData({ from: getTimePeriod(30), to: Date.now() });
    }
    this.setState({ periodSelect: value });
  };

  onCalendarChange = async (dates) => {
    const from = dates[0].valueOf();
    const to = dates[1].valueOf();
    const { getFromToData } = this.props;

    await getFromToData({ from, to });
  };

  render() {
    const { periodSelect } = this.state;
    const { title, defaultLanguage, phrases } = this.props;

    return (
      <div className={b()}>
        <Row gutter={24}>
          <Col lg={6}>
            <div className={b('title')}>{title}</div>
          </Col>
          <Col lg={periodSelect === 'custom' ? 9 : 18}>
            <Select
              value={periodSelect}
              onChange={this.handlePeriodChange}
              className={b('selector')}
            >
              <Option value="month">{phrases['core.period.days.thirty'][defaultLanguage.isoKey]}</Option>
              <Option value="week">{phrases['core.period.days.seven'][defaultLanguage.isoKey]}</Option>
              <Option value="custom">{phrases['core.period.custom'][defaultLanguage.isoKey]}</Option>
            </Select>
          </Col>
          {
            periodSelect === 'custom' && (
              <Col lg={9}>
                <RangePicker
                  className={b('customPeriodInput')}
                  showTime={{
                    hideDisabledOptions: true,
                    defaultValue: [moment('00:00:00', 'HH:mm:ss'), moment('23:59:59', 'HH:mm:ss')],
                    disabled: true,
                  }}
                  separator="|"
                  format="DD.MM.YYYY"
                  placeholder={['dd.mm.yyyy', 'dd.mm.yyyy']}
                  onChange={this.onCalendarChange}
                />
              </Col>
            )
          }
        </Row>
      </div>
    );
  }
}

export default PeriodSelector;
