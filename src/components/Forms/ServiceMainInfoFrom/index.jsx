import React, { PureComponent } from 'react';

import {
  Form, Select, Input, InputNumber, Row, Col,
} from 'antd';

class ServiceMainInfoForm extends PureComponent {
  render() {
    const {
      form,
      serviceTypes,
      servicePrice,
      defaultLanguage,
      phrases,
    } = this.props;

    return (
      <Form colon={false}>
        <Row
          gutter={32}
          type="flex"
        >
          <Col
            xs={{ span: 24, order: 1 }}
            md={{ span: 8, order: 1 }}
            xl={{ span: 8, order: 1 }}
          >
            <Form.Item label={phrases['servicesPage.info.category'][defaultLanguage.isoKey]}>
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
          <Col
            xs={{ span: 24, order: 2 }}
            md={{ span: 9, order: 2 }}
            xl={{ span: 8, order: 2 }}
          >
            <Form.Item label={phrases['servicesPage.info.name'][defaultLanguage.isoKey]}>
              {form.getFieldDecorator('name', {
                initialValue: servicePrice ? servicePrice.name : '',
                rules: [
                  { required: true, message: 'Поле обязательное для заполнения' },
                  { whitespace: true, message: 'Поле не может содержать только пустые пробелы' },
                ],
              })(<Input placeholder="Название" />)}
            </Form.Item>
          </Col>
          <Col
            xs={{ span: 24, order: 3 }}
            sm={{ span: 12, order: 3 }}
            md={{ span: 7, order: 3 }}
            xl={{ span: 8, order: 3 }}
          >
            <Form.Item label={phrases['servicesPage.info.price'][defaultLanguage.isoKey]}>
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
          <Col
            xs={{ span: 24, order: 5 }}
            md={{ span: 17, order: 4 }}
            xl={{ span: 16, order: 4 }}
          >
            <Form.Item label={phrases['servicesPage.info.description'][defaultLanguage.isoKey]}>
              {form.getFieldDecorator('description', {
                initialValue: servicePrice ? servicePrice.description : '',
                rules: [
                  { whitespace: true, message: 'Поле не может содержать только пустые пробелы' },
                ],
              })(<Input placeholder={phrases['servicesPage.info.description'][defaultLanguage.isoKey]} />)}
            </Form.Item>
          </Col>
          <Col
            xs={{ span: 24, order: 4 }}
            sm={{ span: 12, order: 3 }}
            md={{ span: 7, order: 5 }}
            xl={{ span: 8, order: 5 }}
          >
            <Form.Item label={phrases['servicesPage.info.duration'][defaultLanguage.isoKey]}>
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
                  min={0}
                />
              )}
            </Form.Item>
          </Col>
        </Row>
      </Form>
    );
  }
}

export default Form.create({
  onValuesChange: ({ updateFormData }, changedValues) => updateFormData('mainInfo', changedValues),
})(ServiceMainInfoForm);
