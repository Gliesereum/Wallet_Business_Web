import React, { Component } from 'react';
import { connect } from 'react-redux';
import bem from 'bem-join';

import {
  Row,
  Col,
} from 'antd';

import { CorporationsList, BusinessesList, EmptyState } from '../../components';

import './index.scss';

const b = bem('corporationsContainer');

class CorporationsContainer extends Component {
  state = {
    chosenCorp: this.props.corporations[0],
  };

  chooseCorporation = (corpId) => {
    if (!corpId) return;

    const [chosenCorp] = this.props.corporations.filter(item => item.id === corpId);
    this.setState({ chosenCorp });
  };

  render() {
    const { corporations, business: allBusiness } = this.props;
    const { chosenCorp } = this.state;
    const businessForCorp = allBusiness.filter(item => item.corporationId === chosenCorp.id);

    return (
      <Row className={b()}>
        {
          corporations && corporations.length ? (
            <>
              <Col lg={8} className={b('col')}>
                <CorporationsList
                  chooseCorporation={this.chooseCorporation}
                  corporations={corporations}
                />
              </Col>
              <Col lg={16} className={b('col')}>
                <BusinessesList
                  chosenCorp={chosenCorp}
                  business={businessForCorp}
                />
              </Col>
            </>
          ) : (
            <Col lg={24}>
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
            </Col>
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

export default connect(mapStateToProps)(CorporationsContainer);
