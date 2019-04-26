import React from "react";
import { Route, BrowserRouter as Router, Switch } from "react-router-dom";

import {
  Container,
  BusinessPage,
  BusinessList,
  SingleBusinessPage,
  AddBusinessPage,
  ProfilePage,
  ProfileMainInfo,
  ProfileCorporations,
  ProfileEmailScreen,
} from "../screen";

const publicRouter = () => (
  <Router>
    <Container>
      <Route path="/business" render={() => (
        <BusinessPage>
          <Switch>
            <Route exact path="/business/list" component={BusinessList} />
            <Route exact path="/business/:id" component={SingleBusinessPage} />
            <Route exact path="/business/add" component={AddBusinessPage} />
          </Switch>
        </BusinessPage>
      )}>
      </Route>

      <Route path="/profile" render={() => (
        <ProfilePage>
          <Switch>
            <Route exact path="/profile/mainInfo" component={ProfileMainInfo} />
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
