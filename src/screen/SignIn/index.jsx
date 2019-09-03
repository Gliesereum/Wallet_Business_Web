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
  Button,
  Icon,
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
            <div className={b('description')}>
              <h1 className={b('description-title')}>Головне про Coupler Business Web за 30 секунд</h1>
              <p className={b('description-text')}>
                Повна керованість бізнесу та віддалений контроль працівників. Ідеальна система автоматизації для сфери послуг.Особистий помічник у смартфоні
              </p>
            </div>
            <div className={b('video')}>
              <iframe
                height={200}
                width={328}
                title="signIn Coupler Video"
                allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
                src={language.phrases['signIn.landing.video.url'][defaultLanguage.isoKey]}
                frameBorder="0"
                allowFullScreen
              />
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
              <Step
                status="process"
                icon={<PointBullet />}
                title="Контроль виконання замовлень та виручки"
                description="Завантажте Coupler Worker для працівника, щоб стежити за робочим процесом навіть коли ви не в офісі"
              />
              <Step
                status="process"
                icon={<PointBullet />}
                title="Зручний сервіс онлайн-запису для клієнтів вашого бізнесу"
                description="Встановіть на сайт кнопку Coupler Widget та/або порекомендуйте клієнтам додаток Coupler, щоб отримувати замовлення онлайн, спростити процес бронювання послуг та роботу адміністраторів"
              />
            </Steps>
            <div className={b('banner')}>
              <div className={b('banner-bg')} />
              <div className={b('banner-text')}>
                {language.phrases['signIn.landing.banner.text'][defaultLanguage.isoKey]}
              </div>
              <a
                className={b('banner-googlePlayBtn')}
                href="https://play.google.com/store/apps/details?id=com.gliesereum.coupler_worker"
                target="_blank"
              />
            </div>
            <div className={b('otherServices')}>
              <Button className="backBtn">
                <Icon type="left" />
                <a
                  href="https://coupler.app/"
                  target="_blank"
                >
                  Інші додатки Coupler
                </a>
              </Button>
            </div>
            <div className={b('networks')}>
              <h1 className={b('networks-title')}>Стежте за нами у соцмережах</h1>
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
