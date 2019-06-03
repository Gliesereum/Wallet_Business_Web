import React, { Component } from 'react';
import { connect } from 'react-redux';
import bem from 'bem-join';

import {
  Row,
  Col,
  // List,
  // Card,
  notification,
  // Button,
} from 'antd';

import { CorporationsList, BusinessesList } from '../../components';
// import { Modal } from '../../components';
// import { CorporationForm } from '../../components/Forms';

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
    const [chosenCorp] = this.props.corporations.filter(item => item.id === corpId);
    this.setState({ chosenCorp });
  };

  render() {
    const { corporations } = this.props;
    const { chosenCorp } = this.state;

    return (
      <Row className={b()}>
        <Col lg={8} className={b('col')}>
          <CorporationsList
            chooseCorporation={this.chooseCorporation}
            corporations={corporations}
          />
        </Col>
        <Col lg={16} className={b('col')}>
          <BusinessesList
            chosenCorp={chosenCorp}
          />
        </Col>
      </Row>
    );
  }
}

const mapDispatchToProps = dispatch => ({
  deleteCorporation: id => dispatch(actions.corporations.$deleteCorporation(id)),
  dataLoading: bool => dispatch(actions.app.$dataLoading(bool)),
});

const mapStateToProps = state => ({
  corporations: state.corporations.corporations,
});

export default connect(mapStateToProps, mapDispatchToProps)(CorporationsContainer);
