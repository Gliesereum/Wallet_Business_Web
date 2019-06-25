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
  CorporationsContainer,
  Corporation,
  // ProfileEmailScreen,
  FAQ,
} from '../screen';

const privateRouter = ({ user }) => (
  <Router>
    <Container user={user}>
      <Switch>
        <Route path={['/', '/login']} exact>
          <Redirect to="/corporations" />
        </Route>
        <Route path="/corporations" exact component={CorporationsContainer} />
        <Route path={['/corporations/add', '/corporations/:id']} exact component={Corporation} />

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
