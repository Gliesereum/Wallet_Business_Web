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
  showWelcomePage,
  defaultLanguage,
  phrases,
  setShowPropWelcomePage,
}) => (
  <div className={b()}>
    {isUserDataFull(user) && <SideMenu />}
    {
      showWelcomePage && (
        <WelcomePage
          setShowPropWelcomePage={setShowPropWelcomePage}
          defaultLanguage={defaultLanguage}
          phrases={phrases}
        />
      )
    }

    <div className={b('wrapper')}>
      {isUserDataFull(user) && <Header user={user} />}
      <div className={b('layout')}>{children}</div>
    </div>
  </div>
);

export default Container;
