import React from "react";

import brandLogo from "../../assets/KarmaLogo.png";
import "./index.scss";

const Header = (props) => {
  return (
    <div className="karma-app-header-wrapper">
      <div />
      <div className="karma-app-header-title">{props.title || "Title"}</div>
      <div className="karma-app-header-brand">
        <img className="karma-app-header-logo" src={brandLogo} alt={'brand-logo'}/>
        <div className="karma-app-header-brand-name">Karma Business</div>
      </div>
    </div>
  );
};

export default Header;
