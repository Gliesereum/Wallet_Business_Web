import React from 'react';
import bem from 'bem-join';

import { Row, Col } from 'antd';

import {
  Header,
  SideMenu,
  // Footer,
} from '../../components';

import './index.scss';

const b = bem('container');

const Container = ({ user, children }) => (
  <Row className={b()}>
    <Col md={2} lg={2} xl={6} className={b('sidebar')}>
      <SideMenu />
    </Col>
    <Col md={22} lg={22} xl={18}>
      <Header user={user} />
      {children}
    </Col>
    {/* <Footer /> */}
  </Row>
);

export default Container;
