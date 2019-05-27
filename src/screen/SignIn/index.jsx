import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import compose from 'recompose/compose';
import bem from 'bem-join';

import {
  Row, Col, notification, Icon,
} from 'antd';

import { SignInForm } from '../../components/Forms';
import { Map } from '../../components';
// import { Timer } from '../../components';

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
      await asyncRequest({ url });
      this.setState({ gotCode: true, phone: value });
    } catch (err) {
      notification.error({
        duration: 5,
        message: err.message || 'Ошибка',
        description: 'Возникла ошибка',
      });
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

  changeContactHandler = () => {
    this.setState({ gotCode: false });
  };

  render() {
    const { gotCode, phone, currentLocation } = this.state;

    return (
      <Row className={b()}>
        <Col xl={9} lg={12} md={12} sm={24} xs={24} className={b('left')}>
          <div className={b('left-logoBlock')}>
            <div className={b('left-logoBlock-img')} />
          </div>
          <div className={b('left-contentBlock')}>
            <div className={b('left-contentBlock-border')}>
              <h1 className={b('left-contentBlock-title')}>
                Панель управления вашим бизнесом
              </h1>
              <p className={b('left-contentBlock-subtitle')}>
                маркетинг и контроль в один клик
              </p>
            </div>

            {gotCode ? (
              <SignInForm
                firstStep={false}
                buttonText="Вход"
                labelText="Одноразовый пароль из смс"
                placeholder=""
                sendCodeHandler={this.sendCodeHandler}
              />
            ) : (
              <SignInForm
                firstStep
                buttonText="Получить одноразовый пароль"
                labelText="Введите номер телефона"
                placeholder="+380507595188"
                getCodeHandler={this.getCodeHandler}
              />
            )}
          </div>
          {gotCode && (
            <div className={b('left-infoBar')}>
              <Icon type="info-circle" />
              <span>{`СМС с паролем отправлено на номер ${phone}`}</span>
            </div>
          )}
        </Col>

        <Col xl={15} lg={12} md={12} sm={0} xs={0} className={b('right')}>
          <div className={b('right-supportBlock')}>1</div>
          <div className={b('right-mapBlock')}>
            <Map
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
            <span>All rights reserved. Copyright &copy; 2019 Coupler Business</span>
          </div>
        </Col>
      </Row>
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
