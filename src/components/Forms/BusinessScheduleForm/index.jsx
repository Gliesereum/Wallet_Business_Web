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

    const formItemLayout = {
      labelCol: { span: 8 },
      wrapperCol: { span: 16 },
    };

    return (
      <div id="scheduleForm" className={b()}>
        <Form
          colon={false}
          layout="horizontal"
        >
          <Row gutter={65}>
            <Col lg={12}>
              {scheduleList.slice(0, 4).map(({
                dayOfWeek,
                isWork,
                from,
                to,
              }) => (
                <div
                  className={b('dayForm')}
                  key={dayOfWeek}
                >
                  <Form.Item
                    className={b('dayForm-formItem', { isWorkItem: true })}
                  >
                    {form.getFieldDecorator(`${dayOfWeek}-isWork`, {
                      initialValue: isWork,
                      valuePropName: 'checked',
                    })(
                      <Checkbox value={isWork}>{dayTranslate[dayOfWeek]}</Checkbox>
                    )}
                  </Form.Item>
                  <Form.Item
                    {...formItemLayout}
                    label="Время"
                    className={b('dayForm-formItem', { timeItem: true })}
                  >
                    {form.getFieldDecorator(`${dayOfWeek}-workHours`, {
                      initialValue: { from, to },
                      rules: [{ validator: this.checkHours }],
                    })(
                      <FromToInput />
                    )}
                  </Form.Item>
                </div>
              ))}
            </Col>

            <Col lg={12}>
              {scheduleList.slice(4).map(({
                dayOfWeek,
                isWork,
                from,
                to,
              }) => (
                <div
                  className={b('dayForm')}
                  key={dayOfWeek}
                >
                  <Form.Item
                    className={b('dayForm-formItem', { isWorkItem: true })}
                  >
                    {form.getFieldDecorator(`${dayOfWeek}-isWork`, {
                      initialValue: isWork,
                      valuePropName: 'checked',
                    })(
                      <Checkbox value={isWork}>{dayTranslate[dayOfWeek]}</Checkbox>
                    )}
                  </Form.Item>
                  <Form.Item
                    {...formItemLayout}
                    label="Время"
                    className={b('dayForm-formItem', { timeItem: true })}
                  >
                    {form.getFieldDecorator(`${dayOfWeek}-workHours`, {
                      initialValue: { from, to },
                      rules: [{ validator: this.checkHours }],
                    })(
                      <FromToInput />
                    )}
                  </Form.Item>
                </div>
              ))}
            </Col>
          </Row>
        </Form>
      </div>
    );
  }
}

export default Form.create({})(BusinessScheduleForm);
