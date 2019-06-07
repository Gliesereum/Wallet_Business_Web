import React, { Component } from 'react';
import bem from 'bem-join';

import {
  Button,
  Col,
  Collapse,
  Icon,
  Row,
} from 'antd';

import { ServiceMainInfoForm, ServiceAdditional } from '../Forms';
// import { ServiceClasses } from '../../../../../components';

import './index.scss';

const { Panel } = Collapse;
const b = bem('businessServiceInfo');

class BusinessServiceInfo extends Component {
  state = {
    activeKey: 'mainInfo',
  };

  triggerPanel = activeKey => this.setState({ activeKey });

  handleChangeActiveTab = (toTab, id) => () => this.props.changeActiveTab(toTab, id);

  render() {
    const { activeKey } = this.state;
    const {
      serviceTypes,
      filters,
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
            />
          </Panel>
          <Panel
            className={b('panelHeader')}
            header="Класс обслуживания"
            key="classes"
          >
            classes
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
              onClick={this.handleChangeActiveTab('packages')}
              type="primary"
            >
              Далее
            </Button>
          </Col>
        </Row>
      </>
    );
  }
}

export default BusinessServiceInfo;
