import React from 'react';
import bem from 'bem-join';

import {
  Header,
  SideMenu,
} from '../../components';

const b = bem('container');

const Container = ({ user = {}, children }) => (
  <div className={b()}>
    {user.firstName && <SideMenu />}

    <div className={b('wrapper')}>
      {user.firstName && <Header user={user} />}
      <div className={b('layout')}>{children}</div>
    </div>
  </div>
);

export default Container;
