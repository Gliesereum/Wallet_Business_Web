import React, { Component } from 'react';
import bem from 'bem-join';

import {
  Input, Form, Button,
} from 'antd/lib/index';

import './index.scss';

const b = bem('signInForm');

class SignInForm extends Component {
  onSubmit = (e) => {
    e.preventDefault();

    const {
      firstStep,
      getCodeHandler,
      sendCodeHandler,
      form,
    } = this.props;

    form.validateFields((error, values) => {
      if (!error) {
        firstStep
          ? getCodeHandler(values.phoneInput)
          : sendCodeHandler(values.codeInput);
      }
    });
  };

  checkPasswordHandler = (e) => {
    const { value } = e.target;
    const regExp = /^[\d]{0,6}$/;

    if (Number.isNaN(value) || !regExp.test(value)) {
      return this.props.form.getFieldValue('codeInput');
    }

    return value;
  };

  render() {
    const {
      form, labelText, buttonText, placeholder, firstStep,
    } = this.props;

    return (
      <Form
        onSubmit={this.onSubmit}
        className={b()}
      >
        <Form.Item
          colon={false}
          label={labelText}
          className={b('number', { labelBox: true })}
        >
          {firstStep ? (
            <>
              {form.getFieldDecorator('phoneInput', {
                initialValue: '+380',
                rules: [
                  { required: true, message: 'Please enter your phone number!' },
                  { pattern: new RegExp(/^\+[\d ]{12}$/), message: 'Invalid phone number!' },
                ],
                validateTrigger: 'onBlur',
              })(
                <Input
                  autoFocus
                  size="large"
                  placeholder={placeholder}
                  className={b('number', { phoneInput: true })}
                  onChange={this.checkPasswordHandler}
                />
              )}
            </>
          ) : (
            <>
              {form.getFieldDecorator('codeInput', {
                validateTrigger: 'onBlur',
                getValueFromEvent: this.checkPasswordHandler,
              })(
                <Input.Password
                  autoFocus
                  size="large"
                  placeholder={placeholder}
                  className={b('number', { codeInput: true })}
                  maxLength={6}
                />
              )}
            </>
          )}
        </Form.Item>
        <Form.Item
          className={b('number', { buttonBox: true })}
        >
          <Button
            onClick={this.onSubmit}
            size="large"
            className={b('number', { button: true })}
          >
            {buttonText.toUpperCase()}
          </Button>
        </Form.Item>
      </Form>
    );
  }
}

export default Form.create({})(SignInForm);
