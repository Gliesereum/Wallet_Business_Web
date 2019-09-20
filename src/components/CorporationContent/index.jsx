import React, { Component } from 'react';
import bem from 'bem-join';

import BusinessesList from '../BusinessesList';
import CorporationInfo from '../CorporationInfo';
import WidgetSettings from '../WidgetSettings';

const b = bem('corporationsContent');
const TAB_LIST = {
  branches: 'branches',
  // companyInformation: 'companyInformation',
  // widgetSettings: 'widgetSettings',
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
    activeTab: TAB_LIST.branches,
  };

  handleChangeTab = tabName => () => {
    this.setState({ activeTab: tabName });
  };

  renderTabSwitcher = () => {
    const { activeTab } = this.state;
    const {
      chosenCorporation,
      defaultLanguage,
      phrases,
      isAddCorporationMode,
    } = this.props;
    let content;

    if (isAddCorporationMode) {
      return (
        <CorporationInfo
          isAddCorporationMode
          defaultLanguage={defaultLanguage}
          phrases={phrases}
        />
      );
    }

    switch (activeTab) {
      case TAB_LIST.companyInformation:
        content = (
          <CorporationInfo
            isAddCorporationMode={isAddCorporationMode}
            chosenCorporation={chosenCorporation}
            defaultLanguage={defaultLanguage}
            phrases={phrases}
          />
        );
        break;
      case TAB_LIST.widgetSettings:
        content = (
          <WidgetSettings
            chosenCorporation={chosenCorporation}
            defaultLanguage={defaultLanguage}
            phrases={phrases}
          />
        );
        break;
      case TAB_LIST.businesses:
      default:
        content = (
          <BusinessesList
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
    const { isAddCorporationMode, defaultLanguage, phrases } = this.props;
    const tabs = isAddCorporationMode ? [TAB_LIST.companyInformation] : getTabHeaders();

    return (
      <div className={b()}>
        <div className={b('tabHeader')}>
          {tabs.map(tab => (
            <div
              className={b('tabHeader-tab', { active: (activeTab === tab) || isAddCorporationMode })}
              style={{ width: `${100 / tabs.length}%` }}
              key={tab}
              onClick={this.handleChangeTab(tab)}
            >
              <span className={b('tabHeader-tab-fullPhrase')}>
                {phrases[`company.page.tabs.${tab}.fullPhrase`][defaultLanguage.isoKey]}
              </span>
              <span className={b('tabHeader-tab-lilPhrase')}>
                {phrases[`company.page.tabs.${tab}.lilPhrase`][defaultLanguage.isoKey]}
              </span>
            </div>
          ))}
        </div>
        {this.renderTabSwitcher()}
      </div>
    );
  }
}

export default CorporationContent;
