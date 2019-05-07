import React from "react";
import { Spin } from "antd";

import "./index.scss";

const ScreenLoading = (props) => (
  <div className={`karma-app-loading ${props.dataLoading ? "karma-app-loading-data" : ""}`}>
    <Spin size="large" style={{ color: "orange" }} />
  </div>
);

export default ScreenLoading;
