import React, { PureComponent } from 'react';
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

import { isUserDataFull } from '../utils';

class PrivateRouter extends PureComponent {
  render() {
    const {
      user,
      hasAdminRights,
    } = this.props;

    return (
      <Router>
        <Container
          user={user}
          {...this.props}
        >
          {
            isUserDataFull(user)
              ? (
                <Switch>
                  <Route path="/corporations" exact component={CorporationsPage} />
                  <Route path="/orders" exact component={OrdersPage} />
                  <Route path="/workers" exact component={WorkersPage} />
                  <Route path="/clients" exact component={ClientsPage} />

                  {hasAdminRights && <Route path="/adminPanel" exact component={AdminPanel} />}

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

export default PrivateRouter;
