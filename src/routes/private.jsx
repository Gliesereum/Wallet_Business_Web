import React from 'react';
import {
  Route,
  BrowserRouter as Router,
  Switch,
} from 'react-router-dom';

import {
  Container,
  // BusinessPage,
  // BusinessesList,
  // SingleBusinessPage,
  ProfilePage,
  ProfileMainInfo,
  CorporationsContainer,
  ProfileEmailScreen,
} from '../screen';
//
// <Route
//   path="/businessList"
//   render={() => (
//     <BusinessPage>
//       <Switch>
//         <Route exact path="/businessList" component={BusinessesList} />
//         <Route exact path="/businessList/:id" component={SingleBusinessPage} />
//       </Switch>
//     </BusinessPage>
//   )}
// />

const privateRouter = ({ user }) => (
  <Router>
    <Container user={user}>
      <Switch>
        <Route path="/" exact component={CorporationsContainer} />
        <Route path="/corporations" exact component={CorporationsContainer} />
        <Route path="/analytics" exact component={CorporationsContainer} />
        <Route path="/settings" exact component={CorporationsContainer} />
        <Route path="/help" exact component={CorporationsContainer} />
      </Switch>

      <Route
        path="/profile"
        render={() => (
          <ProfilePage>
            <Switch>
              <Route exact path="/profile/mainInfo" component={ProfileMainInfo} />
              <Route exact path="/profile/corporations" component={CorporationsContainer} />
              <Route exact path="/profile/email" component={ProfileEmailScreen} />
            </Switch>
          </ProfilePage>
        )}
      />
    </Container>
  </Router>
);

export default privateRouter;
