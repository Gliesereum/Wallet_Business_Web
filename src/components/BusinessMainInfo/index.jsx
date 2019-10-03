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
    uploadedCoverUrl: null,
    uploadedLogoUrl: null,
    readOnlyMode: !this.props.isAddBusinessMode,
  };

  onLoadCover = uploadedCoverUrl => this.setState({ uploadedCoverUrl });

  onLoadLogo = uploadedLogoUrl => this.setState({ uploadedLogoUrl });

  onLoadGallery = (uploadedGalleryImage, index) => this.props.addBusinessMedia(uploadedGalleryImage, index);

  handleToggleReadOnlyMode = bool => () => this.setState({ readOnlyMode: bool });

  handleCancel = () => {
    this.handleToggleReadOnlyMode(true)();
    this.mainInfoForm.props.form.resetFields();
    this.mainInfoForm.reset();
    this.setState({
      uploadedCoverUrl: null,
      uploadedLogoUrl: null,
    });
  };

  handleSubmit = async () => {
    const {
      updateBusiness,
      isAddBusinessMode,
      addNewBusiness,
      chosenBusiness,
      changeTabDisable,
      businessMedia,
    } = this.props;
    const {
      currentLocation,
      timeZone,
      uploadedCoverUrl,
      uploadedLogoUrl,
    } = this.state;

    this.mainInfoForm.props.form.validateFields(async (error, { businessTags, ...values }) => {
      if (!error) {
        const businessUrl = 'business';
        const method = isAddBusinessMode && !chosenBusiness ? 'POST' : 'PUT';
        const moduleUrl = 'karma';

        const body = {
          ...chosenBusiness,
          ...values,
          coverUrl: uploadedCoverUrl || (chosenBusiness ? chosenBusiness.coverUrl : null),
          logoUrl: uploadedLogoUrl || (chosenBusiness ? chosenBusiness.logoUrl : null),
          latitude: currentLocation ? currentLocation.lat : chosenBusiness.latitude,
          longitude: currentLocation ? currentLocation.lng : chosenBusiness.longitude,
          timeZone: timeZone || ((chosenBusiness && chosenBusiness.timeZone) ? chosenBusiness.timeZone : 0),
        };

        // updating|creating new business
        let newBusiness;
        try {
          newBusiness = await withToken(asyncRequest)({
            url: businessUrl, method, moduleUrl, body,
          });
          if (isAddBusinessMode && !chosenBusiness) {
            await addNewBusiness(newBusiness);
            changeTabDisable('services');
            changeTabDisable('workingSpace');
          } else {
            await updateBusiness(newBusiness);
          }

          // if user add new image to gallery, the system should add mediaType and objectId (businessId) for each
          // new image
          for (let i = 0; i < businessMedia.length; i += 1) {
            if (businessMedia[i]) {
              if (!businessMedia[i].objectId) businessMedia[i].objectId = newBusiness.id;
              if (!businessMedia[i].mediaType) businessMedia[i].mediaType = 'IMAGE';
            }
          }

          await fetchAction({
            url: 'business/media/list',
            method: 'POST',
            body: {
              list: businessMedia,
              objectId: newBusiness.id,
            },
          })();

          notification.success({
            description: 'Успешно',
            message: 'Оновленно',
            duration: 5,
          });

          this.handleToggleReadOnlyMode(true)();
        } catch (err) {
          notification.error({
            duration: 5,
            message: err.message || 'Ошибка',
            description: 'Ошибка',
          });
        }

        try {
          fetchAction({
            url: `business/tag/save?tagId=${businessTags}&businessId=${newBusiness.id}`,
            method: 'POST',
          })();
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

  deleteGalleryImage = async (id) => {
    const { deleteBusinessMedia } = this.props;

    await deleteBusinessMedia(id);
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
      businessMedia,
      defaultLanguage,
      phrases,
      hasAdminRights,
      businessTags,
      tags,
    } = this.props;
    const {
      businessCategories,
      deleteModalVisible,
      readOnlyMode,
      uploadedCoverUrl,
      uploadedLogoUrl,
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
          businessMedia={businessMedia}
          uploadedCoverUrl={uploadedCoverUrl}
          uploadedLogoUrl={uploadedLogoUrl}
          hasAdminRights={hasAdminRights}
          businessTags={businessTags}
          tags={tags}
          deleteGalleryImage={this.deleteGalleryImage}
          changeBusinessType={this.handleChangeBusinessType}
          changeCurrentLocation={this.changeCurrentLocation}
          changeCurrentTimeZone={this.changeCurrentTimeZone}
          onLoadCover={this.onLoadCover}
          onLoadLogo={this.onLoadLogo}
          onLoadGallery={this.onLoadGallery}
          defaultLanguage={defaultLanguage}
          phrases={phrases}
          readOnlyMode={readOnlyMode}
        />

        <Row
          type="flex"
          gutter={40}
          className={b('controlBtns')}
        >
          <Col
            xs={{ span: 24, order: 3 }}
            sm={{ span: 24, order: 3 }}
            md={{ span: 8, order: 1 }}
          >
            {
              readOnlyMode ? (
                <Button className={b('controlBtns-btn backBtn')}>
                  <Link to="/corporations">
                    <Icon type="left" />
                    {phrases['core.button.goToList'][defaultLanguage.isoKey]}
                  </Link>
                </Button>
              ) : (
                <Button
                  className={b('controlBtns-btn backBtn')}
                  onClick={this.handleCancel}
                >
                  {phrases['core.button.cancel'][defaultLanguage.isoKey]}
                </Button>
              )
            }
          </Col>
          <Col
            xs={{ span: 24, order: 2 }}
            sm={{ span: 24, order: 2 }}
            md={{ span: 8, order: 2 }}
          >
            {
              readOnlyMode && (
                <Button
                  className={b('controlBtns-btn deleteBtn')}
                  onClick={this.toggleDeleteModal}
                >
                  {phrases['businessPage.mainInfo.deleteBranch'][defaultLanguage.isoKey]}
                </Button>
              )
            }
          </Col>
          <Col
            xs={{ span: 24, order: 1 }}
            sm={{ span: 24, order: 1 }}
            md={{ span: 8, order: 3 }}
          >
            {
              readOnlyMode ? (
                <Button
                  className={b('controlBtns-btn')}
                  onClick={this.handleToggleReadOnlyMode(false)}
                  type="primary"
                >
                  {phrases['core.button.edit'][defaultLanguage.isoKey]}
                </Button>
              ) : (
                <Button
                  className={b('controlBtns-btn')}
                  onClick={this.handleSubmit}
                  type="primary"
                >
                  {phrases['core.button.save'][defaultLanguage.isoKey]}
                </Button>
              )
            }
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
  addBusinessMedia: (mediaUrl, index) => dispatch(actions.business.$addBusinessMedia(mediaUrl, index)),
  deleteBusinessMedia: id => dispatch(actions.business.$deleteBusinessMedia(id)),
});

export default compose(
  connect(null, mapDispatchToProps),
  withRouter,
)(BusinessMainInfo);
