import React, { Component } from 'react';
import { connect } from 'react-redux';
import compose from 'recompose/compose';
import bem from 'bem-join';
import { Link } from 'react-router-dom';

import {
  // Badge,
  Avatar,
  Dropdown,
  Menu,
  Icon,
} from 'antd';

import TotalPriceInfoDrawer from '../TotalPriceInfoDrawer';
import HelpDrawer from '../HelpDrawer';
import ScreenLoading from '../ScreenLoading';

// import Notification from '../../assets/Notification.svg';
import {
  TotalPrice,
  MoreIcon,
  HelpIcon,
} from '../../assets/iconComponents';
import { fetchDecorator, getFirstLetterName } from '../../utils';
import { fetchAction } from '../../fetches';

const b = bem('header');

class Header extends Component {
  state = {
    totalPriceDrawerVisible: false,
    helpModalVisible: false,
  };

  handleVisibleState = key => () => this.setState(prevState => ({
    ...prevState,
    [key]: !prevState[key],
  }));

  renderProfileMenu = (language, defaultLanguage) => () => (
    <Menu className={b('menu')}>
      <Menu.Item
        className={b('menu-item')}
      >
        <Link to="/profile">
          <Icon type="user" />
          <span className={b('menu-item-text')}>{language.phrases['header.menu.myProfile'][defaultLanguage.isoKey]}</span>
        </Link>
      </Menu.Item>
      <Menu.Item
        disabled
        className={b('menu-item')}
      >
        <Icon type="safety-certificate" />
        <span className={b('menu-item-text')}>
          {language.phrases['header.menu.personalAssistant'][defaultLanguage.isoKey]}
          <div className={b('menu-item-indicator')}>for premium</div>
        </span>
      </Menu.Item>
    </Menu>
  );

  render() {
    const {
      user,
      todayTotalPrice = { sum: '' },
      yesterdayTotalPrice = { sum: '' },
      corporations,
      defaultLanguage,
      language,
      loading,
    } = this.props;
    const {
      totalPriceDrawerVisible,
      helpModalVisible,
    } = this.state;

    return (
      <div className={b()}>
        <div
          onClick={this.handleVisibleState('helpModalVisible')}
          className={b('helpSection')}
        >
          <HelpIcon
            visible={helpModalVisible}
            onClose={this.handleVisibleState('helpModalVisible')}
          />
          <div>Центр помощи</div>
        </div>
        <div className={b('optionsSection')}>
          <Dropdown
            trigger={['click']}
            overlay={this.renderProfileMenu(language, defaultLanguage)}
            className={b('content-box', { profileSection: true })}
          >
            <div>
              <Avatar src={user.avatarUrl || undefined} className={b('content-box-avatar')}>
                {getFirstLetterName(user.firstName, user.lastName)}
              </Avatar>
              <div className={b('content-box-naming')}>
                <h1>{`${user.firstName} ${user.lastName}`}</h1>
              </div>
            </div>
          </Dropdown>
          <div className={b('content-box')}>
            <TotalPrice />
            <div className={b('content-box-price')}>
              <div className={b('content-box-price-day')}>
                <div>{`${language.phrases['header.totalPrice.today'][defaultLanguage.isoKey]}:`}</div>
                <div>{`${language.phrases['header.totalPrice.yesterday'][defaultLanguage.isoKey]}:`}</div>
              </div>
              <div className={b('content-box-price-number')}>
                <div>{loading ? <ScreenLoading /> : todayTotalPrice.sum}</div>
                <div>{loading ? <ScreenLoading /> : yesterdayTotalPrice.sum}</div>
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
        {
          totalPriceDrawerVisible && (
            <TotalPriceInfoDrawer
              visible={totalPriceDrawerVisible}
              corporations={corporations}
              onClose={this.handleVisibleState('totalPriceDrawerVisible')}
              defaultLanguage={defaultLanguage}
              language={language}
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
      </div>
    );
  }
}

const mapStateToProps = state => ({
  corporations: state.corporations.corporations,
  defaultLanguage: state.app.defaultLanguage,
  language: state.app.language,
});

export default compose(
  connect(mapStateToProps),
  fetchDecorator({
    actions: [
      // today
      ({ corporations }) => fetchAction({
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
      // yesterday
      ({ corporations }) => fetchAction({
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
