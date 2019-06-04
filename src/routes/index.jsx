import React from 'react';

import PublicRouter from './public';
import PrivateRouter from './private';

const Routes = ({ isPrivateRoute, user }) => (isPrivateRoute ? <PrivateRouter user={user} /> : <PublicRouter />);

export default Routes;
