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
    <Col lg={8} className={b('sidebar')}>
      <SideMenu />
    </Col>
    <Col lg={16}>
      <Header user={user} />
      <div>{children}</div>
    </Col>
    {/* <Footer /> */}
  </Row>
);

export default Container;
