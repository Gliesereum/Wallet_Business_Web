import React, { Component } from 'react';
import bem from 'bem-join';

import {
  Checkbox,
  Form,
  Row,
  Col,
} from 'antd';

import FromToInput from '../../FromToInput';

import './index.scss';

const b = bem('businessScheduleForm');

class BusinessScheduleForm extends Component {
  checkHours = (rule, value, callback) => {
    if (value.from <= 0) callback('Время начала работы должно быть больше 0');
    if (value.to <= 0) callback('Время конца работы должно быть больше 0');
    callback();
    return undefined;
  };


  render() {
    const {
      form,
      dayTranslate,
      scheduleList,
    } = this.props;

    return (
      <div className={b()}>
        <Form>
          <Row>
            <Col lg={12}>
              {scheduleList.slice(0, 4).map(({
                dayOfWeek,
                isWork,
                from,
                to,
              }) => (
                <>
                  <Form.Item>
                    {form.getFieldDecorator(`${dayOfWeek}-isWork`, {
                      initialValue: isWork,
                      valuePropName: 'checked',
                    })(
                      <Checkbox value={isWork}>{dayTranslate[dayOfWeek]}</Checkbox>
                    )}
                  </Form.Item>
                  <Form.Item>
                    {form.getFieldDecorator(`${dayOfWeek}-workHours`, {
                      initialValue: { from, to },
                      rules: [{ validator: this.checkHours }],
                    })(
                      <FromToInput />
                    )}
                  </Form.Item>
                </>
              ))}
            </Col>

            <Col lg={12}>
              {scheduleList.slice(4).map(({
                dayOfWeek,
                isWork,
                from,
                to,
              }) => (
                <>
                  <Form.Item>
                    {form.getFieldDecorator(`${dayOfWeek}-isWork`, {
                      initialValue: isWork,
                      valuePropName: 'checked',
                    })(
                      <Checkbox value={isWork}>{dayTranslate[dayOfWeek]}</Checkbox>
                    )}
                  </Form.Item>
                  <Form.Item>
                    {form.getFieldDecorator(`${dayOfWeek}-workHours`, {
                      initialValue: { from, to },
                      rules: [{ validator: this.checkHours }],
                    })(
                      <FromToInput />
                    )}
                  </Form.Item>
                </>
              ))}
            </Col>
          </Row>
        </Form>
      </div>
    );
  }
}

export default Form.create({})(BusinessScheduleForm);
