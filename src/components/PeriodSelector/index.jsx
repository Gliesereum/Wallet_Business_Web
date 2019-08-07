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

class PeriodSelector extends Component {
  state = {
    periodSelect: 'custom',
  };

  handlePeriodChange = (value) => {
    if (value !== 'custom') {
      // send request for new request;
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

    return (
      <div className={b()}>
        <Row gutter={24}>
          <Col lg={6}>
            <div className={b('title')}>Список заказов</div>
          </Col>
          <Col lg={periodSelect === 'custom' ? 9 : 18}>
            <Select
              value={periodSelect}
              onChange={this.handlePeriodChange}
              className={b('selector')}
            >
              <Option value="month">За месяц</Option>
              <Option value="week">За неделю</Option>
              <Option value="custom">За период</Option>
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
                  placeholder={['00.00.0000', '00.00.0000']}
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
