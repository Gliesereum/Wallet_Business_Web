import React from 'react';
import { Link } from 'react-router-dom';

import brandLogo from '../../assets/KarmaLogo.png';

import './index.scss';

class Footer extends React.Component {
  render() {
    return (
      <div className="karma-app-footer">
        <div className="karma-app-footer-wrapper">
          <div className="karma-app-footer-wrapper-descr">
            Bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla.
            Bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla.
          </div>
          <div className="karma-app-footer-wrapper-links">
            <Link to="/profile/mainInfo">Профиль </Link>
            <Link to="/business">Мои бизнесы</Link>
          </div>
          <div className="karma-app-footer-wrapper-links">
            <Link to="/">FAQ</Link>
            <Link to="/profile">Contact Us </Link>
          </div>
          <div className="karma-app-footer-wrapper-brand">
            <img className="karma-app-footer-wrapper-brand-logo" src={brandLogo} alt=""/>
            <div className="karma-app-footer-wrapper-brand-name">Karma Business</div>
          </div>
        </div>
        <div className="karma-app-footer-rightsBlock">
          <p>©Copyright. All rights reserved</p>
        </div>
      </div>
    )
  }
}

export default Footer;
