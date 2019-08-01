import React from 'react';
import { Spin } from 'antd';

const ScreenLoading = props => (
  <div className={`karma-app-loading ${props.loading ? 'karma-app-loading-data' : ''}`}>
    <Spin size="large" />
  </div>
);

export default ScreenLoading;
