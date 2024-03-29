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
  Steps, Icon,
} from 'antd';

import { SignInForm } from '../../components/Forms';
import Footer from '../../components/Footer';

import { PointBullet } from '../../assets/iconComponents';

import { asyncRequest, cookieStorage } from '../../utils';
import { actions } from '../../state';

const b = bem('signIn');
const { Step } = Steps;

class SignIn extends Component {
  state = {
    phone: null,
    gotCode: false,
    loader: false,
  };

  componentDidMount() {
    const { $getAppStatistic } = this.props;

    $getAppStatistic();
  }

  gotCodeHandler = () => this.setState(prevState => ({
    ...prevState,
    gotCode: !prevState.gotCode,
  }));

  getCodeHandler = async (value) => {
    const url = `phone/code?phone=${value}`;

    try {
      this.setState({ loader: true });
      await asyncRequest({ url });
    } catch (err) {
      notification.error({
        duration: 5,
        message: err.message || 'Ошибка',
        description: 'Ошибка',
      });
    } finally {
      this.setState({ gotCode: true, phone: value, loader: false });
    }
  };

  sendCodeHandler = async (code) => {
    if (code.length === 6) {
      const { phone } = this.state;
      const { $startApp } = this.props;
      const body = { value: phone, type: 'PHONE', code };
      const userDataUrl = 'auth/signin';

      try {
        this.setState({ loader: true });
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
      } finally {
        this.setState({ loader: false });
      }
    }
  };

  render() {
    const {
      gotCode,
      phone,
      loader,
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
        <div className={b('main')}>
          <div className={b('main-formBlock')}>
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
              loader={loader}
              defaultLanguage={defaultLanguage}
              phrases={phrases}
              gotCode={gotCode}
              phone={phone}
              getCodeHandler={this.getCodeHandler}
              sendCodeHandler={this.sendCodeHandler}
              gotCodeHandler={this.gotCodeHandler}
            />
            <div className={b('support')}>
              <span>
                {phrases['signIn.havingTrouble'][defaultLanguage.isoKey]}
                &nbsp;
              </span>
              <a href="mailto:support@gliesereum.com">
                {phrases['signIn.writeUs'][defaultLanguage.isoKey]}
              </a>
            </div>
          </div>
          <div className={b('main-contentBlock')}>
            <div className={b('main-contentBlock-content')}>
              <div className={b('description')}>
                <h1 className={b('description-title')}>
                  {phrases['signIn.description.title'][defaultLanguage.isoKey]}
                </h1>
                <p className={b('description-text')}>
                  <span>{phrases['signIn.description.firstTextPoint'][defaultLanguage.isoKey]}</span>
                  <br />
                  <span>{phrases['signIn.description.secondTextPoint'][defaultLanguage.isoKey]}</span>
                </p>
              </div>
              <div className={b('pointsDeviceContainer')}>
                {/* <div className={b('pointsDeviceContainer-deviceImage')}>
                <div className={b('pointsDeviceContainer-deviceImage-container')} />
              </div> */}
                <div className="CouplerAction">
                  <div>
                    <div className={b('pointsDeviceContainer-deviceImage')}>
                      <div
                        className={b('pointsDeviceContainer-deviceImage-container')}
                        style={{
                          height: '100%',
                          width: '100%',
                          background: `no-repeat url(${phrases['signInPage.actionBlock.image.url'][defaultLanguage.isoKey]}) center center`,
                          backgroundSize: 'contain',
                          overflow: 'hidden',
                        }}
                      />
                    </div>
                    {/* <img
                    height="380px"
                    src={phrases['signInPage.actionBlock.image.url'][defaultLanguage.isoKey]}
                    alt="Coupler"
                  /> */}
                  </div>
                  <div className="BadgeAction">
                    <span>{phrases['signInPage.actionBlock.title'][defaultLanguage.isoKey]}</span>
                  </div>
                </div>
                <Steps
                  className={b('pointsDeviceContainer-businessPoints')}
                  direction="vertical"
                >
                  <Step
                    status="process"
                    icon={<PointBullet />}
                    title={phrases['signIn.points.firstPoint.title'][defaultLanguage.isoKey]}
                    description={phrases['signIn.points.firstPoint.description'][defaultLanguage.isoKey]}
                  />
                  <Step
                    status="process"
                    icon={<PointBullet />}
                    title={phrases['signIn.points.secondPoint.title'][defaultLanguage.isoKey]}
                    description={phrases['signIn.points.secondPoint.description'][defaultLanguage.isoKey]}
                  />
                  <Step
                    status="process"
                    icon={<PointBullet />}
                    title={phrases['signIn.points.thirdPoint.title'][defaultLanguage.isoKey]}
                    description={phrases['signIn.points.thirdPoint.description'][defaultLanguage.isoKey]}
                  />
                </Steps>
              </div>
              <div className={b('future-box')}>
                <div className={b('future-title')}>
                  <h1>{phrases['signIn.futureBox.title'][defaultLanguage.isoKey]}</h1>
                </div>
                <div className={b('box-content-wrapper')}>
                  <div>
                    <FutureBoxCard
                      title={phrases['signIn.futureBox.card.clientApp.title'][defaultLanguage.isoKey]}
                      description={phrases['signIn.futureBox.card.clientApp.description'][defaultLanguage.isoKey]}
                      imgSrc={phrases['signIn.futureBox.card.clientApp.imageLink'][defaultLanguage.isoKey]}
                      appleLink={phrases['signIn.futureBox.card.clientApp.appStoreLink'][defaultLanguage.isoKey]}
                      googleLink={phrases['signIn.futureBox.card.clientApp.playMarketLink'][defaultLanguage.isoKey]}
                    />
                  </div>
                  <div>
                    <FutureBoxCard
                      title={phrases['signIn.futureBox.card.widgetApp.title'][defaultLanguage.isoKey]}
                      description={phrases['signIn.futureBox.card.widgetApp.description'][defaultLanguage.isoKey]}
                      imgSrc={phrases['signIn.futureBox.card.widgetApp.imageLink'][defaultLanguage.isoKey]}
                      link={phrases['signIn.futureBox.card.widgetApp.link'][defaultLanguage.isoKey]}
                    />
                  </div>
                  <div>
                    <FutureBoxCard
                      title={phrases['signIn.futureBox.card.workerApp.title'][defaultLanguage.isoKey]}
                      description={phrases['signIn.futureBox.card.workerApp.description'][defaultLanguage.isoKey]}
                      imgSrc={phrases['signIn.futureBox.card.workerApp.imageLink'][defaultLanguage.isoKey]}
                      googleLink={phrases['signIn.futureBox.card.workerApp.playMarketLink'][defaultLanguage.isoKey]}
                    />
                  </div>
                </div>
              </div>
            </div>
            <Row>
              <Col
                className={b('footerCol')}
                xs={24}
                sm={24}
              >
                <Footer
                  langPack={langPack}
                  setLanguage={this.props.$setLanguage}
                  defaultLanguage={defaultLanguage}
                  phrases={phrases}
                />
              </Col>
            </Row>
          </div>
        </div>
        {/* <Row>
          <Col
            className={b('footerCol')}
            xs={24}
            sm={24}
          >
            <Footer
              langPack={langPack}
              setLanguage={this.props.$setLanguage}
              defaultLanguage={defaultLanguage}
              phrases={phrases}
            />
          </Col>
        </Row> */}
      </div>
    );
  }
}

function FutureBoxCard({
  imgSrc, title, description, appleLink, googleLink, link,
}) {
  return (
    <div className="FutureBoxCard">
      <div className="__Title">
        <span>{title}</span>
      </div>
      <div className="__ImageBox">
        <img src={imgSrc} alt={title} />
      </div>
      <div className="__Description">
        <div dangerouslySetInnerHTML={{ __html: description }} />
      </div>
      <div className="__Links">
        {appleLink && (
          <a href={appleLink} target="_blank">
            <Icon style={{ fontSize: 30, color: '#f77805' }} type="apple" />
          </a>
        )}
        {googleLink && (
          <a href={googleLink} target="_blank">
            <Icon style={{ fontSize: 26, color: '#f77805' }} type="android" />
          </a>
        )}
        {link && (
          <a href={link} target="_blank">
            <Icon style={{ fontSize: 26, color: '#f77805' }} type="chrome" />
          </a>
        )}
      </div>
    </div>
  );
}

const { $setLanguage, $startApp, $getAppStatistic } = actions.app;

export default compose(
  connect(state => state, { $startApp, $setLanguage, $getAppStatistic }),
  withRouter,
)(SignIn);
