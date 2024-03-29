import React, { Component } from 'react';
import { withRouter, Link } from 'react-router-dom';
import { connect } from 'react-redux';
import compose from 'recompose/compose';
import bem from 'bem-join';

import {
  Icon,
  Select,
} from 'antd';

import { actions } from '../../state';
import {
  MyCorporations,
  Orders,
  // Analytics,
  Workers,
  Clients,
  // Settings,
  Help,
  Exit,
  ProfileIcon,
} from '../../assets/iconComponents';

const b = bem('sidebar');
const { Option } = Select;

class SideMenu extends Component {
  signOutHandler = () => {
    const { signOut, history } = this.props;
    history.push('/');
    signOut();
  };

  render() {
    const {
      isUserExist,
      location,
      phrases,
      langPack,
      defaultLanguage,
      hasAdminRights,
      setLanguage,
      onCloseSideBar,
    } = this.props;

    const mainMenuItems = [
      {
        icon: MyCorporations,
        // text: phrases['sideBar.menu.company.label'][defaultLanguage.isoKey],
        text: phrases['sideBar.menu.businesses.label'][defaultLanguage.isoKey],
        // linkTo: '/corporations',
        linkTo: '/businesses',
        canDisabled: true,
      },
      {
        icon: Orders,
        text: phrases['sideBar.menu.orders.label'][defaultLanguage.isoKey],
        linkTo: '/orders',
      },
      {
        icon: Workers,
        text: phrases['sideBar.menu.employees.label'][defaultLanguage.isoKey],
        linkTo: '/workers',
      },
      {
        icon: Clients,
        text: phrases['sideBar.menu.clients.label'][defaultLanguage.isoKey],
        linkTo: '/clients',
      },
    ];

    const supportMenuItems = [
      {
        icon: Help,
        text: phrases['sideBar.menu.help.label'][defaultLanguage.isoKey],
        linkTo: '/help',
        canDisabled: false,
      },
    ];

    hasAdminRights && supportMenuItems.push({
      icon: Clients,
      text: 'Admin Panel',
      linkTo: '/adminPanel',
    });

    return (
      <div className={b()}>
        <div className={b('logo')} />
        <div
          className={b('menu', { profile: true })}
          onClick={onCloseSideBar}
        >
          <Link
            className={b('menu-item', { active: location.pathname.match('/profile'), disabled: !isUserExist })}
            key="profile"
            to="/profile"
          >
            <Icon
              className={b('menu-item-icon', { active: location.pathname.match('/profile'), disabled: !isUserExist })}
              style={{ color: !isUserExist ? '#485465' : 'white' }}
              component={ProfileIcon}
            />
            <span>{phrases['sideBar.menu.profile.label'][defaultLanguage.isoKey]}</span>
          </Link>
        </div>
        <div
          className={b('menu')}
          onClick={onCloseSideBar}
        >
          {
            mainMenuItems.map(({
              icon,
              text,
              linkTo,
              canDisabled,
            }) => (
              <Link
                className={b('menu-item', { active: location.pathname.match(linkTo), disabled: !isUserExist && canDisabled })}
                key={text}
                to={linkTo}
              >
                <Icon
                  className={b('menu-item-icon', { active: location.pathname.match(linkTo), disabled: !isUserExist && canDisabled })}
                  style={{ color: !isUserExist && canDisabled ? '#485465' : 'white' }}
                  component={icon}
                />
                <span>{text}</span>
              </Link>
            ))
          }
        </div>
        <div
          className={b('menu')}
          onClick={onCloseSideBar}
        >
          {
            supportMenuItems.map(({
              icon,
              text,
              linkTo,
              canDisabled,
            }) => (
              <Link
                className={b('menu-item', { active: location.pathname.match(linkTo), disabled: !isUserExist && canDisabled })}
                key={text}
                to={linkTo}
              >
                <Icon
                  style={{ color: !isUserExist && canDisabled ? '#485465' : 'white' }}
                  component={icon}
                />
                <span>{text}</span>
              </Link>
            ))
          }
        </div>
        <div className={b('exit')}>
          <div className={b('menu-item')} onClick={this.signOutHandler}>
            <Icon style={{ color: 'white' }} component={Exit} />
            <span>{phrases['sideBar.menu.logOut.label'][defaultLanguage.isoKey]}</span>
          </div>
        </div>
        <div className={b('languages')}>
          <Select
            defaultValue={JSON.stringify(defaultLanguage)}
            className={b('languages-selector')}
            onChange={setLanguage}
          >
            {
              langPack.map(lang => (
                <Option
                  key={lang.isoKey}
                  value={JSON.stringify(lang)}
                >
                  {lang.label}
                </Option>
              ))
            }
          </Select>
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  defaultLanguage: state.app.defaultLanguage,
  phrases: state.app.phrases,
  langPack: state.app.langPack,
  isUserExist: state.auth.user.firstName,
  hasAdminRights: state.auth.hasAdminRights,
});

const mapDispatchToProps = dispatch => ({
  signOut: () => dispatch(actions.auth.$signOut()),
  setLanguage: language => dispatch(actions.app.$setLanguage(language)),
});

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
  withRouter,
)(SideMenu);
