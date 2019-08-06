import React, { Component } from 'react';
import { connect } from 'react-redux';
import bem from 'bem-join';

import { ClientInfo, ClientsList } from '../../components';

const b = bem('clientsPage');

class ClientsPage extends Component {
  state = {
    chosenClient: null,
    chosenCorporationId: null,
  };

  changeActiveClient = client => () => this.setState({ chosenClient: client });

  changeChoseCorporationId = corporationId => this.setState({ chosenCorporationId: corporationId });

  render() {
    const { chosenClient, chosenCorporationId } = this.state;
    const { corporations } = this.props;

    return (
      <div className={b()}>
        {
          (chosenClient && chosenClient.id) ? (
            <ClientInfo
              chosenClient={chosenClient}
              chosenCorporationId={chosenCorporationId}
              changeActiveClient={this.changeActiveClient}
            />
          ) : (
            <ClientsList
              corporations={corporations}
              changeActiveClient={this.changeActiveClient}
              changeChoseCorporationId={this.changeChoseCorporationId}
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
