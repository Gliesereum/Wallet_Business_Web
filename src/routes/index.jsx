import React from 'react';

import PublicRouter from './public';
import PrivateRouter from './private';

const Routes = ({ isPrivateRoute, ...props }) => (isPrivateRoute ? <PrivateRouter {...props} /> : <PublicRouter />);

export default Routes;
