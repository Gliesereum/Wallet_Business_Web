import React, {Component} from 'react';
import {Helmet} from "react-helmet";
import {connect} from "react-redux";
import {withRouter} from 'react-router-dom';

import {Button} from "antd";


class About extends Component {
  render() {
    return (
      <div className="animated fadeIn">
        <Helmet>
          <title>About Screen!</title>
        </Helmet>
        <span>About Screen!</span><br/>
        <Button type={"primary"} size={"default"}>Войти</Button>
      </div>
    )
  }
}

export default withRouter(connect(state => state)(About));
