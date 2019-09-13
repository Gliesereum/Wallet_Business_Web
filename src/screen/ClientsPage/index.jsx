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
    const { corporations, defaultLanguage, phrases } = this.props;

    return (
      <div className={b()}>
        {
          (chosenClient && chosenClient.id) ? (
            <ClientInfo
              chosenClient={chosenClient}
              chosenCorporationId={chosenCorporationId}
              defaultLanguage={defaultLanguage}
              phrases={phrases}
              changeActiveClient={this.changeActiveClient}
            />
          ) : (
            <ClientsList
              corporations={corporations}
              defaultLanguage={defaultLanguage}
              phrases={phrases}
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
  defaultLanguage: state.app.defaultLanguage,
  phrases: state.app.phrases,
});

export default connect(mapStateToProps)(ClientsPage);
