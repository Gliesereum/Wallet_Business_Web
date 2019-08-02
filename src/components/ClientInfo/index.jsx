import React, { Component } from 'react';
import bem from 'bem-join';

const b = bem('clientInfo');

class ClientInfo extends Component {
  state = {

  };

  render() {
    return (
      <div className={b()}>ClientInfo</div>
    );
  }
}

export default ClientInfo;
