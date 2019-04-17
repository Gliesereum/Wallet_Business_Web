import React from "react";
import { Route, Switch } from "react-router-dom";

import SignIn from "../screen/SignIn/index";

const publicRouter = () =>
	<Switch>
		<Route path="/" component={SignIn} />
	</Switch>;

export default publicRouter;