import React, { Component } from 'react';
import { connect } from 'react-redux';
import compose from 'recompose/compose';
import bem from 'bem-join';
import { Link } from 'react-router-dom';

import {
  // Badge,
  Drawer,
  Avatar,
} from 'antd';

import TotalPriceInfoDrawer from '../TotalPriceInfoDrawer';
import HelpDrawer from '../HelpDrawer';
import ScreenLoading from '../ScreenLoading';
import SideMenu from '../SideMenu';

// import Notification from '../../assets/Notification.svg';
import {
  TotalPrice,
  MoreIcon,
  HelpIcon,
  CouplerLogoForMobileHeader,
  BurgerMenu,
} from '../../assets/iconComponents';
import { fetchDecorator, getFirstLetterName } from '../../utils';
import { fetchAction } from '../../fetches';

const b = bem('header');

class Header extends Component {
  state = {
    totalPriceDrawerVisible: false,
    helpModalVisible: false,
    mobileSideBarVisible: false,
  };

  handleVisibleState = key => () => this.setState(prevState => ({
    ...prevState,
    [key]: !prevState[key],
  }));

  render() {
    const {
      user,
      todayTotalPrice = { sum: 0 },
      yesterdayTotalPrice = { sum: 0 },
      corporations,
      defaultLanguage,
      phrases,
      loading,
    } = this.props;
    const {
      totalPriceDrawerVisible,
      helpModalVisible,
      mobileSideBarVisible,
    } = this.state;

    return (
      <div className={b()}>
        <div className={b('leftSection')}>
          <Link
            className={b('content-box')}
            to="/profile"
          >
            <Avatar src={user.avatarUrl || undefined} className={b('content-box-avatar')}>
              {getFirstLetterName(user.firstName, user.lastName)}
            </Avatar>
            <div className={b('content-box-naming')}>
              <h1>{phrases['sideBar.menu.profile.label'][defaultLanguage.isoKey]}</h1>
            </div>
          </Link>
          <div
            className={b('content-box', { helpSection: true })}
            onClick={this.handleVisibleState('helpModalVisible')}
          >
            <HelpIcon
              visible={helpModalVisible}
              onClose={this.handleVisibleState('helpModalVisible')}
            />
            <div className="text">{phrases['header.menu.personalAssistant'][defaultLanguage.isoKey]}</div>
          </div>
        </div>
        <div className={b('rightSection')}>
          <div className={b('content-box')}>
            <TotalPrice />
            <div className={b('content-box-price')}>
              <div className={b('content-box-price-day')}>
                <div>{`${phrases['header.totalPrice.today'][defaultLanguage.isoKey]}:`}</div>
                <div>{`${phrases['header.totalPrice.yesterday'][defaultLanguage.isoKey]}:`}</div>
              </div>
              <div className={b('content-box-price-number')}>
                <div>
                  {loading ? <ScreenLoading /> : todayTotalPrice.sum}
                  {` ${phrases['core.currency.uah'][defaultLanguage.isoKey]}`}
                </div>
                <div>
                  {loading ? <ScreenLoading /> : yesterdayTotalPrice.sum}
                  {` ${phrases['core.currency.uah'][defaultLanguage.isoKey]}`}
                </div>
              </div>
            </div>
            <div
              className={b('content-box-more')}
              onClick={this.handleVisibleState('totalPriceDrawerVisible')}
            >
              <MoreIcon />
            </div>
          </div>
        </div>
        <div className={b('mobileSection')}>
          <div
            onClick={this.handleVisibleState('mobileSideBarVisible')}
            className={b('mobileSection-burgerMenu')}
          >
            <BurgerMenu />
          </div>
          <div className={b('mobileSection-logo')}>
            <CouplerLogoForMobileHeader />
          </div>
          <div
            onClick={this.handleVisibleState('totalPriceDrawerVisible')}
            className={b('mobileSection-price')}
          >
            <TotalPrice />
          </div>
        </div>
        {
          totalPriceDrawerVisible && (
            <TotalPriceInfoDrawer
              visible={totalPriceDrawerVisible}
              corporations={corporations}
              onClose={this.handleVisibleState('totalPriceDrawerVisible')}
              defaultLanguage={defaultLanguage}
              phrases={phrases}
            />
          )
        }
        {
          helpModalVisible && (
            <HelpDrawer
              visible={helpModalVisible}
              onClose={this.handleVisibleState('helpModalVisible')}
            />
          )
        }
        {
          mobileSideBarVisible && (
            <Drawer
              placement="left"
              className={b('mobileSection-sideMenu')}
              visible={mobileSideBarVisible}
              mask
              onClose={this.handleVisibleState('mobileSideBarVisible')}
            >
              <SideMenu onCloseSideBar={this.handleVisibleState('mobileSideBarVisible')} />
            </Drawer>
          )
        }
      </div>
    );
  }
}

const mapStateToProps = state => ({
  corporations: state.corporations.corporations,
  defaultLanguage: state.app.defaultLanguage,
  phrases: state.app.phrases,
});

export default compose(
  connect(mapStateToProps),
  fetchDecorator({
    actions: [
      ({ corporations }) => (corporations && corporations.length) && fetchAction({
        url: 'record/by-params-for-business/payment-info',
        fieldName: 'todayTotalPrice',
        fieldType: {},
        method: 'POST',
        body: {
          corporationIds: corporations.map(item => item.id),
          from: new Date().setUTCHours(0, 0, 0, 1),
          to: new Date().setUTCHours(23, 59, 59, 999),
        },
      })(),
      ({ corporations }) => (corporations && corporations.length) && fetchAction({
        url: 'record/by-params-for-business/payment-info',
        fieldName: 'yesterdayTotalPrice',
        fieldType: {},
        method: 'POST',
        body: {
          corporationIds: corporations.map(item => item.id),
          from: new Date(new Date().setUTCDate(new Date().getUTCDate() - 1)).setUTCHours(0, 0, 0, 1),
          to: new Date(new Date().setUTCDate(new Date().getUTCDate() - 1)).setUTCHours(24, 59, 59, 999),
        },
      })(),
    ],
    config: { loader: false },
  })
)(Header);
