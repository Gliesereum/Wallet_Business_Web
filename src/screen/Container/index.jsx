import React from 'react';

import { Header, SideMenu, Footer } from '../../components';

import './index.scss';

const Container = props => (
  <div className="karma-app-wrapped">
    <SideMenu />

    <Header title="Profile" />
    <div className="karma-app-main">
      {props.children}
    </div>
    <Footer />
  </div>
);

export default Container;
