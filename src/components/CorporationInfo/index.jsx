import React, { Component } from 'react';
import { connect } from 'react-redux';
import bem from 'bem-join/dist/index';

import {
  Row,
  Col,
  Icon,
  Avatar as CorpAvatar,
  notification, Button,
} from 'antd/lib/index';

import EmptyState from '../EmptyState';
import DeleteModal from '../DeleteModal';
import { CorporationForm } from '../Forms';

import { asyncRequest, asyncUploadFile, withToken } from '../../utils';
import { actions } from '../../state';

const b = bem('corporationInfo');

class CorporationInfo extends Component {
  state = {
    readOnlyMode: !this.props.isAddMode,
    deleteModalVisible: false,
    logoUrl: this.props.chosenCorporation ? this.props.chosenCorporation.logoUrl : null,
    isError: false,
    fileLoader: false,
  };

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

  handleUpdateCorporation = async () => {
    await this.corporationForm.props.form.validateFields(async (error, values) => {
      if (!error) {
        const {
          chosenCorporation,
          updateCorporation,
          addCorporation,
          isAddMode,
          changeActiveCorporation,
        } = this.props;

        const url = 'corporation';
        const body = {
          ...chosenCorporation,
          ...values,
          logoUrl: this.state.logoUrl,
        };
        const method = isAddMode ? 'POST' : 'PUT';
        try {
          const corporation = await withToken(asyncRequest)({ url, method, body });
          await isAddMode ? await addCorporation(corporation) : updateCorporation(corporation);
          changeActiveCorporation(null, false)();
        } catch (err) {
          notification.error({
            duration: 5,
            message: err.message || 'Ошибка',
            description: 'Возникла ошибка',
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
        description: 'Возникла ошибка',
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
      corporations,
      chosenCorporation,
      isAddMode,
      changeActiveCorporation,
    } = this.props;

    let headerTitle = 'Редактирование компании';
    if (readOnlyMode) {
      headerTitle = 'Информация о компании';
    } else if (isAddMode) {
      headerTitle = 'Создание компании';
    }

    return (
      <div className={b()}>
        <div className={b('formBox')}>
          <h1 className={b('formBox-header')}>{headerTitle}</h1>
          <CorporationForm
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
                    className={b('formBox-controlBtns-btn backBtn')}
                    onClick={changeActiveCorporation(null, false)}
                  >
                    <Icon type="left" />
                    Назад
                  </Button>
                ) : (
                  <Button
                    className={b('formBox-controlBtns-btn backBtn')}
                    onClick={chosenCorporation
                      ? this.handleToggleReadOnlyMode(true)
                      : changeActiveCorporation(null, false)
                    }
                  >
                    <Icon type="left" />
                    Назад
                  </Button>
                )
              }
            </Col>
            <Col lg={8}>
              {
                readOnlyMode ? (
                  <Button
                    className={b('formBox-controlBtns-btn deleteBtn')}
                    onClick={this.toggleDeleteModal}
                  >
                    Удалить
                  </Button>
                ) : (
                  <div />
                )
              }
            </Col>
            <Col lg={8}>
              {
                readOnlyMode ? (
                  <Button
                    className={b('formBox-controlBtns-btn')}
                    type="primary"
                    onClick={this.handleToggleReadOnlyMode(false)}
                  >
                    Редактировать компанию
                  </Button>
                ) : (
                  <Button
                    className={b('formBox-controlBtns-btn')}
                    type="primary"
                    onClick={this.handleUpdateCorporation}
                  >
                    Сохранить
                  </Button>
                )
              }
            </Col>
          </Row>
          {
            deleteModalVisible && (
              <DeleteModal
                visible={deleteModalVisible}
                okText="Удалить"
                cancelText="Отменить"
                onOk={this.handleRemoveCorporation}
                onCancel={this.toggleDeleteModal}
                deletedName={chosenCorporation.name}
                deletedItem="компанию"
              />
            )
          }
        </div>

        <div className={b('otherCorpBox')}>
          <h1 className={b('otherCorpBox-header')}>Другие мои компании</h1>
          {
            corporations.length ? (
              corporations.map(corp => (
                <div
                  onClick={changeActiveCorporation(corp, false)}
                  key={corp.id}
                  className={b('otherCorpBox-list-item')}
                >
                  <CorpAvatar className={b('otherCorpBox-list-item-logo')} src={corp.logoUrl} />
                  <span>{corp.name}</span>
                </div>
              ))) : (
                <div className={b('emptyState-wrapper')}>
                  <EmptyState
                    title="У вас нету компаний"
                    descrText="Создайте компанию, чтобы начать создать Ваши бизнесы"
                    withoutBtn
                  />
                </div>
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
