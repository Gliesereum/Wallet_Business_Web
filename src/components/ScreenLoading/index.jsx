import React from 'react';
import { Spin } from 'antd/lib/index';

import './index.scss';

const ScreenLoading = props => (
  <div className={`karma-app-loading ${props.loading ? 'karma-app-loading-data' : ''}`}>
    <Spin size="large" />
  </div>
);

export default ScreenLoading;
