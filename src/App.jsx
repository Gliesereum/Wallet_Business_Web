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
      showWelcomePage,
      defaultLanguage,
      phrases,
      setShowPropWelcomePage,
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
