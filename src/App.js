import React, { Component } from 'react';
import {connect} from "react-redux";
import {actions} from './state';
import {withRouter} from "react-router-dom";

import AppRouter from './routes';
import { ScreenLoading } from './screen';

class App extends Component {

	componentDidMount() {
		const { startApp } = this.props;
		startApp();
	}

	render() {
		const { appStatus, dataLoading } = this.props.app;
		const { authenticated } = this.props.auth;

		switch (appStatus) {
			case 'loading':
				return <ScreenLoading />;
			case 'ready':
				return (
						<>
							{dataLoading && <ScreenLoading dataLoading={dataLoading} />}
							<AppRouter isPrivateRoute={authenticated} />
						</>
					);
			case 'error':
				return <div>Error</div>;
				// return <ScreenError onReload={this.props.initApp}/>;
			default:
				return <div>Default</div>;
				// return <ScreenError onReload={this.props.initApp}/>;
		}
	}
}

const { startApp } = actions.app;

export default withRouter(connect(state => state, { startApp })(App));
