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

// import Notification from '../../assets/Notification.svg';
import {
  ArrowDown,
  ArrowUp,
  TotalPrice,
  MoreIcon,
} from '../../assets/iconComponents';
import { fetchDecorator, getFirstLetterName } from '../../utils';
import { fetchAction } from '../../fetches';

const b = bem('header');

class Header extends Component {
  state = {
    visibleDropdown: false,
    totalPriceDrawerVisible: false,
  };

  handlerDropdownVisible = () => this.setState(prevState => ({ visibleDropdown: !prevState.visibleDropdown }));

  handleTotalPriceDrawerVisible = () => this.setState(prevState => ({ totalPriceDrawerVisible: !prevState.totalPriceDrawerVisible }));

  renderProfileMenu = (language, defaultLanguage) => () => (
    <Menu
      className={b('menu')}
      onClick={this.handlerDropdownVisible}
    >
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
    } = this.props;
    const { visibleDropdown, totalPriceDrawerVisible } = this.state;

    return (
      <div className={b()}>
        <div className={b('content-box')}>
          <TotalPrice />
          <div className={b('content-box-price')}>
            <div className={b('content-box-price-day')}>
              <div>{`${language.phrases['header.totalPrice.today'][defaultLanguage.isoKey]}:`}</div>
              <div>{`${language.phrases['header.totalPrice.yesterday'][defaultLanguage.isoKey]}:`}</div>
            </div>
            <div className={b('content-box-price-number')}>
              <div>{todayTotalPrice.sum}</div>
              <div>{yesterdayTotalPrice.sum}</div>
            </div>
          </div>
          <div
            className={b('content-box-more')}
            onClick={this.handleTotalPriceDrawerVisible}
          >
            <MoreIcon />
          </div>
        </div>
        <Dropdown
          trigger={['click']}
          overlay={this.renderProfileMenu(language, defaultLanguage)}
          className={b('content-box')}
          onVisibleChange={this.handlerDropdownVisible}
        >
          <div>
            <Avatar src={user.avatarUrl || undefined} className={b('content-box-avatar')}>
              {getFirstLetterName(user.firstName, user.lastName)}
            </Avatar>
            <div className={b('content-box-naming')}>
              <h1>{`${user.firstName} ${user.lastName}`}</h1>
            </div>
            {visibleDropdown ? <ArrowUp /> : <ArrowDown />}
          </div>
        </Dropdown>
        {
          totalPriceDrawerVisible && (
            <TotalPriceInfoDrawer
              visible={totalPriceDrawerVisible}
              corporations={corporations}
              onClose={this.handleTotalPriceDrawerVisible}
              defaultLanguage={defaultLanguage}
              language={language}
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
    config: { loader: true },
  })
)(Header);
