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
      language,
      defaultLanguage,
    } = this.props;

    return (
      <Form className={b()}>
        <div className={b('title', { gotCode })}>
          {
            gotCode && (
              <Timer
                ref={node => this.timerRef = node}
                timerFinishHandler={this.timerFinishHandler}
                time={180000}
              />
            )
          }
        </div>
        <div className={b('infoBlock')}>
          {
            gotCode ? (
              <div>
                <p>{language.phrases['signIn.form.message.sendCode'][defaultLanguage.isoKey]}</p>
                <p>{phone}</p>
              </div>
            ) : (
              <div>
                <p>{language.phrases['signIn.form.welcome'][defaultLanguage.isoKey]}</p>
              </div>
            )
          }
        </div>
        <Form.Item
          colon={false}
          label={gotCode ? language.phrases['signIn.form.inputCode.label'][defaultLanguage.isoKey] : language.phrases['signIn.form.inputPhone.label'][defaultLanguage.isoKey]}
          className={b('number', { labelBox: true })}
          validateStatus={validateStatus}
        >
          {gotCode
            ? form.getFieldDecorator('code', {
              getValueFromEvent: checkInputHandler('code', form),
              rules: [
                { required: true, message: language.phrases['signIn.form.inputCode.label.validation'][defaultLanguage.isoKey] },
                { pattern: new RegExp(/^[\d ]{6}$/), message: language.phrases['signIn.form.inputCode.label.validation'][defaultLanguage.isoKey] },
              ],
            })(
              <Input
                autoFocus
                size="large"
                className={b('number', { codeInput: true })}
                maxLength={6}
              />
            )
            : form.getFieldDecorator('phone', {
              initialValue: '',
              getValueFromEvent: checkInputHandler('phone', form),
              rules: [
                { required: true, message: language.phrases['signIn.form.inputPhone.label.validation'][defaultLanguage.isoKey] },
                { pattern: new RegExp(/^[\d ]{12}$/), message: language.phrases['signIn.form.inputPhone.label.validation'][defaultLanguage.isoKey] },
              ],
              validateTrigger: 'onBlur',
            })(
              <Input
                autoFocus={false}
                size="large"
                placeholder={language.phrases['signIn.form.inputPhone.mask'][defaultLanguage.isoKey]}
                className={b('number', { phoneInput: true })}
              />
            )
          }
        </Form.Item>
        {
          gotCode ? (
            <>
              <Button
                className={b('button', { firstButton: true })}
                onClick={timerIsFinished ? this.getFormCodeHandler(phone) : this.sendFormCodeHandler}
              >
                {
                  timerIsFinished ? language.phrases['signIn.form.inputPhone.timerReturn'][defaultLanguage.isoKey] : language.phrases['signIn.form.inputPhone.confirm'][defaultLanguage.isoKey]
                }
              </Button>
              <Button
                type="primary"
                className={b('button')}
                onClick={gotCodeHandler}
              >
                Отмена
              </Button>
            </>
          ) : (
            <Button
              className={b('button')}
              onClick={this.getFormCodeHandler()}
            >
              {language.phrases['signIn.form.button.getCode'][defaultLanguage.isoKey]}
            </Button>
          )
        }
      </Form>
    );
  }
}

export default Form.create({})(SignInForm);
