import React, { Component } from 'react';
import { connect } from 'react-redux';

import {
  List,
  Card,
  notification,
  Button,
} from 'antd';

import { Modal } from '../../components';
import { CorporationForm } from '../../components/Forms';

import { asyncRequest, withToken } from '../../utils';
import { actions } from '../../state';

class ProfileCorporations extends Component {
  state = {
    editModal: false,
    deleteModal: false,
    addModal: false,
    corporation: {},
  };

  handleToggleModal = (modal, bool, corporation) => {
    this.setState({
      [modal]: bool,
      corporation,
    });
  };

  handleUpdateCorporation = async (newCorp) => {
    const { dataLoading, updateCorporation } = this.props;
    await dataLoading(true);

    const url = 'corporation';
    const body = newCorp;
    const method = 'PUT';
    try {
      const updatedCorporation = await withToken(asyncRequest)({ url, method, body });
      await updateCorporation(updatedCorporation);
    } catch (error) {
      notification.error(error.message || 'Ошибка');
    } finally {
      this.setState({
        editModal: false,
      },
      async () => await dataLoading(false));
    }
  };

  handleAddCorporation = async (newCorp) => {
    const { dataLoading, addCorporation } = this.props;
    await dataLoading(true);

    const url = 'corporation';
    const body = newCorp;
    const method = 'POST';

    try {
      const newCorporation = await withToken(asyncRequest)({ url, method, body });
      await addCorporation(newCorporation);
    } catch (error) {
      notification.error(error.message || 'Ошибка');
    } finally {
      this.setState({
        addModal: false,
      },
      async () => await dataLoading(false),);
    }
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
    } catch (error) {
      notification.error(error.message || 'Ошибка');
    } finally {
      this.setState({
        deleteModal: false,
      },
      async () => await dataLoading(false),);
    }
  };

  render() {
    const {
      editModal,
      deleteModal,
      addModal,
      corporation,
    } = this.state;
    const { corporations } = this.props;

    const corpList = corporations && corporations.map(corpItem => ({
      name: corpItem.name,
      description: corpItem.description,
      country: corpItem.country,
      city: corpItem.city,
      street: corpItem.street,
      buildingNumber: corpItem.buildingNumber,
      fullItemData: corpItem,
    }));

    return (
      <div>
        <div className="karma-app-profile-addButton">
          <Button
            onClick={() => this.handleToggleModal('addModal', true)}
            type="primary"
          >
            Добавить компанию
          </Button>
        </div>
        <List
          size="large"
          grid={{
            gutter: 16, xs: 1, sm: 2, lg: 3, xxl: 4,
          }}
          dataSource={corpList}
          renderItem={corp => (
            <List.Item
              actions={[
                <div
                  onClick={() => this.handleToggleModal('editModal', true, corp)}
                >
                  Edit
                </div>,
                <div
                  onClick={() => this.handleToggleModal('deleteModal', true, corp)}
                >
                  Delete
                </div>,
              ]}
            >
              <Card title={corp.name}>
                <p>
                  {corp.description}
                </p>
                <span>
                  {corp.country && `${corp.country}, `}
                  {corp.city && `${corp.city}, `}
                  {corp.street && `${corp.street}, `}
                  {corp.buildingNumber && `${corp.buildingNumber}`}
                </span>
              </Card>
            </List.Item>
          )}
        />
        {
          editModal && (
            <Modal
              title="Редактирование компании"
              visible={editModal}
              footer={null}
              isOutsideClickable={false}
              handleCancel={this.handleToggleModal}
              closable={false}
            >
              <CorporationForm
                corporation={corporation.fullItemData}
                onSubmit={this.handleUpdateCorporation}
                onCancelClick={this.handleToggleModal}
                cancelText="Отмена"
                okText="Сохранить"
              />
            </Modal>
          )
        }
        {
          deleteModal && (
            <Modal
              title="Удаление компании"
              visible={deleteModal}
              okText="Удалить"
              cancelText="Отмена"
              isOutsideClickable={false}
              closable={false}
              handleOk={() => this.handleDeleteCorporation(corporation)}
              handleCancel={() => this.handleToggleModal('deleteModal', false)}
            >
              <span>
                {`Вы действительно хотите удалить компанию ${corporation.name} cо своего аккаунта?`}
              </span>
            </Modal>
          )
        }
        {
          addModal && (
            <Modal
              title="Добавление компании"
              visible={addModal}
              footer={null}
              isOutsideClickable={false}
              handleCancel={this.handleToggleModal}
              closable={false}
            >
              <CorporationForm
                onSubmit={this.handleAddCorporation}
                onCancelClick={this.handleToggleModal}
                cancelText="Отмена"
                okText="Добавить"
              />
            </Modal>
          )
        }
      </div>
    );
  }
}

const mapDispatchToProps = dispatch => ({
  updateCorporation: corporation => dispatch(actions.corporations.$updateCorporation(corporation)),
  addCorporation: corporation => dispatch(actions.corporations.$addCorporation(corporation)),
  deleteCorporation: id => dispatch(actions.corporations.$deleteCorporation(id)),
  dataLoading: bool => dispatch(actions.app.$dataLoading(bool)),
});

const mapStateToProps = state => ({
  corporations: state.corporations.corporations,
});

export default connect(mapStateToProps, mapDispatchToProps)(ProfileCorporations);
