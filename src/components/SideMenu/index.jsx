import React, { Component } from 'react';
import { withRouter, Link } from 'react-router-dom';
import { connect } from 'react-redux';
import compose from 'recompose/compose';
import bem from 'bem-join';

import { Icon } from 'antd';

import { actions } from '../../state';
import {
  MyCorporations,
  Analytics,
  Settings,
  Help,
  Exit,
} from '../../assets/iconComponents';

import './index.scss';

const b = bem('sidebar');

const navbarItems = [
  {
    icon: MyCorporations,
    text: 'Мои компании',
    linkTo: '/corporations',
    canDisabled: true,
  },
  {
    icon: Analytics,
    text: 'Аналитика (Coming Soon)',
    linkTo: '/analytics',
    canDisabled: true,
  },
  {
    icon: Settings,
    text: 'Настройки (Coming Soon)',
    linkTo: '/settings',
    canDisabled: true,
  },
  {
    icon: Help,
    text: 'Помощь',
    linkTo: '/help',
    canDisabled: false,
  },
];

class SideMenu extends Component {
  signOutHandler = () => {
    const { signOut, history } = this.props;
    history.push('/');
    signOut();
  };

  render() {
    const { isUserExist, location } = this.props;

    return (
      <div className={b()}>
        <div className={b('logo')} />
        <div className={b('menu')}>
          {
            navbarItems.map(({
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
                <Icon style={{ color: !isUserExist && canDisabled ? '#485465' : 'white' }} component={icon} />
                <span>{text}</span>
              </Link>
            ))
          }
        </div>
        <div>
          <div className={b('menu-item')} onClick={this.signOutHandler}>
            <Icon style={{ color: 'white' }} component={Exit} />
            <span>Exit</span>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  isUserExist: state.auth.user.firstName,
});

const mapDispatchToProps = dispatch => ({
  signOut: () => dispatch(actions.auth.$signOut()),
});

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
  withRouter,
)(SideMenu);
