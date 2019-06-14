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
  // BusinessesList,
  // SingleBusinessPage,
  // ProfilePage,
  // ProfileMainInfo,
  CorporationsContainer,
  Corporation,
  // ProfileEmailScreen,
  FAQ,
} from '../screen';

const privateRouter = ({ user }) => (
  <Router>
    <Container user={user}>
      <Switch>
        <Route path="/" exact>
          <Redirect to="/corporations" />
        </Route>
        <Route path="/corporations" exact component={CorporationsContainer} />
        <Route path={['/corporations/add', '/corporations/:id']} exact component={Corporation} />

        <Route path="/settings" exact component={FAQ} />
        <Route path="/help" exact component={FAQ} />

        <Route path={['/business/add', '/business/:id']} exact component={BusinessPage} />
      </Switch>
    </Container>
  </Router>
);

export default privateRouter;
