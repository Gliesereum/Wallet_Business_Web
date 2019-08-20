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
                <p>Код был отправлен на номер</p>
                <p>{phone}</p>
              </div>
            ) : (
              <div>
                <p>Попробуйте</p>
                <p>простую и удобную CRM</p>
              </div>
            )
          }
        </div>
        <Form.Item
          colon={false}
          label={gotCode ? 'Одноразовый пароль из смс' : 'Номер телефона'}
          className={b('number', { labelBox: true })}
          validateStatus={validateStatus}
          hasFeedback
        >
          {gotCode
            ? form.getFieldDecorator('code', {
              getValueFromEvent: checkInputHandler('code', form),
              rules: [
                { required: true, message: 'Please enter your code number!' },
                { pattern: new RegExp(/^[\d ]{6}$/), message: 'Неверный код' },
              ],
            })(
              <Input.Password
                disabled={false}
                autoFocus
                size="large"
                className={b('number', { codeInput: true })}
                maxLength={6}
              />
            )
            : form.getFieldDecorator('phone', {
              initialValue: '+380',
              getValueFromEvent: checkInputHandler('phone', form),
              rules: [
                { required: true, message: 'Пожалуйста, введите ваш номер телефона' },
                { pattern: new RegExp(/^\+[\d ]{12}$/), message: 'Номер введен неверно. Повторите попытку' },
              ],
              validateTrigger: 'onBlur',
            })(
              <Input
                autoFocus={false}
                size="large"
                placeholder="+38093 000 00 03"
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
                  timerIsFinished ? 'Отправить повторно' : 'Подтвердить пароль'
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
              Получить одноразовый пароль
            </Button>
          )
        }
      </Form>
    );
  }
}

export default Form.create({})(SignInForm);
