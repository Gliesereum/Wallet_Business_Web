import React, {Component} from 'react';
import {connect} from 'react-redux';

import {List, notification, Button} from 'antd';

import {ServiceMainInfoForm, ServiceAdditional, Modal} from '../../../components';
import ServiceClasses from '../ServiceClasses';

import {asyncRequest, withToken} from '../../../utils';
import {actions} from '../../../state';

const MODALS = {
  MAIN_INFO: ServiceMainInfoForm,
  ADDITIONAL: ServiceAdditional,
  CLASSES: ServiceClasses,
};

class BusinessServicesList extends Component {
  state = {
    serviceTypes: [],
    filters: [],
    classes: [],
    modal: {},
  };

  componentDidMount() {
    this.initLoad();
  }

  initLoad = async () => {
    const {singleBusiness} = this.props;

    const serviceTypesUrl = `service/by-business-category?businessCategoryId=${singleBusiness.businessCategoryId}`;
    const filtersUrl = `filter/by-business-category?businessCategoryId=${singleBusiness.businessCategoryId}`;
    const classesUrl = 'class';

    try {
      const [serviseTypesList, classesList, filtersList] = await Promise
        .all([
          withToken(asyncRequest)({url: serviceTypesUrl, moduleUrl: 'karma'}),
          withToken(asyncRequest)({url: classesUrl, moduleUrl: 'karma'}),
          withToken(asyncRequest)({url: filtersUrl, moduleUrl: 'karma'}),
        ]);

      this.setState(() => ({
        serviceTypes: serviseTypesList || [],
        filters: filtersList || [],
        classes: classesList || [],
      }));
    } catch (err) {
      notification.error({
        duration: 5,
        message: err.message || 'Ошибка',
        description: 'Возникла ошибка',
      });
    }
  };

  triggerServiceModal = (modalName, bool, item, addNewMod = false) => () => {
    this.setState({
      modal: {
        visible: bool,
        Component: modalName,
        modalService: item,
        addNewMod: addNewMod,
      }
    });
  };

  handleRemoveService = (item) => async () => {
    const {removeServicePrice, singleBusiness} = this.props;
    const removeServicePriceUrl = `price/${item.id}`;

    try {
      await withToken(asyncRequest)({url: removeServicePriceUrl, method: 'DELETE', moduleUrl: 'karma'});
      await removeServicePrice({servicePriceId: item.id, businessId: singleBusiness.id});

    } catch (err) {
      notification.error({
        duration: 5,
        message: err.message || 'Ошибка',
        description: 'Возникла ошибка',
      });
    }
  };

  render() {
    const {singleBusiness, servicePrices} = this.props;
    const {MAIN_INFO, ADDITIONAL, CLASSES} = MODALS;
    const services = servicePrices[singleBusiness.id];
    const {modal, serviceTypes, filters, classes} = this.state;

    return (
      <>
        <Button
          onClick={this.triggerServiceModal(MAIN_INFO, true, null, true)}
          type="primary"
        >
          Add service
        </Button>
        <List
          itemLayout="horizontal"
          dataSource={services}
          renderItem={item => (
            <List.Item
              actions={[
                <Button onClick={this.triggerServiceModal(MAIN_INFO, true, item)}>Основная информация</Button>,
                <Button onClick={this.triggerServiceModal(ADDITIONAL, true, item)}>Допольнительно</Button>,
                <Button onClick={this.triggerServiceModal(CLASSES, true, item)}>Класс обслуживания</Button>,
                <Button onClick={this.handleRemoveService(item)} type="primary">Удалить услугу</Button>,
              ]}>
              <List.Item.Meta
                title={item.name}
                description={item.description}
              />
            </List.Item>
          )}
        />
        {modal.visible && (
          <Modal
            visible={modal.visible}
            footer={null}
            closable={false}
          >
            {<modal.Component
              serviceTypes={serviceTypes}
              filters={filters}
              classes={classes}
              servicePrice={modal.modalService}
              onCancel={this.triggerServiceModal}
              modals={MODALS}
              addNewMod={modal.addNewMod}
              businessId={singleBusiness.id}
            />}
          </Modal>
        )}
      </>
    )
  }
}

const mapDispatchToProps = dispatch => ({
  removeServicePrice: servicePrice => dispatch(actions.business.$removeServicePrice(servicePrice)),
});

export default connect(null, mapDispatchToProps)(BusinessServicesList);
