import React, { Component } from 'react';
import bem from 'bem-join';

import {
  Input,
  Form,
  Button,
} from 'antd';

import { checkInputHandler } from '../../../utils';
import Timer from '../../Timer';

const b = bem('signInForm');

class SignInForm extends Component {
  state = {
    timerIsFinished: false,
  };

  sendFormCodeHandler = () => {
    const { sendCodeHandler, form } = this.props;

    form.validateFields((error, values) => {
      if (!error) {
        sendCodeHandler(values.code);
      }
    });
  };

  getFormCodeHandler = phoneRepeat => async () => {
    const { getCodeHandler, form } = this.props;

    await form.validateFields(async (error, values) => {
      if (!error) {
        if (phoneRepeat) {
          await getCodeHandler(phoneRepeat);
          this.timerRef.restartTimer();
        } else {
          await getCodeHandler(values.phone);
        }
      }
    });
  };

  timerFinishHandler = value => this.setState({ timerIsFinished: value });

  render() {
    const { timerIsFinished } = this.state;
    const {
      form,
      gotCode,
      phone,
      validateStatus,
      gotCodeHandler,
      phrases,
      defaultLanguage,
    } = this.props;

    return (
      <Form className={b()}>
        <div className={b('infoBlock')}>
          {
            gotCode ? (
              <div>
                <Timer
                  ref={node => this.timerRef = node}
                  timerFinishHandler={this.timerFinishHandler}
                  time={180000}
                />
                <p>{`${phrases['signIn.form.message.sendCode'][defaultLanguage.isoKey]} ${phone}`}</p>
              </div>
            ) : (
              <div>
                <p>{phrases['signIn.form.welcome'][defaultLanguage.isoKey]}</p>
              </div>
            )
          }
        </div>
        <Form.Item
          colon={false}
          className={b('number', { labelBox: true })}
          validateStatus={validateStatus}
        >
          {gotCode
            ? form.getFieldDecorator('code', {
              getValueFromEvent: checkInputHandler('code', form),
              rules: [
                { required: true, message: phrases['signIn.form.inputCode.label.validation'][defaultLanguage.isoKey] },
                { pattern: new RegExp(/^[\d ]{6}$/), message: phrases['signIn.form.inputCode.label.validation'][defaultLanguage.isoKey] },
              ],
            })(
              <Input
                autoFocus={false}
                size="large"
                className={b('number', { codeInput: true })}
                maxLength={6}
                placeholder={phrases['signIn.form.inputCode.label'][defaultLanguage.isoKey]}
              />
            )
            : form.getFieldDecorator('phone', {
              initialValue: '',
              getValueFromEvent: checkInputHandler('phone', form),
              rules: [
                { required: true, message: phrases['signIn.form.inputPhone.label.validation'][defaultLanguage.isoKey] },
                { pattern: new RegExp(/^[\d ]{12}$/), message: phrases['signIn.form.inputPhone.label.validation'][defaultLanguage.isoKey] },
              ],
              validateTrigger: 'onBlur',
            })(
              <Input
                autoFocus={false}
                size="large"
                placeholder={phrases['signIn.form.inputPhone.label'][defaultLanguage.isoKey]}
                className={b('number', { phoneInput: true })}
              />
            )
          }
        </Form.Item>
        {
          gotCode ? (
            <div className="buttonGroup">
              <Button
                className={b('button', { firstButton: true })}
                onClick={timerIsFinished ? this.getFormCodeHandler(phone) : this.sendFormCodeHandler}
              >
                {
                  timerIsFinished
                    ? phrases['signIn.form.inputPhone.timerReturn'][defaultLanguage.isoKey]
                    : phrases['signIn.form.inputPhone.confirm'][defaultLanguage.isoKey]
                }
              </Button>
              <Button
                type="primary"
                className={b('button')}
                onClick={gotCodeHandler}
              >
                {phrases['core.button.cancel'][defaultLanguage.isoKey]}
              </Button>
            </div>
          ) : (
            <div className="buttonGroup">
              <Button
                className={b('button')}
                onClick={this.getFormCodeHandler()}
              >
                {phrases['signIn.form.button.getCode'][defaultLanguage.isoKey]}
              </Button>
            </div>
          )
        }
      </Form>
    );
  }
}

export default Form.create({})(SignInForm);
