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
    const { corporations, business: allBusiness } = this.props;
    const { chosenCorporation, isAddCorporationMode, viewCorp } = this.state;

    return (
      <div className={b()}>
        {
          isAddCorporationMode || (chosenCorporation && chosenCorporation.id) ? (
            <CorporationInfo
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
                      viewCorp={viewCorp}
                      corporations={corporations}
                      changeActiveCorporation={this.changeActiveCorporation}
                      chooseCorporationForView={this.chooseCorporationForView}
                    />
                    {
                      viewCorp ? (
                        <BusinessesList
                          viewCorp={viewCorp}
                          business={allBusiness.filter(item => item.corporationId === viewCorp.id)}
                        />
                      ) : (
                        <EmptyState
                          title="Компания не выбрана"
                          descrText="Выберите компанию, чтобы увидеть список филиалов "
                          withoutBtn
                        />
                      )
                    }
                  </>
                ) : (
                  <div className={b('empty')}>
                    <div className={b('header')}>
                      <h1 className={b('header-title')}>
                        Информация о компании
                      </h1>
                    </div>
                    <EmptyState
                      title="У вас пока нет компаний"
                      descrText="Создайте свою первую компанию, в которую вы сможете добавить филиалы"
                      addItemText="Создать компанию"
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
  corporations: state.corporations.corporations,
  business: state.business.business,
});

export default connect(mapStateToProps)(CorporationsPage);
