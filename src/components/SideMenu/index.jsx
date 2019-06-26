import React, { Component } from 'react';
import { withRouter, Link } from 'react-router-dom';
import { connect } from 'react-redux';
import compose from 'recompose/compose';
import bem from 'bem-join';

import { actions } from '../../state';
import MyCorporations from '../../assets/myCorporations.svg';
import Analytics from '../../assets/analytics.svg';
import Settings from '../../assets/settings.svg';
import Help from '../../assets/help.svg';
import Exit from '../../assets/exit.svg';

import './index.scss';

const b = bem('sidebar');

const navbarItems = [
  {
    icon: MyCorporations,
    text: 'Мои компании',
    linkTo: '/corporations',
  },
  {
    icon: Analytics,
    text: 'Аналитика (Coming Soon)',
    linkTo: '/analytics',
  },
  {
    icon: Settings,
    text: 'Настройки (Coming Soon)',
    linkTo: '/settings',
  },
  {
    icon: Help,
    text: 'Помощь',
    linkTo: '/help',
  },
];

class SideMenu extends Component {
  signOutHandler = () => {
    const { signOut, history } = this.props;
    history.push('/');
    signOut();
  };

  render() {
    return (
      <div className={b()}>
        <div className={b('logo')} />
        <div className={b('menu')}>
          {
            navbarItems.map(({ icon, text, linkTo }) => (
              <Link
                className={b('menu-item', { active: this.props.location.pathname.match(linkTo) })}
                key={text}
                to={linkTo}
              >
                <img src={icon} alt={text} />
                <span>{text}</span>
              </Link>
            ))
          }
        </div>
        <div>
          <div className={b('menu-item')} onClick={this.signOutHandler}>
            <img src={Exit} alt="Exit" />
            <span>Exit</span>
          </div>
        </div>
      </div>
    );
  }
}

const mapDispatchToProps = dispatch => ({
  signOut: () => dispatch(actions.auth.$signOut()),
});

export default compose(
  connect(null, mapDispatchToProps),
  withRouter,
)(SideMenu);
