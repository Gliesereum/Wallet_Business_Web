import React from 'react';
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
  FAQ,
} from '../screen';

const privateRouter = ({ user }) => (
  <Router>
    <Container user={user}>
      <Switch>
        {/* <Route path={['/', '/login', '/analytics', '/profile']} exact> */}
        {/*  <Redirect to={(user && user.firstName) ? '/corporations' : '/profile'} /> */}
        {/* </Route> */}

        <Route path="/corporations" exact component={CorporationsPage} />
        <Route path="/workers" exact component={WorkersPage} />
        <Route path="/clients" exact component={ClientsPage} />

        <Route path="/settings" exact>
          <Redirect to="/corporations" />
        </Route>
        <Route path="/analytics" exact>
          <Redirect to="/corporations" />
        </Route>

        <Route path="/profile" exact component={ProfileInfo} />

        <Route path="/help" exact component={FAQ} />

        <Route path={['/business/add', '/business/:id']} exact component={BusinessPage} />
      </Switch>
    </Container>
  </Router>
);

export default privateRouter;
