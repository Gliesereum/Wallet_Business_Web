import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';
import bem from 'bem-join';
import { connect } from 'react-redux';
import compose from 'recompose/compose';

import {
  Button,
  Col,
  Icon,
  notification,
  Row,
} from 'antd';

import { BusinessMainInfoForm } from '../Forms';
import DeleteModal from '../DeleteModal';
import { defaultGeoPosition } from '../Map/mapConfig';

import { asyncRequest, withToken } from '../../utils';

import { actions } from '../../state';

const b = bem('businessMainInfo');

class BusinessMainInfo extends Component {
  state = {
    deleteModalVisible: false,
    currentLocation: defaultGeoPosition,
  };

  handleSubmit = async () => {
    const {
      updateBusiness,
      isAddBusinessMode,
      addNewBusiness,
      singleBusiness,
      changeActiveTab,
      changeTabDisable,
    } = this.props;
    const { currentLocation, timeZone } = this.state;

    this.mainInfoForm.props.form.validateFields(async (error, values) => {
      if (!error) {
        const businessUrl = 'business';
        const method = isAddBusinessMode && !singleBusiness ? 'POST' : 'PUT';
        const moduleUrl = 'karma';

        const body = {
          ...singleBusiness,
          ...values,
          latitude: currentLocation ? currentLocation.lat : singleBusiness.latitude,
          longitude: currentLocation ? currentLocation.lng : singleBusiness.longitude,
          timeZone: timeZone || ((singleBusiness && singleBusiness.timeZone) ? singleBusiness.timeZone : 0),
        };

        try {
          const newBusiness = await withToken(asyncRequest)({
            url: businessUrl, method, moduleUrl, body,
          });
          if (isAddBusinessMode && !singleBusiness) {
            await addNewBusiness(newBusiness);
            changeTabDisable('services');
          } else {
            await updateBusiness(newBusiness);
          }
          changeActiveTab('services', newBusiness.id);
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

  handleRemoveBusiness = async () => {
    const { removeBusiness, singleBusiness, history } = this.props;
    const removeBusinessUrl = `business/${singleBusiness.id}`;

    try {
      await withToken(asyncRequest)({ url: removeBusinessUrl, method: 'DELETE', moduleUrl: 'karma' });
      history.replace('/corporations');
      await removeBusiness(singleBusiness.id);
    } catch (err) {
      notification.error({
        duration: 5,
        message: err.message || 'Ошибка',
        description: 'Возникла ошибка',
      });
    }
  };

  changeCurrentLocation = (currentLocation) => {
    this.setState({
      currentLocation,
    });
  };

  changeCurrentTimeZone = timeZone => this.setState({ timeZone });

  toggleDeleteModal = () => {
    this.setState(prevState => ({
      deleteModalVisible: !prevState.deleteModalVisible,
    }));
  };

  render() {
    const {
      isAddBusinessMode,
      corporations,
      businessCategories,
      businessTypes,
      chosenCorpId,
      singleBusiness,
    } = this.props;
    const { deleteModalVisible } = this.state;

    return (
      <div className={b()}>
        <BusinessMainInfoForm
          wrappedComponentRef={form => this.mainInfoForm = form}
          isAddBusinessMode={isAddBusinessMode}
          corporations={corporations}
          businessCategories={businessCategories}
          businessTypes={businessTypes}
          chosenCorpId={chosenCorpId}
          singleBusiness={singleBusiness}
          changeCurrentLocation={this.changeCurrentLocation}
          changeCurrentTimeZone={this.changeCurrentTimeZone}
        />

        <Row
          gutter={40}
          className={b('controlBtns')}
        >
          <Col lg={isAddBusinessMode ? 12 : 8}>
            <Button className={b('controlBtns-btn backBtn')}>
              <Link to="/corporations">
                <Icon type="left" />
                Назад к списку
              </Link>
            </Button>
          </Col>
          {
            !isAddBusinessMode && (
              <Col lg={8}>
                <Button
                  className={b('controlBtns-btn deleteBtn')}
                  onClick={this.toggleDeleteModal}
                >
                  Удалить бизнес
                </Button>
              </Col>
            )
          }
          <Col lg={isAddBusinessMode ? 12 : 8}>
            <Button
              className={b('controlBtns-btn')}
              onClick={this.handleSubmit}
              type="primary"
            >
              {isAddBusinessMode ? 'Сохранить' : 'Далее'}
            </Button>
          </Col>
        </Row>

        {
          deleteModalVisible && (
            <DeleteModal
              visible={deleteModalVisible}
              okText="Удалить"
              cancelText="Отменить"
              onOk={this.handleRemoveBusiness}
              onCancel={this.toggleDeleteModal}
              deletedName={singleBusiness.name}
              deletedItem="бизнес"
            />
          )
        }
      </div>
    );
  }
}

const mapDispatchToProps = dispatch => ({
  addNewBusiness: newBusiness => dispatch(actions.business.$addNewBusiness(newBusiness)),
  updateBusiness: newBusiness => dispatch(actions.business.$updateBusiness(newBusiness)),
  removeBusiness: businessId => dispatch(actions.business.$removeBusiness(businessId)),
});

export default compose(
  connect(null, mapDispatchToProps),
  withRouter,
)(BusinessMainInfo);
