import React, { Component } from 'react';

import { Input, Form, Button } from 'antd';

import './index.scss';

const fieldsList = [
  {
    name: 'name',
    label: 'Название',
    rules: [
      { required: true, message: 'Поле обязательное для заполнения' },
      { whitespace: true, message: 'Поле не может содержать только пустые пробелы' },
    ],
    component: <Input size="large" placeholder="Не заполнено" />,
  },
  {
    name: 'description',
    label: 'Описание',
    rules: [
      { whitespace: true, message: 'Поле не может содержать только пустые пробелы' },
    ],
    component: <Input size="large" placeholder="Не заполнено" />,
  },
  {
    name: 'country',
    label: 'Страна',
    rules: [
      { required: true, message: 'Поле обязательное для заполнения' },
      { whitespace: true, message: 'Поле не может содержать только пустые пробелы' },
    ],
    component: <Input size="large" placeholder="Не заполнено" />,
  },
  {
    name: 'city',
    label: 'Город',
    rules: [
      { required: true, message: 'Поле обязательное для заполнения' },
      { whitespace: true, message: 'Поле не может содержать только пустые пробелы' },
    ],
    component: <Input size="large" placeholder="Не заполнено" />,
  },
  {
    name: 'street',
    label: 'Улица',
    rules: [
      { whitespace: true, message: 'Поле не может содержать только пустые пробелы' },
    ],
    component: <Input size="large" placeholder="Не заполнено" />,
  },
  {
    name: 'buildingNumber',
    label: 'Номер дома',
    rules: [
      { whitespace: true, message: 'Поле не может содержать только пустые пробелы' },
    ],
    component: <Input size="large" placeholder="Не заполнено" />,
  },
];

class Index extends Component {
  handleUpdateForm = (e) => {
    e.preventDefault();

    const { corporation, form, onSubmit } = this.props;

    form.validateFields((error, values) => {
      if (!error) {
        onSubmit({
          ...corporation,
          ...values,
        });
      }
    });
  };

  handleCancelClick = () => {
    const { onCancelClick, form, corporation } = this.props;

    form.resetFields();
    onCancelClick(corporation ? 'editModal' : 'addModal', false);
  };

  render() {
    const {
      form, corporation, cancelText, okText,
    } = this.props;
    const { getFieldDecorator } = form;
    const formItemLayout = {
      labelCol: {
        lg: { span: 10 },
      },
      wrapperCol: {
        lg: { span: 10 },
      },
    };

    return (
      <Form
        onSubmit={this.handleUpdateForm}
        {...formItemLayout}
      >
        {
          fieldsList.map((field) => {
            const {
              name, label, rules, component,
            } = field;
            return (
              <Form.Item
                key={name}
                label={label}
              >
                {getFieldDecorator(name, {
                  initialValue: (corporation && corporation[name]) || '',
                  rules,
                })(component)}
              </Form.Item>
            );
          })
        }
        <div className="karma-app-corporations-form">
          <Button onClick={this.handleCancelClick}>{cancelText}</Button>
          <Button type="primary" onClick={this.handleUpdateForm}>{okText}</Button>
        </div>
      </Form>
    );
  }
}

export default Form.create({})(Index);
