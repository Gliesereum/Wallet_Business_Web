import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import {
  Route,
  BrowserRouter as Router,
  Switch,
  Redirect,
} from 'react-router-dom';
import Fullscreen from 'react-full-screen';

import {
  Container,
  BusinessPage,
  ProfileInfo,
  CorporationsPage,
  WorkersPage,
  ClientsPage,
  OrdersPage,
  FAQ,
} from '../screen';
import { actions } from '../state';

class PrivateRouter extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      isFull: false,
    };
  }

  goFull = () => {
    this.setState({ isFull: true });
  };

  render() {
    const { user } = this.props;

    return (
      <Router>
        <Fullscreen enabled={this.state.isFull}>
          <Container fullScreenAction={this.goFull} user={user} {...this.props}>
            {
              (
                user
                && user.firstName
                && user.lastName
                && user.middleName
                && user.country
                && user.city
              ) ? (
                <Switch>
                  <Route path="/corporations" exact component={CorporationsPage} />
                  <Route path="/orders" exact component={OrdersPage} />
                  <Route path="/workers" exact component={WorkersPage} />
                  <Route path="/clients" exact component={ClientsPage} />

                  <Route path="/profile" exact component={ProfileInfo} />

                  <Route path="/help" exact component={FAQ} />

                  <Route path={['/business/add', '/business/:id']} exact component={BusinessPage} />

                  <Redirect from="*" to="/corporations" />
                </Switch>
                ) : (
                  <Switch>
                    <Route component={ProfileInfo} />
                  </Switch>
                )
            }
          </Container>
        </Fullscreen>
      </Router>
    );
  }
}

const { $setLanguage } = actions.app;

export default connect(state => state, { $setLanguage })(PrivateRouter);
