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

import { asyncRequest, asyncUploadFile, withToken } from '../../utils';
import { actions } from '../../state';

const b = bem('corporationInfo');

class CorporationInfo extends Component {
  state = {
    readOnlyMode: !this.props.isAddCorporationMode,
    deleteModalVisible: false,
    logoUrl: this.props.chosenCorporation ? this.props.chosenCorporation.logoUrl : null,
    isError: false,
    fileLoader: false,
  };

  componentWillReceiveProps(nextProps) {
    if (nextProps.isAddCorporationMode !== this.props.isAddCorporationMode) {
      this.setState({ readOnlyMode: !nextProps.isAddCorporationMode });
    }
  }

  toggleDeleteModal = () => {
    this.setState(prevState => ({
      deleteModalVisible: !prevState.deleteModalVisible,
    }));
  };

  handleToggleReadOnlyMode = bool => () => this.setState({ readOnlyMode: bool });

  onUploaderChange = ({ file }) => {
    switch (file.status) {
      case 'uploading':
        this.setState({ fileLoader: true });
        break;
      case 'done':
        this.setState({ fileLoader: false });
        break;

      default:
        console.error('Error');
    }
  };

  uploadCorporationImage = async ({ file, onSuccess }) => {
    if ((file.size / 1024 / 1024) > 2) {
      this.setState({ isError: true });
      return;
    }
    const url = 'upload';
    const body = new FormData();
    await body.append('file', file);
    await body.append('open', true);
    const { url: imageUrl } = await withToken(asyncUploadFile)({ url, body, onSuccess });
    this.setState({ logoUrl: imageUrl, isError: false });
  };

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

        const url = 'corporation';
        const body = {
          ...chosenCorporation,
          ...values,
          logoUrl: this.state.logoUrl,
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
      logoUrl,
      isError,
      fileLoader,
    } = this.state;
    const {
      chosenCorporation,
      defaultLanguage,
      phrases,
    } = this.props;

    return (
      <div className={b()}>
        <div className={b('formBox')}>
          <div className={b('content')}>
            <CorporationForm
              defaultLanguage={defaultLanguage}
              phrases={phrases}
              wrappedComponentRef={form => this.corporationForm = form}
              readOnlyMode={readOnlyMode}
              chosenCorporation={chosenCorporation}
              isError={isError}
              loading={fileLoader}
              onChange={this.onUploaderChange}
              uploadCorporationImage={this.uploadCorporationImage}
              logoUrl={logoUrl}
            />
            <Row
              className={b('formBox-controlBtns')}
              gutter={20}
            >
              <Col lg={8}>
                {
                  readOnlyMode ? (
                    <Button
                      className={b('formBox-controlBtns-btn deleteBtn')}
                      onClick={this.toggleDeleteModal}
                    >
                      {phrases['core.button.remove'][defaultLanguage.isoKey]}
                    </Button>
                  ) : (
                    <Button
                      className={b('formBox-controlBtns-btn backBtn')}
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
                      className={b('formBox-controlBtns-btn')}
                      type="primary"
                      onClick={this.handleToggleReadOnlyMode(false)}
                    >
                      {phrases['core.button.edit'][defaultLanguage.isoKey]}
                    </Button>
                  ) : (
                    <Button
                      className={b('formBox-controlBtns-btn')}
                      type="primary"
                      onClick={this.handleUpdateCorporation}
                    >
                      {phrases['core.button.save'][defaultLanguage.isoKey]}
                    </Button>
                  )
                }
              </Col>
            </Row>
          </div>
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
