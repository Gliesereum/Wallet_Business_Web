import React, { Component } from 'react';
import bem from 'bem-join';

import BusinessesList from '../BusinessesList';

const b = bem('corporationsContent');
const TAB_LIST = {
  businesses: 'businesses',
  corporationInfo: 'corporationInfo',
};

const getTabHeaders = () => {
  const tabs = [];
  for (const key in TAB_LIST) {
    tabs.push(key);
  }

  return tabs;
};

class CorporationContent extends Component {
  state = {
    activeTab: TAB_LIST.businesses,
  };

  handleChangeTab = tabName => () => {
    this.setState({ activeTab: tabName });
  };

  renderTabSwitcher = () => {
    const { activeTab } = this.state;
    const {
      businesses,
      chosenCorporation,
      defaultLanguage,
      phrases,
    } = this.props;
    let content;

    switch (activeTab) {
      case TAB_LIST.businesses:
      default:
        content = (
          <BusinessesList
            businesses={businesses}
            chosenCorporation={chosenCorporation}
            defaultLanguage={defaultLanguage}
            phrases={phrases}
          />
        );
        break;
    }

    return content;
  };

  render() {
    const { activeTab } = this.state;
    const tabs = getTabHeaders();

    return (
      <div className={b()}>
        <div className={b('tabHeader')}>
          {tabs.map(tab => (
            <div
              className={b('tabHeader-tab', { active: activeTab === tab })}
              style={{ width: `${100 / tabs.length}%` }}
              key={tab}
              onClick={this.handleChangeTab(tab)}
            >
              <span>{tab}</span>
            </div>
          ))}
        </div>
        {this.renderTabSwitcher()}
      </div>
    );
  }
}

export default CorporationContent;
