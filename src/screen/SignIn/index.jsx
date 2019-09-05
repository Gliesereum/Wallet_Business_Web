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
  Steps,
} from 'antd';

import { SignInForm } from '../../components/Forms';
import Footer from '../../components/Footer';

import {
  Telegram,
  Facebook,
  YouTube,
  PointBullet,
} from '../../assets/iconComponents';

import { asyncRequest, cookieStorage } from '../../utils';
import { actions } from '../../state';

const b = bem('signIn');
const { Step } = Steps;

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
      phrases,
      defaultLanguage,
      langPack,
    } = this.props.app;

    return (
      <div className={b()}>
        <Helmet>
          <meta charSet="utf-8" />
          <title>{phrases['page.signIn.helmet.Title'][defaultLanguage.isoKey]}</title>
        </Helmet>
        <Row className={b('main')}>
          <Col
            className={b('main-formBlock')}
            xs={24}
          >
            <div className={b('logo')} />
            <div className={b('titleBlock')}>
              <div className={b('titleBlock-title')}>
                {phrases['signIn.form.header'][defaultLanguage.isoKey]}
              </div>
              <div className={b('titleBlock-subtitle')}>
                {phrases['signIn.form.title'][defaultLanguage.isoKey]}
              </div>
            </div>
            <SignInForm
              defaultLanguage={defaultLanguage}
              phrases={phrases}
              gotCode={gotCode}
              phone={phone}
              validateStatus={validateStatus}
              getCodeHandler={this.getCodeHandler}
              sendCodeHandler={this.sendCodeHandler}
              gotCodeHandler={this.gotCodeHandler}
            />
            <div className={b('support')}>
              <span>Виникли труднощі?&nbsp;</span>
              <a href="mailto:support@gliesereum.com">Написати листа</a>
            </div>
          </Col>
          <Col xs={24}>
            <div className={b('description')}>
              <h1 className={b('description-title')}>Повна керованість бізнесу</h1>
              <p className={b('description-text')}>
                <span>Ідеальна система автоматизації для сфери послуг</span>
                <br />
                <span>Особистий помічник у смартфоні </span>
              </p>
            </div>
            <div className={b('deviceImage')}>
              <div className={b('deviceImage-container')} />
            </div>
            <Steps
              className={b('businessPoints')}
              direction="vertical"
            >
              <Step
                status="process"
                icon={<PointBullet />}
                title="Актуальні дані бізнесу завжди під рукою"
                description="Статистика та аналітика замовлень, клієнтів, виручки, ефективності співробітників. Більше не потрібно витрачати час на нудні адміністративні процеси збору та перевірки інформації. Відтепер точні й правдиві дані про стан вашого бізнесу доступні 24/7 з будь-якого девайсу"
              />
              <Step
                status="process"
                icon={<PointBullet />}
                title="Можливість управління мережею бізнесів"
                description="Облік та аналіз даних, що оновлюються у режимі реального часу, для одного або мережі бізнесів. Короткі наочні звіти з графіками та діаграмами"
              />
              <Step
                status="process"
                icon={<PointBullet />}
                title="Керування послугами, пакетами послуг, цінами, акціями та програмами лояльності"
                description="Заповніть інформацію про компанію та створіть основні пропозиції, щоб клієнти могли замовляти послуги онлайн"
              />
            </Steps>
            <div className={b('networks')}>
              <h1 className={b('networks-title')}>Стежте за нами у соцмережах:</h1>
              <div className={b('networks-icons')}>
                <a
                  href="https://t.me/coupler_public"
                  className={b('networks-icon')}
                  target="_blank"
                >
                  <Telegram />
                </a>
                <a
                  href="https://www.facebook.com/coupler.platform"
                  className={b('networks-icon')}
                  target="_blank"
                >
                  <Facebook />
                </a>
                <a
                  href="https://www.youtube.com/channel/UCOvMGeaG-MmcvAbrrn56ekQ"
                  className={b('networks-icon')}
                  target="_blank"
                >
                  <YouTube />
                </a>
              </div>
            </div>
          </Col>
        </Row>
        <Footer
          langPack={langPack}
          setLanguage={this.props.$setLanguage}
          defaultLanguage={defaultLanguage}
          phrases={phrases}
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
