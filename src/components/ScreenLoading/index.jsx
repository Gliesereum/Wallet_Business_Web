import React from 'react';
import { Icon, Spin } from 'antd';

const antIcon = <Icon type="loading" style={{ fontSize: 24 }} spin />;

const ScreenLoading = props => (
  <div className={`karma-app-loading ${props.loading ? 'karma-app-loading-data' : ''}`}>
    <Spin size="large" indicator={antIcon} />
  </div>
);

export default ScreenLoading;
