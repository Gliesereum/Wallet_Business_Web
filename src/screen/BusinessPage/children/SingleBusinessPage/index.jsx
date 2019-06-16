import React, { PureComponent } from 'react';
import { connect } from 'react-redux';

import { actions } from '../../../../state';

class SingleBusinessPage extends PureComponent {
  render() {
    return (
      <div>Single Business (OLD COMPONENT)</div>
    );
  }
}

const mapDispatchToProps = dispatch => ({
  updateSchedule: scheduleList => dispatch(actions.business.$updateSchedule(scheduleList)),
});

export default connect(null, mapDispatchToProps)(SingleBusinessPage);
