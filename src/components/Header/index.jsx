import React, { Component } from 'react';
import bem from 'bem-join';
import { Link } from 'react-router-dom';

import {
  // Badge,
  Avatar,
  Dropdown,
  Menu,
  Icon,
} from 'antd';

// import Notification from '../../assets/Notification.svg';
import { ArrowDown, ArrowUp } from '../../assets/iconComponents';
import { getFirstLetterName } from '../../utils';

const b = bem('header');

class Header extends Component {
  state = {
    visibleDropdown: false,
  };

  handlerDropdownVisible = () => this.setState(prevState => ({ visibleDropdown: !prevState.visibleDropdown }));

  renderProfileMenu = () => (
    <Menu
      className={b('menu')}
      onClick={this.handlerDropdownVisible}
    >
      <Menu.Item
        className={b('menu-item')}
      >
        <Link to="/profile">
          <Icon type="user" />
          <span className={b('menu-item-text')}>Мой профиль</span>
        </Link>
      </Menu.Item>
      <Menu.Item
        disabled
        className={b('menu-item')}
      >
        <Icon type="safety-certificate" />
        <span className={b('menu-item-text')}>
          Личный помощник
          <div className={b('menu-item-indicator')}>for premium</div>
        </span>
      </Menu.Item>
    </Menu>
  );

  render() {
    const { user } = this.props;
    const { visibleDropdown } = this.state;

    return (
      <div className={b()}>
        {/* <div className={b('content-box')}> */}
        {/*  <Badge */}
        {/*    count={3} */}
        {/*    className={b('notification-box')} */}
        {/*  > */}
        {/*    <img src={Notification} alt="notification" /> */}
        {/*  </Badge> */}
        {/* </div> */}
        <Dropdown
          trigger={['click']}
          overlay={this.renderProfileMenu}
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
      </div>
    );
  }
}

export default Header;
