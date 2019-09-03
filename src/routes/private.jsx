import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import {
  Route,
  BrowserRouter as Router,
  Switch,
  Redirect,
} from 'react-router-dom';

import {
  Container,
  BusinessPage,
  ProfileInfo,
  CorporationsPage,
  WorkersPage,
  ClientsPage,
  OrdersPage,
  FAQ,
  AdminPanel,
} from '../screen';
import { actions } from '../state';

class PrivateRouter extends PureComponent {
  render() {
    const { user, auth } = this.props;

    return (
      <Router>
        <Container user={user} {...this.props}>
          {
            (
              user
              && user.firstName
              && user.lastName
              && user.middleName
              && user.country
              && user.city
            ) ? (
              <Switch>
                <Route path="/corporations" exact component={CorporationsPage} />
                <Route path="/orders" exact component={OrdersPage} />
                <Route path="/workers" exact component={WorkersPage} />
                <Route path="/clients" exact component={ClientsPage} />

                {auth.hasAdminRights && <Route path="/adminPanel" exact component={AdminPanel} />}

                <Route path="/profile" exact component={ProfileInfo} />

                <Route path="/help" exact component={FAQ} />

                <Route path={['/business/add', '/business/:id']} exact component={BusinessPage} />

                <Redirect from="*" to="/corporations" />
              </Switch>
              ) : (
                <Switch>
                  <Route render={routeProps => <ProfileInfo {...routeProps} isFirstSignIn />} />
                </Switch>
              )
          }
        </Container>
      </Router>
    );
  }
}

const { $setLanguage } = actions.app;

export default connect(state => state, { $setLanguage })(PrivateRouter);
