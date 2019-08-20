import React from 'react';
import bem from 'bem-join';

import { Divider } from 'antd';

const b = bem('footer');

const Footer = ({ background }) => (
  <div
    className={b()}
    style={{
      backgroundColor: background || 'transparent',
    }}
  >
    <div className={b('links')}>
      <a href="https://coupler.app/terms">Условия использования</a>
      <Divider type="vertical" />
      <a href="https://coupler.app/policy">Политика конфиденциальности</a>
    </div>
    <div>
      <span className={b('text')}>All rights reserved. Copyright &copy; 2019 &nbsp;</span>
      <a
        className={b('text')}
        href="https://www.gliesereum.com/"
        target="_blank"
      >
        Gliesereum Ukraine
      </a>
    </div>
  </div>
);

export default Footer;
