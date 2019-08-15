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
} from '../screen';

class PrivateRouter extends PureComponent {
  render() {
    const { user } = this.props;

    return (
      <Router>
        <Container user={user}>
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

                <Route path="/profile" exact component={ProfileInfo} />

                <Route path="/help" exact component={FAQ} />

                <Route path={['/business/add', '/business/:id']} exact component={BusinessPage} />

                <Redirect from="*" to="/corporations" />
              </Switch>
              ) : (
                <Switch>
                  <Route component={ProfileInfo} />
                </Switch>
              )
          }
        </Container>
      </Router>
    );
  }
}

export default PrivateRouter;
