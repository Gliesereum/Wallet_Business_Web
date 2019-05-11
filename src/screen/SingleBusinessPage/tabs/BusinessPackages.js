import React, {Component, Fragment} from 'react';

import {Button, List, message, Popconfirm} from 'antd';

import Modal from '../../../components/ModalLayout';

import {PackageForm} from '../../../components/Forms';

import {asyncRequest, withToken} from '../../../utils';


const MODALS = {
  CREATE_PACKAGE: PackageForm,
  UPDATE_PACKAGE: PackageForm,
};

class BusinessPackages extends Component {

  state = {
    modal: {},
    loading: false,
    deleteLoading: ''             // Package id
  };

  onSubmitForm = async (data, mode) => {
    const url = 'package';
    const method = mode === 'update' ? 'PUT' : 'POST';
    const successMessage = mode === 'update' ? 'сохранено' : 'создан пакет услуг';
    try {
      this.setState({loading: true});
      const newPackage = await withToken(asyncRequest)({url, body: data, method, moduleUrl: 'karma'});
      message.success(`Успешно ${successMessage}`);

      if (mode === 'update') {
        await this.props.updatePackage(newPackage)
      }
      if (mode === 'create') {
        await this.props.createPackage(newPackage)
      }

    } catch (e) {
      message.error('Упс! Что-то пошло не так!');
      console.log(e);
    } finally {
      this.setState({loading: false, modal: {}});
    }

  };

  onDeletePackage = businessPackage => async () => {
    const url = `package/${businessPackage.id}`;
    const {businessId, id: packageId} = businessPackage;
    try {
      this.setState({deleteLoading: businessPackage.id});
      await withToken(asyncRequest)({url, method: 'DELETE', moduleUrl: 'karma'});
      message.success('Пакет успешно удалён');
      this.props.deletePackage({businessId, packageId})
    } catch (e) {
      message.success('Упс. Что-то пошло не так');
      console.log(e);
    } finally {
      this.setState({deleteLoading: ''});
    }
  };

  triggerServiceModal = (modalName, bool, mode = 'create', data) => () => {
    this.setState({
      modal: {
        visible: bool,
        Component: modalName,
        mode,
        data
      }
    });
  };

  renderItemPackage = itemPackage => {
    return (
      <List.Item
        actions={[
          <Button onClick={this.triggerServiceModal(MODALS.UPDATE_PACKAGE, true, 'update', itemPackage)}>
            Основная информация
          </Button>,

          <Popconfirm
            placement="topLeft"
            title={'Уверены?'}
            onConfirm={this.onDeletePackage(itemPackage)}
            okText="Да"
            cancelText="Нет"
          >
            <Button type="primary" loading={itemPackage.id === this.state.deleteLoading}>
              Удалить пакет
            </Button>
          </Popconfirm>

        ]}
      >
        <List.Item.Meta title={itemPackage.name}/>
      </List.Item>
    )
  };

  renderPackagesList = () => {
    if (this.props.packages.length) {
      return (
        <div className="coupler-packages-list">
          <List itemLayout="horizontal" dataSource={this.props.packages} renderItem={this.renderItemPackage}/>
        </div>
      )
    }
  };

  renderEmptyList = () => {
    return !this.props.packages.length && (
      <div>Пустой список</div>
    )
  };

  renderModal = () => {
    const {modal} = this.state;
    const servicePricesList = this.props.servicePrices[this.props.singleBusiness.id] || [];
    return (
      <Modal
        visible={modal.visible}
        closable={true}
        handleCancel={() => this.setState({modal: {}})}
        footer={null}
      >
        {modal.visible && <modal.Component
          servicePrices={servicePricesList}
          onCancel={this.triggerServiceModal}
          mode={modal.mode}
          data={modal.data}
          businessId={this.props.singleBusiness.id}
          onSubmit={this.onSubmitForm}
          loading={this.state.loading}
        />}
      </Modal>
    )
  };

  renderBusinessListTab = () => {
    return (
      <Fragment>
        <Button
          onClick={this.triggerServiceModal(MODALS.CREATE_PACKAGE, true, 'create', null)}
          type="primary"
        >
          Добавить пакет
        </Button>
        {this.renderEmptyList()}
        {this.renderPackagesList()}
        {this.renderModal()}
      </Fragment>
    )
  };

  render() {
    return this.renderBusinessListTab()
  }

}

export default BusinessPackages;
