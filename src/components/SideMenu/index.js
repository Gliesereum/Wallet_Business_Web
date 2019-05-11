import React, {Component} from 'react';
import {withRouter} from 'react-router-dom';
import {connect} from 'react-redux';

import {Icon, Drawer} from 'antd';

import authActions from '../../state/auth/action';
import {getFirstLetterName} from '../../utils/helperFunc';

import './index.scss';

import defaultDrawerCover from '../../assets/drawer-cover.png';

const ACTIVE_ITEM = {
  BUSINESS_ITEM: '/businessList',
  PROFILE_ITEM: '/profile/mainInfo',
};

class SideMenu extends Component {
  state = {
    visible: false,
  };

  _toggleCollapsed = () => {
    this.setState({visible: !this.state.visible})
  };

  signOutHandler = () => {
    this.props.$signOut();
  };

  handlerMenuClick = (itemName) => {
    this.props.history.push(itemName);
    this._toggleCollapsed();
  };

  render() {
    const {visible} = this.state;
    const {auth, location} = this.props;
    const {BUSINESS_ITEM, PROFILE_ITEM} = ACTIVE_ITEM;

    return (
      <div className="karma-app-sidebar">
        <div
          className="karma-app-sidebar__toggler"
          onClick={this._toggleCollapsed}
        >
          {!visible && <Icon type="double-right"/>}
        </div>
        <Drawer
          placement="left"
          visible={visible}
          closable={false}
          onClose={this._toggleCollapsed}
          width={300}
        >

          <div className="karma-app-sidebar__user-box">
            <img
              src={auth.user.coverUrl || defaultDrawerCover}
              alt=""
            />
            <div className="karma-app-sidebar__avatar-user">
              <div className="karma-app-sidebar__avatar-user-img">
                {auth.user && auth.user.avatarUrl ?
                  <img src={auth.user.avatarUrl} alt=""/>
                  : <span>{getFirstLetterName(auth.user.firstName, auth.user.lastName)}</span>}
              </div>
            </div>
          </div>

          <div
            onClick={() => this.handlerMenuClick(BUSINESS_ITEM)}
            className={`karma-app-sidebar__item ${
              (location.pathname === BUSINESS_ITEM || location.pathname === '/') ? 'active-menu-item' : ''
              }`}
          >
            <Icon type="database"/>
            <span>Мои Бизнесы</span>
          </div>
          <div
            onClick={() => this.handlerMenuClick(PROFILE_ITEM)}
            className={`karma-app-sidebar__item ${location.pathname === PROFILE_ITEM ? 'active-menu-item' : ''}`}
          >
            <Icon type="user"/>
            <span>Профиль</span>
          </div>
          <div
            onClick={this.signOutHandler}
            className="karma-app-sidebar__item"
          >
            <Icon type="export"/>
            <span>Выйти</span>
          </div>
        </Drawer>
      </div>
    );
  }
}

export default withRouter(connect(state => state, {...authActions})(SideMenu));
