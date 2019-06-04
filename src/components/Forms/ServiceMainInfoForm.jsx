import React from 'react';

import {
  Form, Select, Input, Button, notification,
} from 'antd';

import { asyncRequest, withToken } from '../../utils';

const ServiceMainInfoForm = (props) => {
  const {
    form,
    serviceTypes,
    servicePrice,
    onCancel,
    modals,
    updateServicePrice,
    addServicePrice,
    addNewMod,
    businessId,
  } = props;
  const formItemLayout = {
    labelCol: {
      lg: { span: 10 },
    },
    wrapperCol: {
      lg: { span: 10 },
    },
  };

  function handleCancel() {
    onCancel(modals.MAIN_INFO, false, null)();
  }

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
        } finally {
          handleCancel();
          form.resetFields();
        }
      }
    });
  }

  return (
    <Form
      onSubmit={handleSaveChange}
      {...formItemLayout}
    >
      <Form.Item
        label="Вид Услуги:"
      >
        {form.getFieldDecorator('serviceId', {
          initialValue: servicePrice ? servicePrice.serviceId : '',
          rules: [
            { required: true, message: 'Поле обязательное для заполнения' },
          ],
        })(
          <Select>
            {serviceTypes.map(svType => (
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
      <Form.Item
        label="Название:"
      >
        {form.getFieldDecorator('name', {
          initialValue: servicePrice ? servicePrice.name : '',
          rules: [
            { required: true, message: 'Поле обязательное для заполнения' },
            { whitespace: true, message: 'Поле не может содержать только пустые пробелы' },
          ],
        })(<Input placeholder="Название" />)}
      </Form.Item>
      <Form.Item
        label="Описание:"
      >
        {form.getFieldDecorator('description', {
          initialValue: servicePrice ? servicePrice.description : '',
          rules: [
            { whitespace: true, message: 'Поле не может содержать только пустые пробелы' },
          ],
        })(<Input placeholder="Описание услуги" />)}
      </Form.Item>
      <Form.Item
        label="Цена, ГРН:"
      >
        {form.getFieldDecorator('price', {
          initialValue: servicePrice ? servicePrice.price : '',
          rules: [
            { required: true, message: 'Поле обязательное для заполнения' },
            { whitespace: true, message: 'Поле не может содержать только пустые пробелы' },
          ],
        })(<Input placeholder="Цена" />)}
      </Form.Item>
      <Form.Item
        label="Продолжительность, минуты:"
      >
        {form.getFieldDecorator('duration', {
          initialValue: servicePrice ? servicePrice.duration : '',
          rules: [
            { required: true, message: 'Поле обязательное для заполнения' },
            { whitespace: true, message: 'Поле не может содержать только пустые пробелы' },
          ],
        })(<Input placeholder="Продолжительность" />)}
      </Form.Item>

      <Button
        htmlType="submit"
        type="primary"
        onClick={handleSaveChange}
      >
        {addNewMod ? 'Создать сервис' : 'Сохранить изменения'}
      </Button>
      <Button onClick={handleCancel}>Отмена</Button>
    </Form>
  );
};

export default Form.create({})(ServiceMainInfoForm);
