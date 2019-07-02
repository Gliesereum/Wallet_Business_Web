import React, { Component } from 'react';
import { connect } from 'react-redux';
import bem from 'bem-join';

import {
  Row,
  Col,
  notification,
} from 'antd';

import { CorporationsList, BusinessesList, EmptyState } from '../../components';

import { asyncRequest, withToken } from '../../utils';
import { actions } from '../../state';

import './index.scss';

const b = bem('corporationsContainer');

class CorporationsContainer extends Component {
  state = {
    chosenCorp: this.props.corporations[0],
  };

  handleDeleteCorporation = async (corp) => {
    const { deleteCorporation, dataLoading } = this.props;
    await dataLoading(true);

    const corpId = corp.fullItemData.id;
    const url = `corporation/${corpId}`;
    const method = 'DELETE';
    try {
      await withToken(asyncRequest)({ url, method });
      await deleteCorporation(corpId);
    } catch (err) {
      notification.error({
        duration: 5,
        message: err.message || 'Ошибка',
        description: 'Возникла ошибка',
      });
    } finally {
      this.setState({
        // deleteModal: false,
      },
      async () => await dataLoading(false),);
    }
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

const mapDispatchToProps = dispatch => ({
  deleteCorporation: id => dispatch(actions.corporations.$deleteCorporation(id)),
});

const mapStateToProps = state => ({
  corporations: state.corporations.corporations,
  business: state.business.business,
});

export default connect(mapStateToProps, mapDispatchToProps)(CorporationsContainer);
