import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import bem from 'bem-join';

import {
  Row,
  Col,
  Input,
  Form,
  Select,
  Button,
} from 'antd';

import './index.scss';

const b = bem('corporationForm');

class CorporationForm extends Component {
  state = {
    readOnly: this.props.isEditMod,
  };

  handleUpdateForm = (e) => {
    e.preventDefault();

    const { singleCorporation, form, onSubmit } = this.props;

    form.validateFields((error, values) => {
      if (!error) {
        onSubmit({
          ...singleCorporation,
          ...values,
        });
      }
    });
  };

  getButtonData = () => {
    const { form, isEditMod } = this.props;
    const { readOnly } = this.state;
    const result = {
      cancelText: 'Назад',
      okText: 'Подтвердить',
      cancelMethod: () => {
        form.resetFields();
      },
      okMethod: this.handleUpdateForm,
    };

    if (isEditMod) {
      if (readOnly) {
        result.okText = 'Перейти к редактированию';
        result.okMethod = () => this.setState({ readOnly: false });
      } else {
        result.okText = 'Сохранить';
        result.cancelText = 'Отменить';
      }
    }

    return result;
  };

  render() {
    const { readOnly } = this.state;
    const {
      form,
      singleCorporation,
    } = this.props;
    const {
      okText, cancelText, okMethod, cancelMethod,
    } = this.getButtonData();

    return (
      <Form
        className={b()}
        onSubmit={this.handleUpdateForm}
      >
        <Row>
          <Col lg={24}>
            <Form.Item
              colon={false}
              label="Название компании"
            >
              {form.getFieldDecorator('name', {
                initialValue: singleCorporation ? singleCorporation.name : '',
                rules: [
                  { required: true, message: 'Поле обязательное для заполнения' },
                  { whitespace: true, message: 'Поле не может содержать только пустые пробелы' },
                ],
              })(<Input placeholder="ТОВ “Автомийки карваш”" readOnly={readOnly} />)}
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
                initialValue: singleCorporation ? singleCorporation.country : undefined,
                rules: [
                  { required: true, message: 'Поле обязательное для заполнения' },
                  { whitespace: true, message: 'Поле не может содержать только пустые пробелы' },
                ],
              })(
                !readOnly ? (
                  <Select placeholder="Выбрать страну">
                    <Select.Option value="Украина">Украина</Select.Option>
                    <Select.Option value="Россия">Россия</Select.Option>
                  </Select>
                ) : <Input placeholder="Выбрать страну" readOnly />
              )}
            </Form.Item>
          </Col>
          <Col lg={12}>
            <Form.Item
              colon={false}
              label="Телефонный номер"
            >
              {form.getFieldDecorator('phone', {
                initialValue: singleCorporation ? singleCorporation.phone : '',
                rules: [
                  { required: true, message: 'Поле обязательное для заполнения' },
                  { whitespace: true, message: 'Поле не может содержать только пустые пробелы' },
                  { pattern: new RegExp(/^\+[\d ]{12}$/), message: 'Invalid phone number!' },
                ],
              })(<Input placeholder="+380 99 888 88 88" readOnly={readOnly} />)}
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
                initialValue: singleCorporation ? singleCorporation.city : '',
                rules: [
                  { required: true, message: 'Поле обязательное для заполнения' },
                  { whitespace: true, message: 'Поле не может содержать только пустые пробелы' },
                ],
              })(<Input placeholder="Название города..." readOnly={readOnly} />)}
            </Form.Item>
          </Col>
          <Col lg={12}>
            <Form.Item
              colon={false}
              label="Улица"
            >
              {form.getFieldDecorator('street', {
                initialValue: singleCorporation ? singleCorporation.street : '',
                rules: [
                  { required: true, message: 'Поле обязательное для заполнения' },
                  { whitespace: true, message: 'Поле не может содержать только пустые пробелы' },
                ],
              })(<Input placeholder="Название улицы..." readOnly={readOnly} />)}
            </Form.Item>
          </Col>
          <Col lg={4}>
            <Form.Item
              colon={false}
              label="Номер дома"
            >
              {form.getFieldDecorator('buildingNumber', {
                initialValue: singleCorporation ? singleCorporation.buildingNumber : '',
                rules: [
                  { required: true, message: 'Поле обязательное для заполнения' },
                  { whitespace: true, message: 'Поле не может содержать только пустые пробелы' },
                ],
              })(<Input placeholder="88" readOnly={readOnly} />)}
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
                initialValue: singleCorporation ? singleCorporation.description : '',
                rules: [
                  { whitespace: true, message: 'Поле не может содержать только пустые пробелы' },
                ],
              })(<Input placeholder="Текст..." readOnly={readOnly} />)}
            </Form.Item>
          </Col>
        </Row>
        <Row className={b('buttonGroup')} gutter={32}>
          <Col lg={12}>
            <Button
              className={b('buttonGroup-cancelBtn')}
              onClick={cancelMethod}
            >
              <Link to="/corporations">
                {cancelText}
              </Link>
            </Button>
          </Col>
          <Col lg={12}>
            <Button
              className={b('buttonGroup-okBtn')}
              type="primary"
              onClick={okMethod}
            >
              {okText}
            </Button>
          </Col>
        </Row>
      </Form>
    );
  }
}

export default Form.create({})(CorporationForm);
