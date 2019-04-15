import React, { Component } from 'react';
import {connect} from "react-redux";
import {actions} from './state';
import {Route, Switch, Link, withRouter} from "react-router-dom";
import Home from "./screen/Home";
import About from "./screen/About";
import NotFound from "./screen/NotFound";

class App extends Component {
	componentDidMount() {
		const {startApp, socket} = this.props;
		startApp(socket)
	}
	render() {
		return (
			<div>

				<header>
					<nav>
						<Link to={'/'}>
							Home
						</Link>
						<Link to={'/about'}>
							About
						</Link>
					</nav>
				</header>

				<section>
					<Switch>
						<Route
							exact
							path="/"
							component={Home}
						/>
						<Route exact path="/about" component={About}/>
						<Route component={NotFound}/>
					</Switch>
				</section>

				<footer>
					Footer
				</footer>

			</div>
		)
	}
}

const {startApp} = actions.app;

export default withRouter(connect(state => state, { startApp })(App));
