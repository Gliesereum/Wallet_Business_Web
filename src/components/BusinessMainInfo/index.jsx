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

import {
  asyncRequest,
  asyncUploadFile,
  withToken,
} from '../../utils';
import { fetchAction } from '../../fetches';
import { actions } from '../../state';

const b = bem('businessMainInfo');

class BusinessMainInfo extends Component {
  state = {
    businessCategories: [],
    deleteModalVisible: false,
    currentLocation: null,
    logoUrl: this.props.chosenBusiness ? this.props.chosenBusiness.logoUrl : null,
    isError: false,
    fileLoader: false,
  };

  onUploaderChange = ({ file }) => {
    switch (file.status) {
      case 'uploading':
        this.setState({ fileLoader: true });
        break;
      case 'done':
        this.setState({ fileLoader: false });
        break;

      default:
        console.error('Error');
    }
  };

  uploadBusinessImage = async ({ file, onSuccess }) => {
    if ((file.size / 1024 / 1024) > 2) {
      this.setState({ isError: true });
      return;
    }
    const url = 'upload';
    const body = new FormData();
    await body.append('file', file);
    await body.append('open', true);
    const { url: imageUrl } = await withToken(asyncUploadFile)({ url, body, onSuccess });
    this.setState({ logoUrl: imageUrl, isError: false });
  };

  handleSubmit = async () => {
    const {
      updateBusiness,
      isAddBusinessMode,
      addNewBusiness,
      chosenBusiness,
      changeActiveTab,
      changeTabDisable,
    } = this.props;
    const { currentLocation, timeZone, logoUrl } = this.state;

    this.mainInfoForm.props.form.validateFields(async (error, values) => {
      if (!error) {
        const businessUrl = 'business';
        const method = isAddBusinessMode && !chosenBusiness ? 'POST' : 'PUT';
        const moduleUrl = 'karma';

        const body = {
          ...chosenBusiness,
          ...values,
          logoUrl,
          latitude: currentLocation ? currentLocation.lat : chosenBusiness.latitude,
          longitude: currentLocation ? currentLocation.lng : chosenBusiness.longitude,
          timeZone: timeZone || ((chosenBusiness && chosenBusiness.timeZone) ? chosenBusiness.timeZone : 0),
        };

        try {
          const newBusiness = await withToken(asyncRequest)({
            url: businessUrl, method, moduleUrl, body,
          });
          if (isAddBusinessMode && !chosenBusiness) {
            await addNewBusiness(newBusiness);
            changeTabDisable('services');
            changeTabDisable('workingSpace');
          } else {
            await updateBusiness(newBusiness);
          }
          changeActiveTab('schedule', newBusiness.id);
        } catch (err) {
          notification.error({
            duration: 5,
            message: err.message || 'Ошибка',
            description: 'Ошибка',
          });
        }
      }
    });
  };

  handleRemoveBusiness = async () => {
    const { removeBusiness, chosenBusiness, history } = this.props;
    const removeBusinessUrl = `business/${chosenBusiness.id}`;

    try {
      await withToken(asyncRequest)({ url: removeBusinessUrl, method: 'DELETE', moduleUrl: 'karma' });
      history.replace('/corporations');
      await removeBusiness(chosenBusiness.id);
    } catch (err) {
      notification.error({
        duration: 5,
        message: err.message || 'Ошибка',
        description: 'Ошибка',
      });
    }
  };

  changeCurrentLocation = (currentLocation) => {
    this.setState({
      currentLocation,
    });
  };

  changeCurrentTimeZone = timeZone => this.setState({ timeZone });

  handleChangeBusinessType = async (businessType) => {
    const { data } = await fetchAction({
      url: `business-category/by-business-type?businessType=${businessType}`,
      fieldName: 'businessCategories',
    })();
    const businessCategories = data.filter(category => category.active);
    this.setState({ businessCategories });
  };

  toggleDeleteModal = () => {
    this.setState(prevState => ({
      deleteModalVisible: !prevState.deleteModalVisible,
    }));
  };

  render() {
    const {
      isAddBusinessMode,
      corporations,
      businessTypes,
      chosenCorpId,
      chosenBusiness,
      defaultLanguage,
      phrases,
    } = this.props;
    const {
      businessCategories,
      deleteModalVisible,
      logoUrl,
      isError,
      fileLoader,
    } = this.state;

    return (
      <div className={b()}>
        <BusinessMainInfoForm
          wrappedComponentRef={form => this.mainInfoForm = form}
          isAddBusinessMode={isAddBusinessMode}
          corporations={corporations}
          businessCategories={businessCategories}
          businessTypes={businessTypes}
          chosenCorpId={chosenCorpId}
          chosenBusiness={chosenBusiness}
          isError={isError}
          loading={fileLoader}
          onChange={this.onUploaderChange}
          uploadBusinessImage={this.uploadBusinessImage}
          changeBusinessType={this.handleChangeBusinessType}
          logoUrl={logoUrl}
          changeCurrentLocation={this.changeCurrentLocation}
          changeCurrentTimeZone={this.changeCurrentTimeZone}
          defaultLanguage={defaultLanguage}
          phrases={phrases}
        />

        <Row
          gutter={40}
          className={b('controlBtns')}
        >
          <Col lg={isAddBusinessMode ? 12 : 8}>
            <Button className={b('controlBtns-btn backBtn')}>
              <Link to="/corporations">
                <Icon type="left" />
                {phrases['core.button.goToList'][defaultLanguage.isoKey]}
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
                  {phrases['businessPage.mainInfo.deleteBranch'][defaultLanguage.isoKey]}
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
              {
                isAddBusinessMode
                  ? phrases['core.button.save'][defaultLanguage.isoKey]
                  : phrases['core.button.goForward'][defaultLanguage.isoKey]
              }
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
              deletedName={chosenBusiness.name}
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
