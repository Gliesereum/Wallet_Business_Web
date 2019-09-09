import React from 'react';

import PublicRouter from './public';
import PrivateRouter from './private';

const Routes = ({
  isPrivateRoute,
  user,
  // corporations,
  hasAdminRights,
}) => (
  isPrivateRoute
    ? (
      <PrivateRouter
        // corporations={corporations}
        user={user}
        hasAdminRights={hasAdminRights}
      />
    ) : (
      <PublicRouter />
    )
);

export default Routes;
