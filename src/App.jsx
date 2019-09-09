import React, { Component } from 'react';
import { connect } from 'react-redux';
import compose from 'recompose/compose';
import { withRouter } from 'react-router-dom';

import { actions } from './state';
import AppRouter from './routes';
import { ScreenLoading } from './components';

class App extends Component {
  componentDidMount() {
    this.props.startApp();
  }

  render() {
    const {
      user,
      authenticated,
      appStatus,
      hasAdminRights,
      corporations,
    } = this.props;

    if (appStatus === 'loading') return <ScreenLoading />;

    if (appStatus === 'error') {
      return (
        <div className="CouplerErrorPageBeta">
          <div className="CouplerErrorPageBeta_Title">
            <h1>500</h1>
          </div>
          <div className="CouplerErrorPageBeta_Message">
            <span>SERVER ERROR</span>
          </div>
          <div className="CouplerErrorPageBeta_Button">
            <button type="button" onClick={() => window.location.reload()}>
              Reload
            </button>
          </div>
        </div>
      );
    }
    return (
      <AppRouter
        user={user}
        isPrivateRoute={authenticated}
        hasAdminRights={hasAdminRights}
        corporations={corporations}
      />
    );
  }
}
const mapStateToProps = state => ({
  appStatus: state.app.appStatus,
  authenticated: state.auth.authenticated,
  hasAdminRights: state.auth.hasAdminRights,
  user: state.auth.user,
  corporations: state.corporations.corporations,
});

const mapDispatchToProps = dispatch => ({
  startApp: () => dispatch(actions.app.$startApp()),
});


export default compose(
  connect(mapStateToProps, mapDispatchToProps),
  withRouter,
)(App);
