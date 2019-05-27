import React from 'react';

import { Header, SideMenu, Footer } from '../../components';

import './index.scss';

const Container = ({ user, children }) => (
  <div className="karma-app-wrapped">
    <SideMenu />

    <Header user={user} />
    <div className="karma-app-main">
      {children}
    </div>
    <Footer />
  </div>
);

export default Container;
