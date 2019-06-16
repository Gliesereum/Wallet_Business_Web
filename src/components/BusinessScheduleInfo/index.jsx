import React, { PureComponent } from 'react';
import bem from 'bem-join';
// import { connect } from 'react-redux';

import { BusinessScheduleForm } from '../Forms';

import './index.scss';

const b = bem('businessScheduleInfo');

class BusinessScheduleInfo extends PureComponent {
  render() {
    const { singleBusiness, changeActiveTab } = this.props;

    return (
      <div className={b()}>
        <h1 className={b('header')}>Дни недели и рабочее время</h1>
        <BusinessScheduleForm
          singleBusiness={singleBusiness}
          changeActiveTab={changeActiveTab}
        />
      </div>
    );
  }
}

export default BusinessScheduleInfo;
