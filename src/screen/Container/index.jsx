import React from 'react';
import bem from 'bem-join';

import {
  Header,
  SideMenu,
} from '../../components';
import Footer from '../../components/Footer';

const b = bem('container');

const Container = ({
  user = {}, children, app, $setLanguage,
}) => (
  <div className={b()}>
    {user.firstName && <SideMenu />}

    <div className={b('wrapper')}>
      {user.firstName && <Header user={user} />}
      <div className={b('layout')}>{children}</div>
      <Footer
        langPack={app.langPack}
        setLanguage={$setLanguage}
        defaultLanguage={app.defaultLanguage}
        language={app.language}
        background="#F8F8F8"
      />
    </div>
  </div>
);

export default Container;
