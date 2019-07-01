import React, { PureComponent } from 'react';
import bem from 'bem-join';

import {
  Input,
  Button,
  notification,
} from 'antd';

import {
  asyncRequest,
  withToken,
} from '../../../utils';

import './index.scss';

const b = bem('profileEmail');
const emailPattern = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

class ProfileEmail extends PureComponent {
  state = {
    gotCode: false,
    email: this.props.email,
    code: '',
    errorMessage: '',
  };

  getCode = async () => {
    const { email } = this.state;

    this.setState({ loading: true });
    if (emailPattern.test(email)) {
      const url = `email/code?email=${email}`;

      try {
        await withToken(asyncRequest)({ url });
        this.setState({ gotCode: true });
      } catch (err) {
        notification.error({
          duration: 5,
          message: err.message || 'Ошибка',
          description: 'Возникла ошибка',
        });
      } finally {
        this.setState({ loading: false });
      }
    } else {
      this.setState({ errorMessage: 'Введите валидный E-mail!', loading: false });
    }
  };

  verifyCode = async () => {
    const { email, code } = this.state;
    const { verifyUserEmail, email: emailFromServer } = this.props;

    const url = 'email';
    const body = { code, email };
    const method = emailFromServer ? 'PUT' : 'POST';

    try {
      this.setState({ loading: true });
      const newEmail = await withToken(asyncRequest)({ url, method, body });
      await verifyUserEmail(newEmail);
    } catch (err) {
      notification.error({
        duration: 5,
        message: err.message || 'Ошибка',
        description: 'Возникла ошибка',
      });
    } finally {
      this.setState({ loading: false, gotCode: false, errorMessage: false });
    }
  };

  handleInputChange = inputName => e => this.setState({ [inputName]: e.target.value });

  render() {
    const {
      gotCode,
      email,
      code,
      errorMessage,
      loading,
    } = this.state;

    return (
      <div className={b()}>
        {
          gotCode ? (
            <>
              <div className={b('label')}>
                <label htmlFor="emailInput">Code</label>
              </div>
              <Input
                className={b('inputLine')}
                placeholder="Ввод..."
                id="emailInput"
                value={code}
                onChange={this.handleInputChange('code')}
              />
              <div className={b('errorMessage')}>{errorMessage}</div>
              <Button
                className={b('controlBtn')}
                type="primary"
                onClick={this.verifyCode}
                loading={loading}
              >
                {'подтвердить код'.toUpperCase()}
              </Button>
            </>
          ) : (
            <>
              <div className={b('label')}>
                <label htmlFor="emailInput">E-mail</label>
              </div>
              <Input
                className={b('inputLine')}
                placeholder="Ввод..."
                id="emailInput"
                value={email}
                onChange={this.handleInputChange('email')}
              />
              <div className={b('errorMessage')}>{errorMessage}</div>
              <Button
                className={b('controlBtn')}
                type="primary"
                onClick={this.getCode}
                loading={loading}
              >
                {'верифицировать'.toUpperCase()}
              </Button>
            </>
          )
        }
      </div>
    );
  }
}

export default ProfileEmail;
