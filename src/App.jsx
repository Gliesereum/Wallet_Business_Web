import React, { Component } from 'react';
import { connect } from 'react-redux';
import compose from 'recompose/compose';
import { withRouter } from 'react-router-dom';

import { actions } from './state';
import AppRouter from './routes';
import { ScreenLoading } from './components';

class App extends Component {
  componentDidMount() {
    const { startApp } = this.props;
    startApp();
  }

  render() {
    const { authenticated, user, appStatus } = this.props;

    switch (appStatus) {
      case 'loading':
        return <ScreenLoading />;
      case 'ready':
        return (
          <AppRouter user={user} isPrivateRoute={authenticated} />
        );
      case 'error':
        return <div>Error</div>;
      default:
        return <div>Default</div>;
    }
  }
}
const mapStateToProps = state => ({
  appStatus: state.app.appStatus,
  authenticated: state.auth.authenticated,
  user: state.auth.user,
});

const mapDispatchToProps = dispatch => ({
  startApp: () => dispatch(actions.app.$startApp()),
});

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
  withRouter,
)(App);
