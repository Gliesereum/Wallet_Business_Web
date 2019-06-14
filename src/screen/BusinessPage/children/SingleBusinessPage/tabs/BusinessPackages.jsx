import React, { Component, Fragment } from 'react';

import {
  Button, List, message, Popconfirm,
} from 'antd/lib/index';

import { PackageForm } from '../../../../../components/Forms';
import { asyncRequest, withToken } from '../../../../../utils';


const MODALS = {
  CREATE_PACKAGE: PackageForm,
  UPDATE_PACKAGE: PackageForm,
};

class BusinessPackages extends Component {
  state = {
    deleteLoading: '', // Package id
  };

  onSubmitForm = async (data, mode) => {
    const url = 'package';
    const method = mode === 'update' ? 'PUT' : 'POST';
    const successMessage = mode === 'update' ? 'сохранено' : 'создан пакет услуг';
    try {
      const newPackage = await withToken(asyncRequest)({
        url, body: data, method, moduleUrl: 'karma',
      });
      message.success(`Успешно ${successMessage}`);

      if (mode === 'update') {
        await this.props.updatePackage(newPackage);
      }
      if (mode === 'create') {
        await this.props.createPackage(newPackage);
      }
    } catch (e) {
      message.error('Упс! Что-то пошло не так!');
      console.log(e);
    }
  };

  onDeletePackage = businessPackage => async () => {
    const url = `package/${businessPackage.id}`;
    const { businessId, id: packageId } = businessPackage;
    try {
      this.setState({ deleteLoading: businessPackage.id });
      await withToken(asyncRequest)({ url, method: 'DELETE', moduleUrl: 'karma' });
      message.success('Пакет успешно удалён');
      this.props.deletePackage({ businessId, packageId });
    } catch (e) {
      message.success('Упс. Что-то пошло не так');
      console.log(e);
    } finally {
      this.setState({ deleteLoading: '' });
    }
  };

  renderItemPackage = itemPackage => (
    <List.Item
      actions={[
        <Button onClick={this.triggerServiceModal(MODALS.UPDATE_PACKAGE, true, 'update', itemPackage)}>
          Основная информация
        </Button>,

        <Popconfirm
          placement="topLeft"
          title="Уверены?"
          onConfirm={this.onDeletePackage(itemPackage)}
          okText="Да"
          cancelText="Нет"
        >
          <Button type="primary" loading={itemPackage.id === this.state.deleteLoading}>
            Удалить пакет
          </Button>
        </Popconfirm>,

      ]}
    >
      <List.Item.Meta title={itemPackage.name} />
    </List.Item>
  );

  renderPackagesList = () => {
    if (this.props.packages.length) {
      return (
        <div className="coupler-packages-list">
          <List itemLayout="horizontal" dataSource={this.props.packages} renderItem={this.renderItemPackage} />
        </div>
      );
    }
  };

  renderEmptyList = () => !this.props.packages.length && (
  <div>Пустой список</div>
  );

  renderBusinessListTab = () => (
    <Fragment>
      <Button
        onClick={this.triggerServiceModal(MODALS.CREATE_PACKAGE, true, 'create', null)}
        type="primary"
      >
        Добавить пакет
      </Button>
      {this.renderEmptyList()}
      {this.renderPackagesList()}
    </Fragment>
  );

  render() {
    return this.renderBusinessListTab();
  }
}

export default BusinessPackages;
