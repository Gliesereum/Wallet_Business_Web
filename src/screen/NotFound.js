import React, {Component, Fragment} from 'react';
import {connect} from "react-redux";
import {withRouter} from "react-router-dom";
import {Helmet} from "react-helmet";

class NotFound extends Component {
	render() {
		return (
			<Fragment>
				<Helmet>
					<title>404 - Page Not Found</title>
				</Helmet>
				<span>
					Page Not Found!
				</span>
			</Fragment>
		)
	}
}

export default withRouter(connect(state => state)(NotFound));
