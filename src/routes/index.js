import React from 'react';

import PublicRouter from './public';
import PrivateRouter from './private';

const Routes = ({isPrivateRoute}) => isPrivateRoute ? <PrivateRouter/> : <PublicRouter/>;

export default Routes;
