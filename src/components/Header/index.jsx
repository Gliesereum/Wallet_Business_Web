import React from 'react';
import bem from 'bem-join';
import { Link } from 'react-router-dom';

import {
  Badge, Avatar, Dropdown, Menu, Icon,
} from 'antd';

import Notification from '../../assets/Notification.svg';
import { getFirstLetterName } from '../../utils';

import './index.scss';

const b = bem('header');

const ProfileMenu = () => (
  <Menu className={b('menu')}>
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

const Header = ({ user }) => (
  <div className={b()}>
    <div className={b('content-box')}>
      <Badge
        count={3}
        className={b('notification-box')}
      >
        <img src={Notification} alt="notification" />
      </Badge>
    </div>
    <Dropdown trigger={['click']} overlay={ProfileMenu} className={b('content-box')}>
      <div>
        <Avatar src={user.avatarUrl || undefined} className={b('content-box-avatar')}>
          {getFirstLetterName(user.firstName, user.lastName)}
        </Avatar>
        <div className={b('content-box-naming')}>
          <h1>{`${user.firstName} ${user.lastName}`}</h1>
          <p>trial</p>
        </div>
        <Icon type="down" />
      </div>
    </Dropdown>
  </div>
);

export default Header;
