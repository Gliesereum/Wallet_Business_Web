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

const ScreenLoading = () => (
  <div className={b()}>
    <Spin size="large" indicator={antIcon} />
  </div>
);

export default ScreenLoading;
