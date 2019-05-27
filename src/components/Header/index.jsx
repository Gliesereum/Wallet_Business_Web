import React from 'react';
import bem from 'bem-join';

import {
  Badge, Avatar, Dropdown, Menu, Icon,
} from 'antd';

import Notification from '../../assets/Notification.svg';
import { getFirstLetterName } from '../../utils';

import './index.scss';

const b = bem('header');

// { /* <div className="karma-app-header-wrapper"> */ }
// { /*  <div /> */ }
// { /*  <div className="karma-app-header-title">{props.title || 'Title'}</div> */ }
// { /*  <div className="karma-app-header-brand"> */ }
// { /*    <img className="karma-app-header-logo" src={brandLogo} alt="brand-logo" /> */ }
// { /*    <div className="karma-app-header-brand-name">Karma Business</div> */ }
// { /*  </div> */ }
// { /* </div> */ }
const ProfileMenu = () => (
  <Menu>
    <Menu.Item>Item 1</Menu.Item>
    <Menu.Item>Item 2</Menu.Item>
    <Menu.Item>Item 3</Menu.Item>
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
          {/* TODO: add app type for each person */}
          <p>trial</p>
        </div>
        <Icon type="down" />
      </div>
    </Dropdown>
  </div>
);

export default Header;
