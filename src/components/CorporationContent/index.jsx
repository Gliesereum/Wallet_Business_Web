import React, { Component } from 'react';

import BusinessesList from '../BusinessesList';

class CorporationContent extends Component {
  state = {
    // activeTab: 'businesses',
  };

  render() {
    const {
      businesses,
      chosenCorporation,
      defaultLanguage,
      phrases,
    } = this.props;

    return (
      <BusinessesList
        businesses={businesses}
        chosenCorporation={chosenCorporation}
        defaultLanguage={defaultLanguage}
        phrases={phrases}
      />
    );
  }
}

export default CorporationContent;
