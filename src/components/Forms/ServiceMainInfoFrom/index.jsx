import React, { PureComponent } from 'react';

import {
  Form, Select, Input, InputNumber, Row, Col,
} from 'antd';

import './index.scss';

class ServiceMainInfoForm extends PureComponent {
  render() {
    const { form, serviceTypes, servicePrice } = this.props;

    return (
      <Form>
        <Row gutter={40}>
          <Col lg={12}>
            <Form.Item
              label="Вид услуги"
            >
              {form.getFieldDecorator('serviceId', {
                initialValue: servicePrice ? servicePrice.serviceId : undefined,
                rules: [
                  { required: true, message: 'Поле обязательное для заполнения' },
                ],
              })(
                <Select placeholder="Выбрать">
                  {serviceTypes && serviceTypes.map(svType => (
                    <Select.Option
                      value={svType.id}
                      key={svType.businessCategoryId}
                    >
                      {svType.name}
                    </Select.Option>
                  ))}
                </Select>
              )}
            </Form.Item>
          </Col>
          <Col lg={12}>
            <Form.Item
              label="Название услуги"
            >
              {form.getFieldDecorator('name', {
                initialValue: servicePrice ? servicePrice.name : '',
                rules: [
                  { required: true, message: 'Поле обязательное для заполнения' },
                  { whitespace: true, message: 'Поле не может содержать только пустые пробелы' },
                ],
              })(<Input placeholder="Название" />)}
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={40}>
          <Col lg={12}>
            <Form.Item
              label="Описание услуги"
            >
              {form.getFieldDecorator('description', {
                initialValue: servicePrice ? servicePrice.description : '',
                rules: [
                  { whitespace: true, message: 'Поле не может содержать только пустые пробелы' },
                ],
              })(<Input placeholder="Описание услуги" />)}
            </Form.Item>
          </Col>
          <Col lg={12}>
            <Row gutter={40}>
              <Col lg={12}>
                <Form.Item
                  label="Цена (гривен)"
                >
                  {form.getFieldDecorator('price', {
                    initialValue: servicePrice ? servicePrice.price : '',
                    rules: [
                      { required: true, message: 'Поле обязательное для заполнения' },
                    ],
                  })(
                    <InputNumber
                      step={100}
                      parser={value => value.replace(/\D/g, '')}
                      placeholder="0.00"
                      min={0}
                    />
                  )}
                </Form.Item>
              </Col>
              <Col lg={12}>
                <Form.Item
                  label="Продолжительность (минут)"
                >
                  {form.getFieldDecorator('duration', {
                    initialValue: servicePrice ? servicePrice.duration : '',
                    rules: [
                      { required: true, message: 'Поле обязательное для заполнения' },
                    ],
                  })(
                    <InputNumber
                      step={5}
                      parser={value => value.replace(/\D/g, '')}
                      placeholder="0"
                      min={1}
                    />
                  )}
                </Form.Item>
              </Col>
            </Row>
          </Col>
        </Row>
      </Form>
    );
  }
}

export default Form.create({
  onValuesChange: ({ updateFormData }, changedValues) => updateFormData('mainInfo', changedValues),
})(ServiceMainInfoForm);
