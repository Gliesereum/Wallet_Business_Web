import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import compose from 'recompose/compose';
import bem from 'bem-join';

import { notification } from 'antd';

import { SignInForm } from '../../components/Forms';
import { asyncRequest } from '../../utils';
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
      },
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
      this.setState({
        gotCode: true,
        phone: value,
        validateStatus: '',
      });
    }
  };

  sendCodeHandler = async (code) => {
    if (code.length === 6) {
      const { phone } = this.state;
      const { checkAuthenticate, startApp } = this.props;
      const body = {
        value: phone.slice(1, 13),
        type: 'PHONE',
        code,
      };
      const userDataUrl = 'auth/signin';

      try {
        const { tokenInfo } = await asyncRequest({
          url: userDataUrl,
          body,
          method: 'POST',
        });
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
      gotCode,
      phone,
      validateStatus,
    } = this.state;

    return (
      <div className={b()}>
        <div className={b('left')}>
          <div className={b('left-logo')} />
          <div className={b('left-titleBlock')}>
            <h1 className={b('left-titleBlock-title')}>
              Панель управления вашим бизнесом
            </h1>
            <div className={b('left-titleBlock-divider')} />
            <p className={b('left-titleBlock-subtitle')}>
              Маркетинг и контроль в один клик
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
        <div className={b('footerBlock')}>
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
        {/* <div className={b('right')}>
           <div className={b('right-supportBlock')}>1</div>
          <div className={b('right-mapBlock')}>
            <div className={b('right-mapBlock_message')}>
              <span>Coupler Business</span>
            </div>
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
        </div> */}
      </div>
    );
  }
}

const mapDispatchToProps = dispatch => ({
  checkAuthenticate: tokenInfo => dispatch(actions.auth.$checkAuthenticate(tokenInfo)),
  startApp: () => dispatch(actions.app.$startApp()),
});

export default compose(
  connect(null, mapDispatchToProps),
  withRouter,
)(SignIn);
