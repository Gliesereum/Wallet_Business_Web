import React from 'react';
import bem from 'bem-join';

import { Row, Col } from 'antd';

import {
  Header,
  SideMenu,
} from '../../components';

const b = bem('container');

const Container = ({ user = {}, children }) => (
  <Row className={b()}>
    {
      user.firstName && (
        <Col
          md={2}
          lg={2}
          xl={6}
          className={b('sidebar')}
        >
          <SideMenu />
        </Col>
      )
    }

    <Col
      md={user.firstName ? 22 : 24}
      lg={user.firstName ? 22 : 24}
      xl={user.firstName ? 18 : 24}
    >
      {
        user.firstName && <Header user={user} />
      }
      {children}
    </Col>
  </Row>
);

export default Container;
