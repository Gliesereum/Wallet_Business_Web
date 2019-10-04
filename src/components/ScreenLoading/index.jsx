import React from 'react';
import bem from 'bem-join';

import { Icon, Spin } from 'antd';

const b = bem('loading');
const antIcon = (
  <Icon
    type="loading"
    className={b('indicator')}
    spin
  />
);

const ScreenLoading = ({ backgroundStyles = {} }) => (
  <div className={b()} style={{ ...backgroundStyles }}>
    <Spin size="large" indicator={antIcon} />
  </div>
);

export default ScreenLoading;
