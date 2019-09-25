import React, { Component } from 'react';
import { connect } from 'react-redux';
import compose from 'recompose/compose';
import { withRouter } from 'react-router-dom';

import { actions } from './state';
import AppRouter from './routes';
import { ScreenLoading } from './components';
import { ErrorScreen } from './screen';

class App extends Component {
  componentDidMount() {
    this.props.startApp();
  }

  render() {
    const {
      user,
      authenticated,
      appStatus,
      status,
      hasAdminRights,
      showWelcomePage,
      defaultLanguage,
      phrases,
      setShowPropWelcomePage,
    } = this.props;

    if (appStatus === 'loading') return <ScreenLoading />;

    if (appStatus === 'error') {
      let statusTitle = '';
      if (status >= 500) statusTitle = 'Server Error';
      if (status >= 400) statusTitle = 'Page Not Found';

      return (
        <ErrorScreen
          status={status}
          statusTitle={statusTitle}
        />
      );
    }
    return (
      <AppRouter
        user={user}
        isPrivateRoute={authenticated}
        hasAdminRights={hasAdminRights}
        showWelcomePage={showWelcomePage}
        defaultLanguage={defaultLanguage}
        phrases={phrases}
        setShowPropWelcomePage={setShowPropWelcomePage}
      />
    );
  }
}
const mapStateToProps = state => ({
  appStatus: state.app.appStatus,
  status: state.app.status,
  authenticated: state.auth.authenticated,
  hasAdminRights: state.auth.hasAdminRights,
  showWelcomePage: state.auth.showWelcomePage,
  user: state.auth.user,
  defaultLanguage: state.app.defaultLanguage,
  phrases: state.app.phrases,
});

const mapDispatchToProps = dispatch => ({
  startApp: () => dispatch(actions.app.$startApp()),
  setShowPropWelcomePage: (show, wasShown) => dispatch(actions.auth.$setShowPropWelcomePage(show, wasShown)),
});


export default compose(
  connect(mapStateToProps, mapDispatchToProps),
  withRouter,
)(App);
