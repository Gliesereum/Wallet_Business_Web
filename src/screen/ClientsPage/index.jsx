import React, { Component } from 'react';
import { connect } from 'react-redux';
import bem from 'bem-join';

const b = bem('clientsPage');

class ClientsPage extends Component {
  state = {
    chosenClient: null,
  };

  changeActiveClient = worker => () => this.setState({ chosenClient: worker });

  render() {
    const { chosenClient } = this.state;

    return (
      <div className={b()}>
        {
          (chosenClient && chosenClient.id) ? (
            <div>ClientInfo</div>
          ) : (
            <div>ClientsList</div>
          )
        }
      </div>
    );
  }
}

export default connect(null)(ClientsPage);
