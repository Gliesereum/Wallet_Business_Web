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
import { fetchAction } from '../../fetches';
import { actions } from '../../state';

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
      changeTabDisable,
      isAddMode,
      addServicePrice,
      updateServicePrice,
      filters,
    } = this.props;
    const {
      mainInfo,
      additionalInfo,
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
          changeTabDisable('packages');
          this.setState({ additionalInfoVisible: true });
        } else {
          updateServicePrice(newServicePrice);
        }
      } catch (err) {
        notification.error({
          duration: 5,
          message: err.message || 'Ошибка',
          description: 'Ошибка',
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
          description: 'Ошибка',
        });
      }
    }

    (
      (singleBusiness.businessCategory.businessType !== 'CAR' && filters.length < 1)
      || additionalInfoVisible)
    && changeActiveService(null, false)();
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
        description: 'Ошибка',
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
      singleBusiness,
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
              {
                (filters.length > 0) && (
                  <>
                    <h1 className={b('header')}>Дополнительная информация</h1>
                    <ServiceAdditional
                      filters={filters}
                      servicePrice={chosenService}
                      updateFormData={this.updateFormData}
                    />
                  </>
                )
              }
              {
                singleBusiness.businessCategory.businessType === 'CAR' && (
                  <>
                    <h1 className={b('header')}>Класс обслуживания</h1>
                    <ServiceClasses
                      classes={classes}
                      servicePrice={chosenService}
                      updateFormData={this.updateFormData}
                    />
                  </>
                )
              }
            </div>
          ) : (
            <>
              {
                filters.length > 0 && singleBusiness.businessCategory.businessType === 'CAR' && (
                  <div className={b('infoBlock')}>
                    <p className={b('infoBlock-text')}>
                      <span className={b('infoBlock-text', { firstParagraph: true })}>Внимание!</span>
                      <br />
                      <span>
                        Введите и сохраните основную информацию услуги, чтобы получить доступ к дополнительным атрибутам.
                      </span>
                    </p>
                  </div>
                )
              }
            </>
          )
        }
        <Row
          gutter={40}
          className={b('controlBtns')}
        >
          <Col lg={isAddMode ? 12 : 8}>
            <Button
              className={b('controlBtns-btn backBtn')}
              onClick={changeActiveService(null, false)}
            >
              <Icon type="left" />
              Назад к списку
            </Button>
          </Col>
          {
            !isAddMode && (
              <Col lg={8}>
                <Button
                  className={b('controlBtns-btn deleteBtn')}
                  onClick={this.handleRemoveServicePrice}
                >
                  Удалить услугу
                </Button>
              </Col>
            )
          }
          <Col lg={isAddMode ? 12 : 8}>
            <Button
              className={b('controlBtns-btn')}
              onClick={this.handleUpdateBusinessService}
              type="primary"
            >
              {
                (filters.length < 1 && singleBusiness.businessCategory.businessType !== 'CAR')
                  ? 'Сохранить'
                  : `${!additionalInfoVisible ? 'Сохранить основную информацию' : 'Сохранить'}`
              }
            </Button>
          </Col>
        </Row>
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
    actions: [
      ({ singleBusiness }) => singleBusiness && fetchAction({
        url: `service/by-business-category?businessCategoryId=${singleBusiness.businessCategoryId}`,
        fieldName: 'serviceTypes',
      })(),
      ({ singleBusiness }) => singleBusiness && fetchAction({
        url: `filter/by-business-category?businessCategoryId=${singleBusiness.businessCategoryId}`,
        fieldName: 'filters',
      })(),
      ({ singleBusiness }) => singleBusiness && fetchAction({
        url: 'class',
        fieldName: 'classes',
      })(),
    ],
    config: { loader: true },
  }),
)(BusinessServiceInfo);
