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

import { asyncRequest, withToken } from '../../utils';
import { actions } from '../../state';

const b = bem('corporation');

class Corporation extends Component {
  state = {
    readOnlyMode: !this.props.isAddMode,
    deleteModalVisible: false,
  };

  toggleDeleteModal = () => {
    this.setState(prevState => ({
      deleteModalVisible: !prevState.deleteModalVisible,
    }));
  };

  handleToggleReadOnlyMode = bool => () => this.setState({ readOnlyMode: bool });

  // handleChangeCorpLogo = async (info) => {
  //   const body = new FormData();
  //   await body.append('file', info.file);
  //   await body.append('open', true);
  //
  //   const imageUrl = await fetchImageByUpload(body);
  //
  //   this.setState({
  //     imageUrl,
  //     loading: false,
  //   });
  // };

  // renderUploadButton = () => (
  //   <div>
  //     <Icon type={this.state.loading ? 'loading' : 'plus'} />
  //     <div className={b()}>Добавить фотографию</div>
  //   </div>
  // );

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
      deleteModalVisible,
      readOnlyMode,
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
                    К списку
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
                    Отмена
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
                  <Button
                    className={b('formBox-controlBtns-btn deleteBtn')}
                  >
                    Інфо блок
                  </Button>
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
                    Редактировать сотрудника
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
          <h1 className={b('otherCorpBox-header')}>Мои другие компании</h1>
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

export default connect(null, mapDispatchToProps)(Corporation);
