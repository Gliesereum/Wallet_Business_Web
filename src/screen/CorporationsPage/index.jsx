import React, { Component } from 'react';
import { connect } from 'react-redux';
import bem from 'bem-join';

// import { Button } from 'antd';

import {
  // CorporationsList,
  CorporationContent,
  EmptyState,
  ContentHeader,
} from '../../components';

// import { AddIconSmall } from '../../assets/iconComponents';


const b = bem('corporationsPage');

class CorporationsPage extends Component {
  state = {
    chosenCorporation: null,
    isAddCorporationMode: false,
  };

  componentDidMount() {
    const { corporations } = this.props;

    if (corporations && corporations.length) {
      this.handleChangeCorporation(corporations[0].id, false)();
    }
  }

  handleChangeCorporation = (corporationId, isAddCorporationMode = false) => () => {
    const { corporations } = this.props;
    const [chosenCorporation] = corporations.filter(item => item.id === corporationId);
    this.setState({ chosenCorporation, isAddCorporationMode });
  };

  render() {
    const {
      corporations,
      defaultLanguage,
      phrases,
    } = this.props;
    const { chosenCorporation, isAddCorporationMode } = this.state;

    return (
      <div className={b()}>
        <ContentHeader
          title={phrases['sideBar.menu.businesses.label'][defaultLanguage.isoKey]}
          titleCentered
          // content={(
          // <CorporationsList
          // isAddCorporationMode={isAddCorporationMode}
          // defaultLanguage={defaultLanguage}
          // phrases={phrases}
          // corporations={corporations}
          // changeCorporation={this.handleChangeCorporation}
          // />
          // )}
          // controlBtn={(
          // <Button
          // className={b('addBtn')}
          // type="primary"
          // onClick={this.handleChangeCorporation(undefined, true)}
          // >
          // <AddIconSmall />
          // Додати компанію
          // </Button>
          // )}
          reverseDirection
        />
        {
          corporations && corporations.length ? (
            <>
              {(chosenCorporation || isAddCorporationMode) ? (
                <CorporationContent
                  chosenCorporation={chosenCorporation}
                  isAddCorporationMode={isAddCorporationMode}
                  defaultLanguage={defaultLanguage}
                  phrases={phrases}
                />
              ) : (
                <EmptyState
                  title={phrases['company.page.tabs.companyInformation.fullPhrase'][defaultLanguage.isoKey]}
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
              addItemHandler={this.handleChangeCorporation}
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
});

export default connect(mapStateToProps)(CorporationsPage);
