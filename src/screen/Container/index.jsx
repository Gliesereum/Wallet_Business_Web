import React from 'react';
import bem from 'bem-join';
import { Helmet } from 'react-helmet';

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
    <Helmet>
      <meta charSet="utf-8" />
      <meta name="viewport" content="width=1024, initial-scale=1.0, shrink-to-fit=no" />
      <title>Coupler Business</title>
    </Helmet>
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
