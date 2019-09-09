import React from 'react';
import bem from 'bem-join';

import {
  Header,
  SideMenu,
  WelcomePage,
} from '../../components';

import { isUserDataFull } from '../../utils';

const b = bem('container');

const Container = ({
  user = {},
  children,
  corporations = [],
}) => (
  <div className={b()}>
    {isUserDataFull(user) && <SideMenu />}
    {isUserDataFull(user) && !(corporations.length) && <WelcomePage />}

    <div className={b('wrapper')}>
      {isUserDataFull(user) && <Header user={user} />}
      <div className={b('layout')}>{children}</div>
    </div>
  </div>
);

export default Container;
