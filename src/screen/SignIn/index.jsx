import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import compose from 'recompose/compose';
import bem from 'bem-join';

import { notification } from 'antd';

import { SignInForm } from '../../components/Forms';
import { Map, Timer } from '../../components';

import meIcon from '../../assets/marker.svg';
import { asyncRequest } from '../../utils';
import { actions } from '../../state';
import config from '../../config';
import { defaultGeoPosition } from '../../components/Map/mapConfig';

import './index.scss';

const b = bem('signIn');

class SignIn extends Component {
  state = {
    phone: '',
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
      const { checkAuthenticate, startApp } = this.props;
      const body = { value: phone.slice(1, 13), type: 'PHONE', code };
      const userDataUrl = 'auth/signin';

      try {
        const { tokenInfo } = await asyncRequest({ url: userDataUrl, body, method: 'POST' });
        await checkAuthenticate(tokenInfo);

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
      gotCode, phone, currentLocation, validateStatus,
    } = this.state;

    return (
      <div className={b()}>
        <div className={b('left')}>
          <div className={b('left-logoBlock')}>
            <div className={b('left-logoBlock-img')} />
          </div>
          <div className={b('left-contentBlock')}>
            <div className={b('left-contentBlock-border')}>
              <h1 className={b('left-contentBlock-title')}>
                Панель управления вашим бизнесом
              </h1>
              <p className={b('left-contentBlock-subtitle')}>
                Маркетинг и контроль в один клик
              </p>
            </div>

            {gotCode ? (
              <SignInForm
                firstStep={false}
                buttonText="Вход"
                labelText="Одноразовый пароль из смс"
                placeholder=""
                sendCodeHandler={this.sendCodeHandler}
                validateStatus={validateStatus}
              />
            ) : (
              <SignInForm
                firstStep
                buttonText="Получить одноразовый пароль"
                labelText="Введите номер телефона"
                placeholder="+380507595188"
                getCodeHandler={this.getCodeHandler}
                validateStatus={validateStatus}
              />
            )}
          </div>
          {gotCode && (
            <div className={b('left-infoBar')}>
              <Timer time={180000} />
              <span>код был отправлен на номер</span>
              <span>{phone || 380507595188}</span>
            </div>
          )}
        </div>

        <div className={b('right')}>
          {/* <div className={b('right-supportBlock')}>1</div> */}
          <div className={b('right-mapBlock')}>
            <Map
              singlePin={false}
              draggable={false}
              containerElement={<div style={{ height: '100%' }} />}
              mapElement={<div style={{ height: '100%' }} />}
              loadingElement={<div style={{ height: '100%' }} />}
              googleMapURL={`https://maps.googleapis.com/maps/api/js?key=${config.googleAPIKey}&libraries=geometry,drawing,places`}
              icon={meIcon}
              currentLocation={currentLocation}
            />
          </div>
          <div className={b('right-footerBlock')}>
            <span>
              All rights reserved. Copyright &copy; 2019 &nbsp;
              <a
                href="https://www.gliesereum.com/"
                target="_blank"
              >
                Gliesereum Ukraine
              </a>
            </span>
          </div>
        </div>
      </div>
    );
  }
}

const mapDispatchToProps = dispatch => ({
  checkAuthenticate: tokenInfo => dispatch(actions.auth.$checkAuthenticate(tokenInfo)),
  dataLoading: bool => dispatch(actions.app.$dataLoading(bool)),
  startApp: () => dispatch(actions.app.$startApp()),
});

export default compose(
  connect(null, mapDispatchToProps),
  withRouter,
)(SignIn);
