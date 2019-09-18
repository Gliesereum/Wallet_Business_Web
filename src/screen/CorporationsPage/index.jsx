import React, { Component } from 'react';
import { connect } from 'react-redux';
import bem from 'bem-join';

import {
  CorporationsList,
  BusinessesList,
  EmptyState,
  CorporationInfo,
} from '../../components';

const b = bem('corporationsPage');

class CorporationsPage extends Component {
  state = {
    chosenCorporation: null,
    isAddCorporationMode: false,
    viewCorp: null,
  };

  changeActiveCorporation = (corporation, isAddCorporationMode) => () => this.setState({
    chosenCorporation: corporation,
    isAddCorporationMode,
  });

  chooseCorporationForView = (corpId) => {
    if (!corpId) return;

    const [viewCorp] = this.props.corporations.filter(item => item.id === corpId);
    this.setState({ viewCorp });
  };

  render() {
    const {
      corporations,
      business: allBusiness,
      defaultLanguage,
      phrases,
    } = this.props;
    const { chosenCorporation, isAddCorporationMode, viewCorp } = this.state;

    return (
      <div className={b()}>
        {
          isAddCorporationMode || (chosenCorporation && chosenCorporation.id) ? (
            <CorporationInfo
              defaultLanguage={defaultLanguage}
              phrases={phrases}
              isAddMode={isAddCorporationMode}
              corporations={corporations}
              chosenCorporation={chosenCorporation}
              changeActiveCorporation={this.changeActiveCorporation}
            />
          ) : (
            <>
              {
                corporations && corporations.length ? (
                  <>
                    <CorporationsList
                      defaultLanguage={defaultLanguage}
                      phrases={phrases}
                      viewCorp={viewCorp}
                      corporations={corporations}
                      changeActiveCorporation={this.changeActiveCorporation}
                      chooseCorporationForView={this.chooseCorporationForView}
                    />
                    {
                      viewCorp ? (
                        <BusinessesList
                          defaultLanguage={defaultLanguage}
                          phrases={phrases}
                          viewCorp={viewCorp}
                          business={allBusiness.filter(item => item.corporationId === viewCorp.id)}
                        />
                      ) : (
                        <EmptyState
                          title={phrases['company.page.emptyState.title'][defaultLanguage.isoKey]}
                          descrText={phrases['company.page.emptyState.description'][defaultLanguage.isoKey]}
                          withoutBtn
                        />
                      )
                    }
                  </>
                ) : (
                  <div className={b('empty')}>
                    <div className={b('header')}>
                      <h1 className={b('header-title')}>
                        {phrases['company.page.tabs.companyInformation.fullPhrase'][defaultLanguage.isoKey]}
                      </h1>
                    </div>
                    <EmptyState
                      title={phrases['company.page.emptyState.createNewCompany.title'][defaultLanguage.isoKey]}
                      descrText={phrases['company.page.emptyState.createNewCompany.description'][defaultLanguage.isoKey]}
                      addItemText={phrases['company.button.addNewCompany'][defaultLanguage.isoKey]}
                      addItemHandler={this.changeActiveCorporation}
                    />
                  </div>
                )
              }
            </>
          )
        }
      </div>
    );
  }
}

const mapStateToProps = state => ({
  defaultLanguage: state.app.defaultLanguage,
  phrases: state.app.phrases,
  corporations: state.corporations.corporations,
  business: state.business.business,
});

export default connect(mapStateToProps)(CorporationsPage);
