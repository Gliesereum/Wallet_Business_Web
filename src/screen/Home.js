import React, { Component } from 'react';
import {Helmet} from "react-helmet";
import {connect} from "react-redux";
import {withRouter} from 'react-router-dom';

class Home extends Component {
	render() {
		return (
			<div className="animated fadeIn">
				<Helmet>
					<title>Home Screen!</title>
				</Helmet>
				<span>
					Home Screen!
				</span>
			</div>
		)
	}
}

export default withRouter(connect(state => state)(Home));
