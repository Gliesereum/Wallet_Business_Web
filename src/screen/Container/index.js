import React, {Component} from 'react';

import {Header, SideMenu, Footer} from '../../components';

import './index.scss';

class Container extends Component {


  render() {
    return (
      <div className="karma-app-wrapped">
        <SideMenu/>

        <Header title="Profile"/>
        <div className="karma-app-main">
          {this.props.children}
        </div>
        <Footer/>
      </div>
    );
  }
}

export default Container;
