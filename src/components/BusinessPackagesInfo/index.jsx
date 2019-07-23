import React, { PureComponent } from 'react';
import bem from 'bem-join';
import { connect } from 'react-redux';

import {
  Button,
  Col,
  Icon,
  notification,
  Row,
} from 'antd';

import { PackageForm } from '../Forms';

import { asyncRequest, withToken } from '../../utils';
import { actions } from '../../state';

const b = bem('businessPackagesInfo');

class BusinessPackagesInfo extends PureComponent {
  handleRemovePackage = async () => {
    const { chosenPackage, deletePackage, changeActivePackage } = this.props;

    const url = `package/${chosenPackage.id}`;
    const { businessId, id: packageId } = chosenPackage;
    try {
      await withToken(asyncRequest)({ url, method: 'DELETE', moduleUrl: 'karma' });
      await deletePackage({ businessId, packageId });
      changeActivePackage(null, false)();
    } catch (err) {
      notification.error({
        duration: 5,
        message: err.message || 'Ошибка',
        description: 'Возникла ошибка',
      });
    }
  };

  handleUpdatePackage = async () => {
    await this.packageForm.props.form.validateFieldsAndScroll(
      async (errors, values) => {
        if (!errors) {
          const {
            chosenPackage,
            isAddMode,
            createPackage,
            updatePackage,
            singleBusiness,
            changeActivePackage,
          } = this.props;
          const url = 'package';
          const method = isAddMode ? 'POST' : 'PUT';

          const data = {
            ...chosenPackage,
            ...values,
            businessId: singleBusiness.id,
          };

          try {
            const newPackage = await withToken(asyncRequest)({
              url, body: data, method, moduleUrl: 'karma',
            });
            isAddMode ? await createPackage(newPackage) : await updatePackage(newPackage);
            changeActivePackage(null, false)();
          } catch (err) {
            notification.error({
              duration: 5,
              message: err.message || 'Ошибка',
              description: 'Возникла ошибка',
            });
          }
        }
      },
    );
  };

  render() {
    const {
      isAddMode,
      chosenPackage,
      servicePricesList,
      changeActivePackage,
    } = this.props;

    return (
      <div className={b()}>
        <h1 className={b('header')}>
          {chosenPackage && !isAddMode ? chosenPackage.name : 'Создание пакета услуг'}
        </h1>
        <PackageForm
          servicePricesList={servicePricesList}
          chosenPackage={chosenPackage}
          wrappedComponentRef={form => this.packageForm = form}
        />
        {isAddMode ? (
          <Row
            gutter={40}
            className={b('controlBtns')}
          >
            <Col lg={12}>
              <Button
                className={b('controlBtns-btn backBtn')}
                onClick={changeActivePackage(null, false)}
              >
                <Icon type="left" />
                Назад к списку
              </Button>
            </Col>
            <Col lg={12}>
              <Button
                className={b('controlBtns-btn')}
                onClick={this.handleUpdatePackage}
                type="primary"
              >
                Создать пакет
              </Button>
            </Col>
          </Row>
        ) : (
          <Row
            gutter={40}
            className={b('controlBtns')}
          >
            <Col lg={8}>
              <Button
                className={b('controlBtns-btn backBtn')}
                onClick={changeActivePackage(null, false)}
              >
                <Icon type="left" />
                Назад
              </Button>
            </Col>
            <Col lg={8}>
              <Button
                className={b('controlBtns-btn deleteBtn')}
                onClick={this.handleRemovePackage}
              >
                Удалить пакет
              </Button>
            </Col>
            <Col lg={8}>
              <Button
                className={b('controlBtns-btn')}
                onClick={this.handleUpdatePackage}
                type="primary"
              >
                Сохранить
              </Button>
            </Col>
          </Row>
        )}
      </div>
    );
  }
}

const mapDispatchToProps = dispatch => ({
  createPackage: businessPackage => dispatch(actions.business.$createBusinessPackage(businessPackage)),
  updatePackage: businessPackage => dispatch(actions.business.$updateBusinessPackage(businessPackage)),
  deletePackage: ({ businessId, packageId }) => dispatch(actions.business.$deleteBusinessPackage({ businessId, packageId })),
});

export default connect(null, mapDispatchToProps)(BusinessPackagesInfo);
