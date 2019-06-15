import React, { Component } from 'react';
import bem from 'bem-join';
import { connect } from 'react-redux';
import compose from 'recompose/compose';

import {
  Button,
  Col,
  notification,
  Row,
  Icon,
} from 'antd';

import {
  ServiceMainInfoForm,
  ServiceAdditional,
  ServiceClasses,
} from '../Forms';

import { asyncRequest, withToken, fetchDecorator } from '../../utils';
import {
  fetchGetServiceTypes,
  fetchGetFilters,
  fetchGetClasses,
} from '../../fetches';
import { actions } from '../../state';

import './index.scss';

const b = bem('businessServiceInfo');

class BusinessServiceInfo extends Component {
  state = {
    activeKey: 'mainInfo',
    mainInfo: null,
    additionalInfo: null,
    classes: null,
    additionalInfoVisible: Boolean(this.props.chosenService),
  };

  updateFormData = (formName, changedData) => {
    this.setState(prevState => ({
      [formName]: {
        ...prevState[formName],
        ...changedData,
      },
    }));
  };

  handleUpdateBusinessService = async (e) => {
    e.preventDefault();

    const {
      chosenService,
      singleBusiness,
      changeActiveService,
      updateBusinessService,
      isAddMode,
      addServicePrice,
      updateServicePrice,
    } = this.props;
    const {
      mainInfo,
      additionalInfo,
      // classes,
      additionalInfoVisible,
    } = this.state;

    this.mainInfoForm.props.form.validateFieldsAndScroll(
      (errors, values) => console.log(errors, values),
    ); // TODO: check if forms has error;

    if (mainInfo) {
      const servicePriceUrl = 'price';
      const body = {
        ...(chosenService || {}),
        ...mainInfo,
        businessId: singleBusiness.id,
      };

      try {
        const newServicePrice = await withToken(asyncRequest)({
          url: servicePriceUrl,
          method: isAddMode ? 'POST' : 'PUT',
          moduleUrl: 'karma',
          body,
        });
        if (isAddMode) {
          await addServicePrice(newServicePrice);
          changeActiveService(newServicePrice, false)();
          this.setState({ additionalInfoVisible: true });
        } else {
          updateServicePrice(newServicePrice);
          updateBusinessService();
        }
      } catch (err) {
        notification.error({
          duration: 5,
          message: err.message || 'Ошибка',
          description: 'Возникла ошибка',
        });
      }
    }
    if (additionalInfo) {
      const filterAttrUrl = `price/filter-attributes/${chosenService.id}`;
      let body = [];
      for (const key in additionalInfo) {
        if (Object.prototype.hasOwnProperty.call(additionalInfo, key)) {
          body = [...body, ...additionalInfo[key]];
        }
      }

      try {
        const newServicePrice = await withToken(asyncRequest)({
          url: filterAttrUrl, method: 'POST', moduleUrl: 'karma', body,
        });
        updateServicePrice(newServicePrice);
      } catch (err) {
        notification.error({
          duration: 5,
          message: err.message || 'Ошибка',
          description: 'Возникла ошибка',
        });
      }
    }

    additionalInfoVisible && changeActiveService(null, false)();
  };

  handleRemoveServicePrice = async () => {
    const {
      removeServicePrice,
      chosenService,
      singleBusiness,
      changeActiveService,
    } = this.props;
    const removeServicePriceUrl = `price/${chosenService.id}`;

    try {
      await withToken(asyncRequest)({ url: removeServicePriceUrl, method: 'DELETE', moduleUrl: 'karma' });
      await removeServicePrice({ servicePriceId: chosenService.id, businessId: singleBusiness.id });

      changeActiveService(null, false)();
    } catch (err) {
      notification.error({
        duration: 5,
        message: err.message || 'Ошибка',
        description: 'Возникла ошибка',
      });
    }
  };

  render() {
    const { additionalInfoVisible } = this.state;
    const {
      serviceTypes,
      filters,
      classes,
      chosenService,
      changeActiveService,
      isAddMode,
    } = this.props;

    return (
      <div className={b()}>
        <h1 className={b('header')}>Основная информация</h1>
        <ServiceMainInfoForm
          serviceTypes={serviceTypes}
          servicePrice={chosenService}
          updateFormData={this.updateFormData}
          wrappedComponentRef={form => this.mainInfoForm = form}
        />
        {
          additionalInfoVisible ? (
            <div>
              <h1 className={b('header')}>Дополнительная информация</h1>
              <ServiceAdditional
                filters={filters}
                servicePrice={chosenService}
                updateFormData={this.updateFormData}
              />
              <h1 className={b('header')}>Класс обслуживания</h1>
              <ServiceClasses
                classes={classes}
                servicePrice={chosenService}
                updateFormData={this.updateFormData}
              />
            </div>
          ) : (
            <div className={b('infoBlock')}>
              <p className={b('infoBlock-text')}>
                <span className={b('infoBlock-text', { firstParagraph: true })}>Внимание!</span>
                <br />
                <span>
                  Введите и сохраните основную информацию услуги для доступа к редакции дополнительной информации
                  Вы не можете создать пакет услуг пока не создадите услугу (Гы :))
                </span>
              </p>
            </div>
          )
        }
        {isAddMode ? (
          <Row
            gutter={40}
            className={b('controlBtns')}
          >
            <Col lg={12}>
              <Button
                className={b('controlBtns-btn backBtn')}
                onClick={changeActiveService(null, false)}
              >
                <Icon type="left" />
                Назад к списку
              </Button>
            </Col>
            <Col lg={12}>
              <Button
                className={b('controlBtns-btn')}
                onClick={this.handleUpdateBusinessService}
                type="primary"
              >
                {
                  !additionalInfoVisible ? 'Сохранить основную информацию' : 'Сохранить'
                }
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
                onClick={changeActiveService(null, false)}
              >
                <Icon type="left" />
                Назад
              </Button>
            </Col>
            <Col lg={8}>
              <Button
                className={b('controlBtns-btn deleteBtn')}
                onClick={this.handleRemoveServicePrice}
              >
                Удалить сервис
              </Button>
            </Col>
            <Col lg={8}>
              <Button
                className={b('controlBtns-btn')}
                onClick={this.handleUpdateBusinessService}
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
  removeServicePrice: servicePrice => dispatch(actions.business.$removeServicePrice(servicePrice)),
  updateServicePrice: servicePrice => dispatch(actions.business.$updateServicePrice(servicePrice)),
  addServicePrice: servicePrice => dispatch(actions.business.$addServicePrice(servicePrice)),
});

export default compose(
  connect(null, mapDispatchToProps),
  fetchDecorator({
    actions: [fetchGetServiceTypes, fetchGetFilters, fetchGetClasses],
    config: { loader: true },
  }),
)(BusinessServiceInfo);
