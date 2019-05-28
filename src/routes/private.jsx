import React from 'react';
import {
  Route,
  BrowserRouter as Router,
  Switch,
} from 'react-router-dom';

import {
  Container,
  // BusinessPage,
  // BusinessList,
  // SingleBusinessPage,
  ProfilePage,
  ProfileMainInfo,
  CorporationsList,
  ProfileEmailScreen,
} from '../screen';
//
// <Route
//   path="/businessList"
//   render={() => (
//     <BusinessPage>
//       <Switch>
//         <Route exact path="/businessList" component={BusinessList} />
//         <Route exact path="/businessList/:id" component={SingleBusinessPage} />
//       </Switch>
//     </BusinessPage>
//   )}
// />

const privateRouter = ({ user }) => (
  <Router>
    <Container user={user}>
      <Switch>
        <Route path="/" exact component={CorporationsList} />
        <Route path="/corporations" exact component={CorporationsList} />
        <Route path="/analytics" exact component={CorporationsList} />
        <Route path="/settings" exact component={CorporationsList} />
        <Route path="/help" exact component={CorporationsList} />
      </Switch>

      <Route
        path="/profile"
        render={() => (
          <ProfilePage>
            <Switch>
              <Route exact path="/profile/mainInfo" component={ProfileMainInfo} />
              <Route exact path="/profile/corporations" component={CorporationsList} />
              <Route exact path="/profile/email" component={ProfileEmailScreen} />
            </Switch>
          </ProfilePage>
        )}
      />
    </Container>
  </Router>
);

export default privateRouter;
