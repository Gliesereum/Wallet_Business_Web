import React, { Component } from 'react';
import { connect } from 'react-redux';
import bem from 'bem-join';

import {
  CorporationsList,
  CorporationContent,
  EmptyState,
  ContentHeader,
} from '../../components';

const b = bem('corporationsPage');

class CorporationsPage extends Component {
  state = {
    chosenCorporation: null,
    isAddCorporationMode: false,
  };

  handleChangeCorporation = (corporationId, isAddCorporationMode = false) => () => {
    const { corporations } = this.props;
    const [chosenCorporation] = corporations.filter(item => item.id === corporationId);
    this.setState({ chosenCorporation, isAddCorporationMode });
  };

  render() {
    const {
      corporations,
      business: allBusiness,
      defaultLanguage,
      phrases,
    } = this.props;
    const { chosenCorporation, isAddCorporationMode } = this.state;

    return (
      <div className={b()}>
        <ContentHeader
          content={(
            <CorporationsList
              defaultLanguage={defaultLanguage}
              phrases={phrases}
              corporations={corporations}
              changeCorporation={this.handleChangeCorporation}
            />
          )}
          reverseDirection
        />
        {
          corporations && corporations.length ? (
            <>
              {chosenCorporation ? (
                <CorporationContent
                  chosenCorporation={chosenCorporation}
                  businesses={allBusiness.filter(item => item.corporationId === chosenCorporation.id)}
                  isAddCorporationMode={isAddCorporationMode}
                  defaultLanguage={defaultLanguage}
                  phrases={phrases}
                />
              ) : (
                <EmptyState
                  title={phrases['company.page.emptyState.title'][defaultLanguage.isoKey]}
                  descrText={phrases['company.page.emptyState.description'][defaultLanguage.isoKey]}
                  withoutBtn
                />
              )}
            </>
          ) : (
            <EmptyState
              title={phrases['company.page.emptyState.createNewCompany.title'][defaultLanguage.isoKey]}
              descrText={phrases['company.page.emptyState.createNewCompany.description'][defaultLanguage.isoKey]}
              addItemText={phrases['company.button.addNewCompany'][defaultLanguage.isoKey]}
              addItemHandler={this.handleChangeCorporation(null, true)}
            />
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
