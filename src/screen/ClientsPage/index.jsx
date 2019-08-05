import React, { Component } from 'react';
import { connect } from 'react-redux';
import bem from 'bem-join';

import { ClientInfo, ClientsList } from '../../components';

const b = bem('clientsPage');

class ClientsPage extends Component {
  state = {
    chosenClient: null,
  };

  changeActiveClient = client => () => this.setState({ chosenClient: client });

  render() {
    const { chosenClient } = this.state;
    const { corporations } = this.props;

    return (
      <div className={b()}>
        {
          (chosenClient && chosenClient.id) ? (
            <ClientInfo
              chosenClient={chosenClient}
              changeActiveClient={this.changeActiveClient}
            />
          ) : (
            <ClientsList
              corporations={corporations}
              changeActiveClient={this.changeActiveClient}
            />
          )
        }
      </div>
    );
  }
}

const mapStateToProps = state => ({
  corporations: state.corporations.corporations,
});

export default connect(mapStateToProps)(ClientsPage);
