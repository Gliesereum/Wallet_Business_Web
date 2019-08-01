import React, { Component } from 'react';
import { connect } from 'react-redux';
import bem from 'bem-join';

import {
  Row,
  Col,
} from 'antd';

import {
  CorporationsList,
  BusinessesList,
  EmptyState,
  CorporationInfo,
} from '../../components';

const b = bem('corporationsContainer');

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
      <Row className={b()}>
        {
          isAddCorporationMode || (chosenCorporation && chosenCorporation.id) ? (
            <Col lg={24}>
              <CorporationInfo
                isAddMode={isAddCorporationMode}
                corporations={corporations}
                chosenCorporation={chosenCorporation}
                changeActiveCorporation={this.changeActiveCorporation}
              />
            </Col>
          ) : (
            <>
              {
                corporations && corporations.length ? (
                  <>
                    <Col lg={8} className={b('col')}>
                      <CorporationsList
                        viewCorp={viewCorp}
                        corporations={corporations}
                        changeActiveCorporation={this.changeActiveCorporation}
                        chooseCorporationForView={this.chooseCorporationForView}
                      />
                    </Col>
                    <Col lg={16} className={b('col')}>
                      {
                        viewCorp ? (
                          <BusinessesList
                            viewCorp={viewCorp}
                            business={allBusiness.filter(item => item.corporationId === viewCorp.id)}
                          />
                        ) : (
                          <EmptyState
                            title="Компания не выбрана"
                            descrText="Выберите компанию, чтобы увидеть список бизнесов"
                            withoutBtn
                          />
                        )
                      }
                    </Col>
                  </>
                ) : (
                  <>
                    <div className={b('header')}>
                      <h1 className={b('header-title')}>
                        Информация о компании
                      </h1>
                    </div>
                    <div className={b('emptyState-wrapper')}>
                      <EmptyState
                        title="У вас нету компаний"
                        descrText="Создайте компанию, чтобы начать создать Ваши бизнесы"
                        addItemText="Создать компанию"
                        linkToData={{ pathname: '/corporations/add' }}
                      />
                    </div>
                  </>
                )
              }
            </>
          )
        }
      </Row>
    );
  }
}

const mapStateToProps = state => ({
  corporations: state.corporations.corporations,
  business: state.business.business,
});

export default connect(mapStateToProps)(CorporationsPage);
