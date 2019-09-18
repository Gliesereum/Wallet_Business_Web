import React, { Component } from 'react';
import bem from 'bem-join';
import ReactCodeInput from 'react-verification-code-input';

import {
  Form,
  Button,
  Icon,
} from 'antd';

import Timer from '../../Timer';
import PhoneInput from '../../PhoneInput';

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
                <p>{`${phrases['signIn.form.message.sendCode'][defaultLanguage.isoKey]} +${phone}`}</p>
              </div>
            ) : (
              <div>
                <p className="loginText">{phrases['signIn.form.welcome'][defaultLanguage.isoKey]}</p>
              </div>
            )
          }
        </div>
        <Form.Item
          colon={false}
          label={gotCode
            ? phrases['core.form.inputCode.label'][defaultLanguage.isoKey]
            : phrases['core.form.inputPhone.label'][defaultLanguage.isoKey]
          }
          className={b('number', { labelBox: true })}
          validateStatus={validateStatus}
        >
          {gotCode
            ? form.getFieldDecorator('code', {
              initialValue: '',
            })(
              <ReactCodeInput
                fields={6}
                fieldWidth={32}
                fieldHeight={48}
                autoFocus
                className="codeInput"
              />
            ) : form.getFieldDecorator('phone', {
              initialValue: '',
            })(
              <PhoneInput />
            )
          }
        </Form.Item>
        {
          gotCode ? (
            <div className="buttonGroup">
              <Button
                type="primary"
                disabled={timerIsFinished}
                className={b('button', { firstButton: true })}
                onClick={this.sendFormCodeHandler}
              >
                {phrases['signIn.form.inputPhone.confirm'][defaultLanguage.isoKey]}
              </Button>
              <Button
                type="primary"
                className={b('button backBtn black')}
                onClick={gotCodeHandler}
              >
                <Icon type="left" />
                {phrases['core.button.back'][defaultLanguage.isoKey]}
              </Button>
              <div className={b('button', { sendOneMore: true })}>
                <span>{phrases['signIn.form.didntGetCode'][defaultLanguage.isoKey]}</span>
                <span onClick={this.getFormCodeHandler(phone)}>
                  {phrases['signIn.form.inputPhone.timerReturn'][defaultLanguage.isoKey]}
                </span>
              </div>
            </div>
          ) : (
            <div className="buttonGroup">
              <Button
                type="primary"
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
