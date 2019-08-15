import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import compose from 'recompose/compose';
import bem from 'bem-join';

import { notification } from 'antd';

import { SignInForm } from '../../components/Forms';

import { asyncRequest, cookieStorage } from '../../utils';
import { actions } from '../../state';
import { defaultGeoPosition } from '../../components/Map/mapConfig';

const b = bem('signIn');

class SignIn extends Component {
  state = {
    phone: null,
    gotCode: false,
    currentLocation: defaultGeoPosition,
    validateStatus: '',
  };

  componentDidMount() {
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        this.setState(prevState => ({
          ...prevState,
          currentLocation: {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          },
        }));
      }
    );
  }

  gotCodeHandler = () => this.setState(prevState => ({
    ...prevState,
    gotCode: !prevState.gotCode,
  }));

  getCodeHandler = async (value) => {
    const url = `phone/code?phone=${value.slice(1, 13)}`;

    try {
      this.setState({ validateStatus: 'validating' });
      await asyncRequest({ url });
    } catch (err) {
      notification.error({
        duration: 5,
        message: err.message || 'Ошибка',
        description: 'Возникла ошибка',
      });
    } finally {
      this.setState({ gotCode: true, phone: value, validateStatus: '' });
    }
  };

  sendCodeHandler = async (code) => {
    if (code.length === 6) {
      const { phone } = this.state;
      const { startApp } = this.props;
      const body = { value: phone.slice(1, 13), type: 'PHONE', code };
      const userDataUrl = 'auth/signin';

      try {
        const { tokenInfo } = await asyncRequest({ url: userDataUrl, body, method: 'POST' });
        if (tokenInfo) {
          const {
            accessExpirationDate, accessToken, refreshToken, refreshExpirationDate,
          } = tokenInfo;
          cookieStorage.set('access_token', accessToken, { expires: new Date(accessExpirationDate), path: '/' });
          cookieStorage.set('refresh_token', refreshToken, { expires: new Date(refreshExpirationDate), path: '/' });
        }

        await startApp();
      } catch (err) {
        notification.error({
          duration: 5,
          message: err.message || 'Ошибка',
          description: 'Возникла ошибка',
        });
      }
    }
  };

  render() {
    const {
      gotCode,
      phone,
      validateStatus,
    } = this.state;

    return (
      <div className={b()}>
        <div className={b('main')}>
          <div className={b('logo')} />
          <div className={b('titleBlock')}>
            <h1 className={b('titleBlock-title')}>
              Панель управления бизнесом
            </h1>
            <p className={b('titleBlock-subtitle')}>
              удаленный контроль 24/7
            </p>
          </div>
          <SignInForm
            gotCode={gotCode}
            phone={phone}
            validateStatus={validateStatus}
            getCodeHandler={this.getCodeHandler}
            sendCodeHandler={this.sendCodeHandler}
            gotCodeHandler={this.gotCodeHandler}
          />
        </div>
        <div className={b('footer')}>
          <span className={b('footer-text')}>All rights reserved. Copyright &copy; 2019 &nbsp;</span>
          <a
            className={b('footer-text')}
            href="https://www.gliesereum.com/"
            target="_blank"
          >
            Gliesereum Ukraine
          </a>
        </div>
      </div>
    );
  }
}

const mapDispatchToProps = dispatch => ({
  startApp: () => dispatch(actions.app.$startApp()),
});

export default compose(
  connect(null, mapDispatchToProps),
  withRouter,
)(SignIn);
