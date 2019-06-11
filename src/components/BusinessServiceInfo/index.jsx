import React, { Component } from 'react';
import bem from 'bem-join';
import { connect } from 'react-redux';
import compose from 'recompose/compose';

import {
  Button,
  Col,
  Collapse,
  Icon,
  notification,
  Row,
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

const { Panel } = Collapse;
const b = bem('businessServiceInfo');

class BusinessServiceInfo extends Component {
  state = {
    activeKey: 'mainInfo',
    mainInfo: null,
    additionalInfo: null,
    classes: null,
  };

  updateFormData = (formName, changedData) => {
    this.setState(prevState => ({
      [formName]: {
        ...prevState[formName],
        ...changedData,
      },
    }));
  };

  triggerPanel = activeKey => this.setState(prevState => ({
    activeKey: !activeKey ? prevState.activeKey : activeKey,
  }));

  handleUpdateBusinessService = async (e) => {
    e.preventDefault();

    const {
      chosenService,
      changeActiveService,
      updateBusinessService,
      changeActiveTab,
      isAddMode,
      addServicePrice,
      updateServicePrice,
    } = this.props;
    const {
      mainInfo,
      additionalInfo,
      // classes,
    } = this.state;

    if (chosenService) {
      if (mainInfo) {
        const servicePriceUrl = 'price';
        const body = {
          ...chosenService,
          ...mainInfo,
        };

        try {
          const newServicePrice = await withToken(asyncRequest)({
            url: servicePriceUrl,
            method: isAddMode ? 'POST' : 'PUT',
            moduleUrl: 'karma',
            body,
          });
          await isAddMode ? addServicePrice(newServicePrice) : updateServicePrice(newServicePrice);
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
    }

    updateBusinessService();
    chosenService ? changeActiveService(null)() : changeActiveTab('packages');
  };

  handleChangeActiveTab = toTab => () => this.props.changeActiveTab(toTab);

  render() {
    const { activeKey } = this.state;
    const {
      serviceTypes,
      filters,
      classes,
      chosenService,
      changeActiveService,
    } = this.props;

    return (
      <>
        <Collapse
          activeKey={activeKey}
          accordion
          bordered={false}
          expandIcon={({ isActive }) => <Icon type={isActive ? 'minus' : 'plus'} />}
          expandIconPosition="right"
          onChange={this.triggerPanel}
          className={b()}
        >
          <Panel
            className={b('panelHeader')}
            header="Основная информация об услуге"
            key="mainInfo"
          >
            <ServiceMainInfoForm
              serviceTypes={serviceTypes}
              servicePrice={chosenService}
              updateFormData={this.updateFormData}
            />
          </Panel>
          <Panel
            className={b('panelHeader')}
            header="Дополнительная информация"
            key="additionalInfo"
          >
            <ServiceAdditional
              filters={filters}
              servicePrice={chosenService}
              updateFormData={this.updateFormData}
            />
          </Panel>
          <Panel
            className={b('panelHeader')}
            header="Класс обслуживания"
            key="classes"
          >
            <ServiceClasses
              classes={classes}
              servicePrice={chosenService}
              updateFormData={this.updateFormData}
            />
          </Panel>
        </Collapse>
        <Row
          gutter={40}
          className={b('controlBtns')}
        >
          <Col lg={12}>
            <Button
              className={b('controlBtns-btn', { back: true })}
              onClick={chosenService
                ? changeActiveService(null)
                : this.handleChangeActiveTab('mainInfo')}
            >
              Назад
            </Button>
          </Col>
          <Col lg={12}>
            <Button
              className={b('controlBtns-btn')}
              onClick={this.handleUpdateBusinessService}
              type="primary"
            >
              Сохранить
            </Button>
          </Col>
        </Row>
      </>
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
