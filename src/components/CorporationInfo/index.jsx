import React, { Component } from 'react';
import { connect } from 'react-redux';
import bem from 'bem-join/dist/index';

import {
  Row,
  Col,
  notification,
  Button,
} from 'antd';

import DeleteModal from '../DeleteModal';
import { CorporationForm } from '../Forms';

import { asyncRequest, withToken } from '../../utils';
import { actions } from '../../state';

const b = bem('corporationInfo');

class CorporationInfo extends Component {
  state = {
    readOnlyMode: !this.props.isAddCorporationMode,
    deleteModalVisible: false,
    uploadedCoverUrl: null,
    uploadedLogoUrl: null,
  };

  componentWillReceiveProps(nextProps) {
    if (nextProps.isAddCorporationMode !== this.props.isAddCorporationMode) {
      this.setState({ readOnlyMode: !nextProps.isAddCorporationMode });
    }
  }

  onLoadCover = uploadedCoverUrl => this.setState({ uploadedCoverUrl });

  onLoadLogo = uploadedLogoUrl => this.setState({ uploadedLogoUrl });

  toggleDeleteModal = () => {
    this.setState(prevState => ({
      deleteModalVisible: !prevState.deleteModalVisible,
    }));
  };

  handleToggleReadOnlyMode = bool => () => this.setState({ readOnlyMode: bool });

  resetFields = () => {
    this.corporationForm.props.form.resetFields();
  };

  handleCancel = () => {
    const { chosenCorporation } = this.props;

    if (chosenCorporation) this.handleToggleReadOnlyMode(true)();
    this.resetFields();
  };

  handleUpdateCorporation = async () => {
    await this.corporationForm.props.form.validateFields(async (error, values) => {
      if (!error) {
        const {
          chosenCorporation,
          updateCorporation,
          addCorporation,
          isAddCorporationMode,
        } = this.props;
        const {
          uploadedCoverUrl,
          uploadedLogoUrl,
        } = this.state;

        const url = 'corporation';
        const body = {
          ...chosenCorporation,
          ...values,
          coverUrl: uploadedCoverUrl || (chosenCorporation ? chosenCorporation.coverUrl : null),
          logoUrl: uploadedLogoUrl || (chosenCorporation ? chosenCorporation.logoUrl : null),
        };
        const method = isAddCorporationMode ? 'POST' : 'PUT';
        try {
          const corporation = await withToken(asyncRequest)({ url, method, body });
          await isAddCorporationMode ? await addCorporation(corporation) : updateCorporation(corporation);
        } catch (err) {
          notification.error({
            duration: 5,
            message: err.message || 'Ошибка',
            description: 'Ошибка',
          });
        }
      }
    });
  };

  handleRemoveCorporation = async () => {
    const { chosenCorporation, changeActiveCorporation, removeCorporation } = this.props;
    const removeCorporationUrl = `corporation/${chosenCorporation.id}`;

    try {
      await withToken(asyncRequest)({ url: removeCorporationUrl, method: 'DELETE' });
      await removeCorporation(chosenCorporation.id);
      changeActiveCorporation(null, false)();
    } catch (err) {
      notification.error({
        duration: 5,
        message: err.message || 'Ошибка',
        description: 'Ошибка',
      });
    }
  };

  render() {
    const {
      readOnlyMode,
      deleteModalVisible,
    } = this.state;
    const {
      chosenCorporation,
      defaultLanguage,
      phrases,
    } = this.props;

    return (
      <div className={b()}>
        <CorporationForm
          defaultLanguage={defaultLanguage}
          phrases={phrases}
          wrappedComponentRef={form => this.corporationForm = form}
          readOnlyMode={readOnlyMode}
          chosenCorporation={chosenCorporation}
          onLoadCover={this.onLoadCover}
          onLoadLogo={this.onLoadLogo}
        />
        <Row
          className={b('controlBtns')}
          gutter={32}
        >
          <Col lg={8}>
            {
              readOnlyMode ? (
                <Button
                  className={b('controlBtns-btn deleteBtn')}
                  onClick={this.toggleDeleteModal}
                >
                  {phrases['core.button.remove'][defaultLanguage.isoKey]}
                </Button>
              ) : (
                <Button
                  className={b('controlBtns-btn backBtn')}
                  onClick={this.handleCancel}
                >
                  {phrases['core.button.cancel'][defaultLanguage.isoKey]}
                </Button>
              )
            }
          </Col>
          <Col lg={8} />
          <Col lg={8}>
            {
              readOnlyMode ? (
                <Button
                  className={b('controlBtns-btn')}
                  type="primary"
                  onClick={this.handleToggleReadOnlyMode(false)}
                >
                  {phrases['core.button.edit'][defaultLanguage.isoKey]}
                </Button>
              ) : (
                <Button
                  className={b('controlBtns-btn')}
                  type="primary"
                  onClick={this.handleUpdateCorporation}
                >
                  {phrases['core.button.save'][defaultLanguage.isoKey]}
                </Button>
              )
            }
          </Col>
        </Row>
        {
          deleteModalVisible && (
            <DeleteModal
              visible={deleteModalVisible}
              okText={phrases['core.button.remove'][defaultLanguage.isoKey]}
              cancelText={phrases['core.button.cancel'][defaultLanguage.isoKey]}
              onOk={this.handleRemoveCorporation}
              onCancel={this.toggleDeleteModal}
              deletedName={chosenCorporation.name}
              deletedItem="компанию"
            />
          )
        }
      </div>
    );
  }
}

const mapDispatchToProps = dispatch => ({
  addCorporation: corporation => dispatch(actions.corporations.$addCorporation(corporation)),
  updateCorporation: corporation => dispatch(actions.corporations.$updateCorporation(corporation)),
  removeCorporation: corporationId => dispatch(actions.corporations.$deleteCorporation(corporationId)),
});

export default connect(null, mapDispatchToProps)(CorporationInfo);
