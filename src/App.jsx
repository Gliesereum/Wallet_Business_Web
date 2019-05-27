import React, { Component } from 'react';
import { connect } from 'react-redux';
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
    const { appStatus } = this.props.app;
    const { authenticated, user } = this.props.auth;

    switch (appStatus) {
      case 'loading':
        return <ScreenLoading />;
      case 'ready':
        return (
          <AppRouter user={user} isPrivateRoute={authenticated} />
        );
      case 'error':
        return <div>Error</div>;
      // return <ScreenError onReload={this.props.initApp}/>;
      default:
        return <div>Default</div>;
      // return <ScreenError onReload={this.props.initApp}/>;
    }
  }
}

const mapDispatchToProps = dispatch => ({
  startApp: () => dispatch(actions.app.$startApp()),
});

export default withRouter(connect(state => state, mapDispatchToProps)(App));
