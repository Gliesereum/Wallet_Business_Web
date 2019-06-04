import React from 'react';
import { Link, withRouter } from 'react-router-dom';

import { Icon } from 'antd';

import './index.scss';

const links = [
  {
    toPath: '/profile/mainInfo',
    iconType: 'solution',
    linkText: 'Основная информация',
  },
  {
    toPath: '/profile/corporations',
    iconType: 'bank',
    linkText: 'Компании',
  },
  {
    toPath: '/profile/email',
    iconType: 'mail',
    linkText: 'Электронная почта',
  },
];

const ProfilePage = (props) => {
  const { pathname } = props.location;

  return (
    <div className="karma-app-profile">
      <div className="karma-app-profile-navBox">
        {
          links.map(({ toPath, iconType, linkText }) => (
            <Link
              className={
                `karma-app-profile-navBox-item ${pathname === toPath ? 'karma-app-profile-navBox-item-active' : ''}`
              }
              to={toPath}
              key={iconType}
            >
              <Icon type={iconType} />
              <span className="karma-app-profile-navBox-item-text">
                {linkText}
              </span>
            </Link>
          ))
        }
      </div>
      <div className="karma-app-profile-contentBox">
        {props.children}
      </div>
    </div>
  );
};

export default withRouter(ProfilePage);
