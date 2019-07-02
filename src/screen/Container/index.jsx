import React from 'react';
import bem from 'bem-join';

import { Row, Col } from 'antd';

import {
  Header,
  SideMenu,
} from '../../components';

import './index.scss';

const b = bem('container');

const Container = ({ user, children }) => (
  <Row className={b()}>
    <Col md={2} lg={2} xl={6} className={b('sidebar')}>
      <SideMenu />
    </Col>
    <Col md={22} lg={22} xl={18}>
      {user && user.firstName && <Header user={user} />}
      {children}
    </Col>
  </Row>
);

export default Container;
