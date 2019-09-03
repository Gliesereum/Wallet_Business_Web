import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import compose from 'recompose/compose';
import bem from 'bem-join';
import { Helmet } from 'react-helmet';

import {
  Row,
  Col,
  notification,
  Divider,
} from 'antd';

import { SignInForm } from '../../components/Forms';
import Footer from '../../components/Footer';

import { asyncRequest, cookieStorage } from '../../utils';
import { actions } from '../../state';

const b = bem('signIn');

class SignIn extends Component {
  state = {
    phone: null,
    gotCode: false,
    validateStatus: '',
  };

  gotCodeHandler = () => this.setState(prevState => ({
    ...prevState,
    gotCode: !prevState.gotCode,
  }));

  getCodeHandler = async (value) => {
    const url = `phone/code?phone=${value}`;

    try {
      this.setState({ validateStatus: 'validating' });
      await asyncRequest({ url });
    } catch (err) {
      notification.error({
        duration: 5,
        message: err.message || 'Ошибка',
        description: 'Ошибка',
      });
    } finally {
      this.setState({ gotCode: true, phone: value, validateStatus: '' });
    }
  };

  sendCodeHandler = async (code) => {
    if (code.length === 6) {
      const { phone } = this.state;
      const { $startApp } = this.props;
      const body = { value: phone, type: 'PHONE', code };
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

        await $startApp();
      } catch (err) {
        notification.error({
          duration: 5,
          message: err.message || 'Ошибка',
          description: 'Ошибка',
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

    const {
      language,
      defaultLanguage,
      langPack,
    } = this.props.app;

    return (
      <div className={b()}>
        <Helmet>
          <meta charSet="utf-8" />
          <title>{language.phrases['page.signIn.helmet.Title'][defaultLanguage.isoKey]}</title>
        </Helmet>
        <Row className={b('main')}>
          <Col xs={24}>
            {/* <div className={b('badge')}> */}
            {/*  {language.phrases['start.page.welcome.message'][defaultLanguage.isoKey]} */}
            {/* </div> */}
            <div className={b('logo')} />
            <div className={b('titleBlock')}>
              <div className={b('titleBlock-title')}>
                {language.phrases['signIn.form.header'][defaultLanguage.isoKey]}
              </div>
              <Divider className={b('titleBlock-divider')} />
              <div className={b('titleBlock-subtitle')}>
                {language.phrases['signIn.form.title'][defaultLanguage.isoKey]}
              </div>
            </div>
            <SignInForm
              defaultLanguage={defaultLanguage}
              language={language}
              gotCode={gotCode}
              phone={phone}
              validateStatus={validateStatus}
              getCodeHandler={this.getCodeHandler}
              sendCodeHandler={this.sendCodeHandler}
              gotCodeHandler={this.gotCodeHandler}
            />
          </Col>
          <Col xs={24}>
            otherSection
          </Col>
        </Row>
        <Footer
          langPack={langPack}
          setLanguage={this.props.$setLanguage}
          defaultLanguage={defaultLanguage}
          language={language}
        />
      </div>
    );
  }
}

const { $setLanguage, $startApp } = actions.app;

export default compose(
  connect(state => state, { $startApp, $setLanguage }),
  withRouter,
)(SignIn);
