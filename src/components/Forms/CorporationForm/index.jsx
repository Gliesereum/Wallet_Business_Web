import React, { PureComponent } from 'react';
import bem from 'bem-join';

import {
  Row,
  Col,
  Input,
  Form,
  Select,
} from 'antd';

const b = bem('corporationForm');

class CorporationForm extends PureComponent {
  render() {
    const {
      form,
      chosenCorporation,
      readOnlyMode,
    } = this.props;

    return (
      <Form className={b()}>
        <Row>
          <Col lg={24}>
            <Form.Item
              colon={false}
              label="Название компании"
            >
              {form.getFieldDecorator('name', {
                initialValue: chosenCorporation ? chosenCorporation.name : '',
                rules: [
                  { required: true, message: 'Поле обязательное для заполнения' },
                  { whitespace: true, message: 'Поле не может содержать только пустые пробелы' },
                ],
              })(<Input placeholder="ТОВ “Автомийки карваш”" readOnly={readOnlyMode} />)}
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={32}>
          <Col lg={12}>
            <Form.Item
              colon={false}
              label="Страна"
            >
              {form.getFieldDecorator('country', {
                initialValue: chosenCorporation ? chosenCorporation.country : undefined,
                rules: [
                  { required: true, message: 'Поле обязательное для заполнения' },
                  { whitespace: true, message: 'Поле не может содержать только пустые пробелы' },
                ],
              })(
                !readOnlyMode ? (
                  <Select placeholder="Выбрать страну">
                    <Select.Option value="Украина">Украина</Select.Option>
                    <Select.Option value="Россия">Россия</Select.Option>
                  </Select>
                ) : <Input placeholder="Выбрать страну" readOnly={readOnlyMode} />
              )}
            </Form.Item>
          </Col>
          <Col lg={12}>
            <Form.Item
              colon={false}
              label="Телефонный номер"
            >
              {form.getFieldDecorator('phone', {
                initialValue: chosenCorporation ? chosenCorporation.phone : '',
                rules: [
                  { required: true, message: 'Поле обязательное для заполнения' },
                  { whitespace: true, message: 'Поле не может содержать только пустые пробелы' },
                  { pattern: new RegExp(/^\+[\d ]{12}$/), message: 'Не верный номер телефона' },
                ],
              })(<Input placeholder="+380 99 888 88 88" readOnly={readOnlyMode} />)}
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={32}>
          <Col lg={8}>
            <Form.Item
              colon={false}
              label="Город"
            >
              {form.getFieldDecorator('city', {
                initialValue: chosenCorporation ? chosenCorporation.city : '',
                rules: [
                  { required: true, message: 'Поле обязательное для заполнения' },
                  { whitespace: true, message: 'Поле не может содержать только пустые пробелы' },
                ],
              })(<Input placeholder="Название города..." readOnly={readOnlyMode} />)}
            </Form.Item>
          </Col>
          <Col lg={12}>
            <Form.Item
              colon={false}
              label="Улица"
            >
              {form.getFieldDecorator('street', {
                initialValue: chosenCorporation ? chosenCorporation.street : '',
                rules: [
                  { required: true, message: 'Поле обязательное для заполнения' },
                  { whitespace: true, message: 'Поле не может содержать только пустые пробелы' },
                ],
              })(<Input placeholder="Название улицы..." readOnly={readOnlyMode} />)}
            </Form.Item>
          </Col>
          <Col lg={4}>
            <Form.Item
              colon={false}
              label="Номер дома"
            >
              {form.getFieldDecorator('buildingNumber', {
                initialValue: chosenCorporation ? chosenCorporation.buildingNumber : '',
                rules: [
                  { required: true, message: 'Поле обязательное для заполнения' },
                  { whitespace: true, message: 'Поле не может содержать только пустые пробелы' },
                ],
              })(<Input placeholder="88" readOnly={readOnlyMode} />)}
            </Form.Item>
          </Col>
        </Row>
        <Row>
          <Col lg={24}>
            <Form.Item
              colon={false}
              label="Описание"
            >
              {form.getFieldDecorator('description', {
                initialValue: chosenCorporation ? chosenCorporation.description : '',
                rules: [
                  { whitespace: true, message: 'Поле не может содержать только пустые пробелы' },
                ],
              })(<Input placeholder="Текст..." readOnly={readOnlyMode} />)}
            </Form.Item>
          </Col>
        </Row>
      </Form>
    );
  }
}

export default Form.create({})(CorporationForm);
