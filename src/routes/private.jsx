import React from 'react';
import {
  Route,
  BrowserRouter as Router,
  Switch,
  Redirect,
} from 'react-router-dom';

import {
  Container,
  // BusinessPage,
  // BusinessesList,
  // SingleBusinessPage,
  ProfilePage,
  ProfileMainInfo,
  CorporationsContainer,
  Corporation,
  ProfileEmailScreen,
  FAQ,
} from '../screen';

const privateRouter = ({ user }) => (
  <Router>
    <Container user={user}>
      <Switch>
        <Route path="/corporations" exact component={CorporationsContainer} />
        <Route path="/" exact>
          <Redirect to="/corporations" />
        </Route>
        <Route path="/corporations/single/:id" exact component={Corporation} />
        <Route path="/corporations/add" exact component={Corporation} />
        <Route path="/settings" exact component={CorporationsContainer} />
        <Route path="/help" exact component={FAQ} />
      </Switch>

      <Route
        path="/profile"
        render={() => (
          <ProfilePage>
            <Switch>
              <Route exact path="/profile/mainInfo" component={ProfileMainInfo} />
              <Route exact path="/profile/corporations" component={CorporationsContainer} />
              <Route exact path="/profile/email" component={ProfileEmailScreen} />
              {/* <Route component={NoMatch} /> */}
            </Switch>
          </ProfilePage>
        )}
      />
    </Container>
  </Router>
);

export default privateRouter;
