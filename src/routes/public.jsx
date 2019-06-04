import React from 'react';
import { Route, Switch, Redirect } from 'react-router-dom';

import { SignIn } from '../screen';

const publicRouter = () => (
  <Switch>
    <Route path="/login" component={SignIn} />
    <Route path="/" component={SignIn}>
      <Redirect to="/login" />
    </Route>
  </Switch>
);

export default publicRouter;
