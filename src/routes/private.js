import React from 'react';
import {
  Route,
  BrowserRouter as Router,
  Switch,
} from 'react-router-dom';

import {
  Container,
  BusinessPage,
  BusinessList,
  SingleBusinessPage,
  ProfilePage,
  ProfileMainInfo,
  ProfileCorporations,
  ProfileEmailScreen,
} from '../screen';

const publicRouter = () => (
  <Router>
    <Container>
      <Route path="/businessList" render={() => (
        <BusinessPage>
          <Switch>
            <Route exact path="/businessList" component={BusinessList} />
            <Route exact path="/businessList/:id" component={SingleBusinessPage} />
          </Switch>
        </BusinessPage>
      )}>
      </Route>

      <Route path="/profile" render={() => (
        <ProfilePage>
          <Switch>
            <Route exact path="/profile/mainInfo" component={ProfileMainInfo}/>
            <Route exact path="/profile/corporations" component={ProfileCorporations}/>
            <Route exact path="/profile/email" component={ProfileEmailScreen}/>
          </Switch>
        </ProfilePage>
      )}>
      </Route>
    </Container>
  </Router>
);

export default publicRouter;
