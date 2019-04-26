import React from "react";
import { Route, Switch } from "react-router-dom";

import BusinessContainer from "../screen/BusinessContainer";

const publicRouter = () =>
  <Switch>
    <Route path="/" component={BusinessContainer} />
  </Switch>;

export default publicRouter;