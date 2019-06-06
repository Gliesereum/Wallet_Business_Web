import React from 'react';

import {
  Form, Select, Input, InputNumber, notification, Row, Col,
} from 'antd';

import { asyncRequest, withToken } from '../../../utils';

import './index.scss';

const ServiceMainInfoForm = (props) => {
  const {
    form,
    serviceTypes,
    servicePrice,
    updateServicePrice,
    addServicePrice,
    addNewMod,
    businessId,
  } = props;

  function handleSaveChange(e) {
    e.preventDefault();

    form.validateFields(async (error, values) => {
      if (!error) {
        const servicePriceUrl = 'price';
        const body = {
          ...servicePrice,
          businessId,
          ...values,
        };

        try {
          const newServicePrice = await withToken(asyncRequest)({
            url: servicePriceUrl,
            method: addNewMod ? 'POST' : 'PUT',
            moduleUrl: 'karma',
            body,
          });
          await addNewMod ? addServicePrice(newServicePrice) : updateServicePrice(newServicePrice);
        } catch (err) {
          notification.error({
            duration: 5,
            message: err.message || 'Ошибка',
            description: 'Возникла ошибка',
          });
        }
      }
    });
  }

  return (
    <Form onSubmit={handleSaveChange} className="d">
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
                {serviceTypes.length && serviceTypes.map(svType => (
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
};

export default Form.create({})(ServiceMainInfoForm);
